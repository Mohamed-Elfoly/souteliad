# Sign Service — Arabic Sign Language AI

FastAPI microservice that classifies Arabic Sign Language from short videos using the **SwinV2-ArASL** model (99.41% accuracy on 32 letter classes).

## Setup

```bash
# 1) Create Python 3.11 venv
py -3.11 -m venv venv
venv\Scripts\Activate.ps1

# 2) Install deps
pip install -r requirements.txt
pip install timm torchvision

# 3) Download model (332MB) — required, not in git
cd ../arabic-sign-pavly/models
curl -L -o asl_swinv2_best.pth https://github.com/pavlyhalim/Arabic-Sign-Language/releases/download/v2.0/asl_swinv2_best.pth
```

## Run

```bash
cd sign-service
venv\Scripts\Activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000
```

Service URL: `http://localhost:8000`

The Node backend (`backend/utils/signAI.js`) reads `SIGN_SERVICE_URL` from `config.env`. Falls back to Gemini Vision if this service is offline.

## Endpoints

- `GET /` — health check
- `POST /predict` — multipart upload (`video` field + optional `expected`)
