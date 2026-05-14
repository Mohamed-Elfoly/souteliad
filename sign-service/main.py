"""
Arabic Sign Language Recognition Service (Swin V2 - ArASL)
Uses pavlyhalim/Arabic-Sign-Language SwinV2 model trained on ArASL dataset
99.41% validation accuracy on 32 Arabic letter classes.

Strategy:
- Sample N frames from the uploaded video
- Crop the hand from each frame using MediaPipe HandLandmarker
- Run SwinV2 on each cropped hand
- Aggregate predictions (majority vote + average confidence)

Run:
    uvicorn main:app --host 0.0.0.0 --port 8000
"""
import os
import sys
import io
import json
import tempfile
import time
from collections import Counter, defaultdict

import cv2
import numpy as np
import torch
import torch.nn.functional as F
import timm
import mediapipe as mp
from torchvision import transforms
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

# UTF-8 stdout for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", line_buffering=True)

# ---------- Paths ----------
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODELS_DIR, "asl_swinv2_best.pth")
META_PATH = os.path.join(MODELS_DIR, "asl_swinv2_meta.json")

DEBUG_DIR = os.path.join(os.path.dirname(__file__), "debug_logs")
os.makedirs(DEBUG_DIR, exist_ok=True)

# ---------- Config ----------
N_SAMPLE_FRAMES = 8  # Sample 8 frames evenly across the video
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[startup] Device: {DEVICE}")

# ---------- Load meta + classes ----------
with open(META_PATH) as f:
    meta = json.load(f)

IMG_SIZE = meta["img_size"]
CLASSES = meta["classes"]
print(f"[startup] Model: {meta['model_name']}")
print(f"[startup] Classes: {len(CLASSES)} | Val acc: {meta.get('best_val_acc', 0):.2f}%")

# English class name → (Arabic letter, English label)
LABEL_TO_ARABIC = {
    "ain": "ع",   "al": "ال",  "aleff": "أ",  "bb": "ب",
    "dal": "د",   "dha": "ط",  "dhad": "ض",   "fa": "ف",
    "gaaf": "ج",  "ghain": "غ", "ha": "ه",     "haa": "ه",
    "jeem": "ج",  "kaaf": "ك", "khaa": "خ",   "la": "لا",
    "laam": "ل",  "meem": "م", "nun": "ن",    "ra": "ر",
    "saad": "ص",  "seen": "س", "sheen": "ش",  "ta": "ت",
    "taa": "ط",   "thaa": "ث", "thal": "ذ",   "toot": "ت",
    "waw": "و",   "ya": "ى",   "yaa": "ي",    "zay": "ز",
}

# ---------- Load SwinV2 model ----------
print("[startup] Loading SwinV2 model...")
model = timm.create_model(meta["model_name"], pretrained=False, num_classes=len(CLASSES))
state = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=True)
model.load_state_dict(state)
model.to(DEVICE)
model.eval()
print("[startup] SwinV2 loaded")

preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(meta["normalize_mean"], meta["normalize_std"]),
])

# ---------- Use simple MediaPipe Hands API (more reliable in batch mode) ----------
mp_hands = mp.solutions.hands


def crop_hand(frame, hands_processor):
    """Detect hand in BGR frame, return cropped hand region (square, padded)."""
    h, w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands_processor.process(rgb)
    if not results.multi_hand_landmarks:
        return None

    landmarks = results.multi_hand_landmarks[0].landmark
    x_coords = [lm.x for lm in landmarks]
    y_coords = [lm.y for lm in landmarks]
    x_min, x_max = int(min(x_coords) * w), int(max(x_coords) * w)
    y_min, y_max = int(min(y_coords) * h), int(max(y_coords) * h)

    # Make square with padding (35% of larger dimension)
    cx, cy = (x_min + x_max) // 2, (y_min + y_max) // 2
    pad = int(max(x_max - x_min, y_max - y_min) * 0.35)
    half = max(x_max - x_min, y_max - y_min) // 2 + pad
    x1, y1 = max(0, cx - half), max(0, cy - half)
    x2, y2 = min(w, cx + half), min(h, cy + half)

    if x2 - x1 < 20 or y2 - y1 < 20:
        return None
    return frame[y1:y2, x1:x2]


def predict_image(img_bgr):
    """Run SwinV2 on a single hand-cropped image. Returns (label_idx, confidence, all_probs)."""
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    tensor = preprocess(rgb).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1)[0].cpu().numpy()
    idx = int(np.argmax(probs))
    return idx, float(probs[idx]), probs


def sample_frame_indices(total_frames, n):
    if total_frames <= n:
        return list(range(total_frames))
    return np.linspace(0, total_frames - 1, n, dtype=int).tolist()


def process_video(video_path, debug_id=None):
    """Read video, sample N frames, crop hands, run model on each, aggregate."""
    if debug_id:
        run_dir = os.path.join(DEBUG_DIR, debug_id)
        os.makedirs(run_dir, exist_ok=True)
        try:
            ext = os.path.splitext(video_path)[1]
            with open(video_path, "rb") as src, open(os.path.join(run_dir, f"input{ext}"), "wb") as dst:
                dst.write(src.read())
        except Exception as e:
            print(f"[debug] Failed to copy video: {e}")

    # Read ALL frames sequentially (don't trust frame count metadata on webm)
    cap = cv2.VideoCapture(video_path)
    all_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        all_frames.append(frame)
    cap.release()

    total = len(all_frames)
    print(f"[predict] Total frames (sequential read): {total}")

    if total == 0:
        return None

    indices = sample_frame_indices(total, N_SAMPLE_FRAMES)
    print(f"[predict] Sampling {len(indices)} frames at indices: {indices}")

    frames = []
    for i in indices:
        frame = cv2.flip(all_frames[i], 1)  # mirror like webcam preview
        frames.append((i, frame))

    if not frames:
        return None

    # Run hand detection + classification on each sampled frame
    per_frame_results = []
    all_probs_accumulator = np.zeros(len(CLASSES), dtype=np.float32)
    successful = 0

    with mp_hands.Hands(
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.4,
    ) as hands_processor:
        for frame_idx, frame in frames:
            cropped = crop_hand(frame, hands_processor)
            if cropped is None:
                print(f"[predict] Frame {frame_idx}: NO HAND")
                continue
            idx, conf, probs = predict_image(cropped)
            label = CLASSES[idx]
            arabic = LABEL_TO_ARABIC.get(label, "?")
            print(f"[predict] Frame {frame_idx}: '{arabic}' ({label}) conf={conf:.3f}")
            per_frame_results.append((label, arabic, conf, probs))
            all_probs_accumulator += probs
            successful += 1

            if debug_id:
                # Save cropped hand image
                cv2.imwrite(
                    os.path.join(DEBUG_DIR, debug_id, f"hand_{frame_idx:03d}_{label}_{int(conf*100)}.jpg"),
                    cropped,
                )

    if successful == 0:
        print("[predict] No hand detected in any frame")
        return None

    # Aggregate: averaged probabilities across all successful frames
    avg_probs = all_probs_accumulator / successful
    top5_idx = np.argsort(avg_probs)[-5:][::-1].tolist()
    top5 = [
        {
            "label": CLASSES[i],
            "sign_arabic": LABEL_TO_ARABIC.get(CLASSES[i], "?"),
            "confidence": float(avg_probs[i]),
        }
        for i in top5_idx
    ]

    pred_idx = int(np.argmax(avg_probs))
    return {
        "predicted_label": CLASSES[pred_idx],
        "predicted_arabic": LABEL_TO_ARABIC.get(CLASSES[pred_idx], "?"),
        "confidence": float(avg_probs[pred_idx]),
        "top5": top5,
        "frames_with_hand": successful,
        "frames_sampled": len(frames),
    }


# ---------- FastAPI ----------
app = FastAPI(title="Arabic Sign Language Recognition (SwinV2 ArASL 99.4%)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {
        "status": "ok",
        "model": "SwinV2-ArASL",
        "device": str(DEVICE),
        "n_classes": len(CLASSES),
        "accuracy": meta.get("best_val_acc"),
    }


@app.post("/predict")
async def predict(video: UploadFile = File(...), expected: str = Form("")):
    debug_id = time.strftime("%Y%m%d_%H%M%S")
    print(f"\n{'='*60}\n[predict] New request - debug_id={debug_id}  expected='{expected}'")

    suffix = ".webm" if video.filename and video.filename.endswith(".webm") else ".mp4"
    video_bytes = await video.read()
    print(f"[predict] Video size: {len(video_bytes)} bytes  filename={video.filename}")

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(video_bytes)
        tmp_path = tmp.name

    try:
        result = process_video(tmp_path, debug_id=debug_id)
        if result is None:
            return {
                "error": "No hand detected in video",
                "predicted": None,
                "confidence": 0.0,
                "matches": False,
                "matches_top5": False,
                "top5": [],
            }

        matches_top1 = result["predicted_arabic"].strip() == expected.strip()
        matches_top5 = any(
            item["sign_arabic"].strip() == expected.strip() for item in result["top5"]
        ) if expected else False

        print(f"[predict] PREDICTED: '{result['predicted_arabic']}' ({result['predicted_label']}) conf={result['confidence']:.3f}")
        print(f"[predict] Hand detected in {result['frames_with_hand']}/{result['frames_sampled']} frames")
        print(f"[predict] TOP-5:")
        for item in result["top5"]:
            print(f"           {item['sign_arabic']:>4} ({item['label']:<8}) conf={item['confidence']:.3f}")
        print(f"[predict] Expected='{expected}'  matches_top1={matches_top1}  matches_top5={matches_top5}")
        print(f"[predict] Debug frames: {os.path.join(DEBUG_DIR, debug_id)}")

        return {
            "predicted": result["predicted_arabic"],
            "predicted_label": result["predicted_label"],
            "confidence": result["confidence"],
            "expected": expected,
            "matches": matches_top1,
            "matches_top5": matches_top5,
            "top5": [
                {
                    "label_index": i,
                    "sign_arabic": item["sign_arabic"],
                    "sign_english": item["label"],
                    "confidence": item["confidence"],
                }
                for i, item in enumerate(result["top5"])
            ],
            "frames_with_hand": result["frames_with_hand"],
            "frames_sampled": result["frames_sampled"],
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
