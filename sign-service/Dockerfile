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

# Copy app code
COPY . .

# Download the model to /app/models during the build (no volume needed)
RUN mkdir -p /app/models && \
    curl -L -o /app/models/asl_swinv2_best.pth \
    https://github.com/pavlyhalim/Arabic-Sign-Language/releases/download/v2.0/asl_swinv2_best.pth

# Default paths point to the baked-in model
ENV MODEL_PATH=/app/models/asl_swinv2_best.pth
ENV META_PATH=/app/models/asl_swinv2_meta.json

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
