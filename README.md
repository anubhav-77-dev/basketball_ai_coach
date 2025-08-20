# Basketball AI Coach

An intelligent basketball coaching application that uses computer vision and AI to analyze basketball shots and provide personalized feedback to players.

## 🏀 Features

- **Real-time Shot Analysis**: Analyze basketball shots using computer vision
- **3D Ball Trajectory Visualization**: Interactive 3D visualization of ball paths
- **AI-Powered Feedback**: Get personalized coaching feedback using AI
- **Pose Detection**: Track player movements and form
- **Video Processing**: Upload and analyze basketball videos
- **Progress Tracking**: Monitor improvement over time

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Three.js** for 3D visualizations
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Backend
- **Python** with FastAPI
- **OpenCV** for computer vision
- **YOLO** for object detection
- **MediaPipe** for pose detection
- **Anthropic Claude** for AI feedback

### AI/ML
- **Ultralytics YOLO** for ball detection
- **MediaPipe Pose** for player tracking
- **Custom trained models** for basketball-specific analysis

## 📁 Project Structure

```
basketball_ai_coach/
├── website_basketball/          # Main React application
│   ├── components/              # React components
│   ├── services/                # API services
│   ├── utils/                   # Utility functions
│   ├── context/                 # React context
│   ├── public/                  # Static assets
│   ├── best.pt                  # Custom trained YOLO model ✅
│   └── yolov8n.pt               # YOLO base model ✅
├── server/                      # Python backend
│   ├── app.py                   # FastAPI application
│   ├── ball_tracker.py          # Ball tracking logic
│   └── llm_service.py           # AI service integration
├── 3d-version/                  # 3D visualization components
│   ├── best.pt                  # 3D analysis model ✅
│   └── yolov8n.pt               # 3D YOLO model ✅
├── detect_ball.py               # YOLO ball detection script
├── .gitattributes               # Git LFS configuration ✅
├── SETUP.md                     # Complete setup guide ✅
└── requirements.txt             # Python dependencies ✅
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.9+
- Git
- Git LFS (Large File Storage)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/anubhav-77-dev/basketball_ai_coach.git
cd basketball_ai_coach

# 2. Install Git LFS and download large files
# macOS:
brew install git-lfs
git lfs install
git lfs pull

# Windows/Linux:
# Download from https://git-lfs.github.com/
git lfs install
git lfs pull

# 3. Frontend Setup
cd website_basketball
npm install
npm start

# 4. Backend Setup (in another terminal)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python server/app.py
```

### Detailed Setup
For comprehensive setup instructions, see [SETUP.md](SETUP.md).

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# AI Service API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key

# Server Configuration
SERVER_PORT=8000
CORS_ORIGINS=http://localhost:3000

# Model Paths (automatically configured)
YOLO_MODEL_PATH=website_basketball/best.pt
```

## 📖 Usage

1. **Upload Video**: Upload a basketball video through the web interface
2. **Analysis**: The system will automatically detect the ball and player poses
3. **Review Results**: View the 3D trajectory and analysis results
4. **Get Feedback**: Receive AI-powered coaching feedback
5. **Track Progress**: Monitor your improvement over time

## 🎯 Key Features

### Ball Detection
- Uses custom-trained YOLO model specifically for basketball detection ✅
- Real-time tracking with confidence scoring
- Handles various lighting conditions and angles

### Pose Analysis
- MediaPipe integration for player pose detection
- Form analysis and correction suggestions
- Movement pattern recognition

### AI Coaching
- Anthropic Claude integration for natural language feedback
- Personalized recommendations based on skill level
- Detailed analysis of shooting mechanics

### 3D Visualization
- Three.js powered 3D ball trajectory
- Interactive camera controls
- Real-time rendering of shot paths

## 📊 Included Models

| Model File | Size | Purpose | Status |
|------------|------|---------|--------|
| `website_basketball/best.pt` | 6.0MB | Custom basketball detection | ✅ Included |
| `website_basketball/yolov8n.pt` | 6.2MB | Base YOLO model | ✅ Included |
| `website_basketball/3d-version/best.pt` | 6.0MB | 3D analysis model | ✅ Included |
| `website_basketball/3d-version/yolov8n.pt` | 6.2MB | 3D YOLO model | ✅ Included |

**Total Model Size**: ~24.4MB (efficiently managed with Git LFS)

## 🎯 Large Files Management

This repository uses **Git LFS (Large File Storage)** to efficiently handle large model files:

- ✅ **All models included** - No missing files
- ✅ **Fast repository** - Git LFS keeps repo size manageable
- ✅ **Automatic download** - `git lfs pull` gets all large files
- ✅ **Version control** - Track model changes over time
- ✅ **Professional approach** - Industry-standard solution

For detailed information, see [LARGE_FILES_GUIDE.md](LARGE_FILES_GUIDE.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ultralytics](https://github.com/ultralytics/ultralytics) for YOLO implementation
- [MediaPipe](https://mediapipe.dev/) for pose detection
- [Anthropic](https://www.anthropic.com/) for AI capabilities
- [Three.js](https://threejs.org/) for 3D graphics

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Note**: This repository includes all necessary model files and is ready to use immediately after setup. Large files are efficiently managed with Git LFS for optimal performance. 🚀 
