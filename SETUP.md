# Basketball AI Coach - Setup Guide

## 🚀 Quick Start

This guide will help you set up the Basketball AI Coach application with all necessary files and dependencies.

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.9+
- Git LFS (Large File Storage)
- Git

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/anubhav-77-dev/basketball_ai_coach.git
cd basketball_ai_coach
```

### 2. Install Git LFS (if not already installed)

**macOS:**
```bash
brew install git-lfs
git lfs install
```

**Windows:**
```bash
# Download from https://git-lfs.github.com/
git lfs install
```

**Linux:**
```bash
sudo apt-get install git-lfs
git lfs install
```

### 3. Pull Large Files

```bash
git lfs pull
```

This will download all the large model files (YOLO models, etc.) that are stored using Git LFS.

### 4. Frontend Setup

```bash
cd website_basketball
npm install
npm start
```

### 5. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python server/app.py
```

## 📁 Essential Files Structure

After running `git lfs pull`, you should have:

```
basketball_ai_coach/
├── best.pt                    # Your custom YOLO model (Git LFS)
├── yolov8*.pt                 # YOLO model files (Git LFS)
├── website_basketball/        # React frontend
├── server/                    # Python backend
├── 3d-version/               # 3D visualization components
└── detect_ball.py            # Ball detection script
```

## 🔑 Environment Configuration

Create a `.env` file in the root directory:

```env
# AI Service API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
SERVER_PORT=8000
CORS_ORIGINS=http://localhost:3000

# Model Paths (these should be relative to the project root)
YOLO_MODEL_PATH=best.pt
```

## 🎯 How Large Files Work

### Git LFS (Large File Storage)

This project uses Git LFS to handle large files efficiently:

- **What it does**: Stores large files (models, videos, images) in a separate storage system
- **Benefits**: 
  - Keeps repository size small
  - Fast cloning and fetching
  - Version control for large files
  - Automatic downloading when needed

### File Types Handled by Git LFS

- **Model files**: `*.pt`, `*.pth`, `*.onnx`, `*.weights`, `*.model`
- **Media files**: `*.mp4`, `*.mov`, `*.jpg`, `*.png`, etc.
- **Data files**: `*.csv`, `*.json`, `*.yaml`, etc.

### Commands for Large Files

```bash
# Download all large files
git lfs pull

# Check which files are tracked by LFS
git lfs ls-files

# Track new large files
git lfs track "*.pt"
git add .gitattributes
git add your_model.pt
```

## 🛠️ Alternative Setup Methods

### Option 1: Manual Model Download

If you prefer not to use Git LFS, you can manually download the model files:

1. **Download your custom model**: Place your `best.pt` file in the project root
2. **Download YOLO models**: Download from Ultralytics or your preferred source
3. **Update paths**: Modify the code to point to your local model files

### Option 2: Model Hosting Service

You can host your models on a cloud service:

1. **Upload models** to Google Drive, AWS S3, or similar
2. **Create download scripts** to fetch models during setup
3. **Update configuration** to use hosted model URLs

### Option 3: Docker Setup

For consistent environments, you can use Docker:

```dockerfile
# Example Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN git lfs pull

EXPOSE 8000
CMD ["python", "server/app.py"]
```

## 🔍 Troubleshooting

### Common Issues

1. **"Model file not found"**
   - Run `git lfs pull` to download large files
   - Check if model files exist in the expected locations
   - Verify file paths in your configuration

2. **"Git LFS not installed"**
   - Install Git LFS using the commands above
   - Run `git lfs install` to configure it

3. **"Large files not downloading"**
   - Check your internet connection
   - Try `git lfs fetch --all` to force download
   - Verify `.gitattributes` file is present

4. **"Permission denied"**
   - Check file permissions on model files
   - Ensure you have read access to the files

### Verification Commands

```bash
# Check if Git LFS is working
git lfs version

# List all LFS-tracked files
git lfs ls-files

# Check file sizes
ls -lh *.pt

# Verify model files are accessible
python -c "import torch; model = torch.load('best.pt'); print('Model loaded successfully')"
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure Git LFS is properly configured
4. Check that all large files are downloaded
5. Open an issue on GitHub with detailed error messages

## 🎉 Success Indicators

Your setup is complete when:

- ✅ Frontend runs on `http://localhost:3000`
- ✅ Backend runs on `http://localhost:8000`
- ✅ Model files are present and accessible
- ✅ No "file not found" errors in console
- ✅ Application can process basketball videos

---

**Note**: The application requires the large model files to function properly. Git LFS ensures these files are available while keeping the repository manageable. 