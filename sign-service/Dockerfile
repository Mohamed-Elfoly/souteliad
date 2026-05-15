FROM python:3.11-slim

# System deps for OpenCV + MediaPipe
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir timm torchvision

# Copy app code (excluding venv/models via .dockerignore)
COPY . .

# Model is loaded from /models (Railway Volume mounted at runtime)
# DO NOT COPY the .pth file into the image — it's huge and loaded externally
ENV MODEL_PATH=/models/asl_swinv2_best.pth

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
