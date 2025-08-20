  # Shot Doctor AI

## Overview How It Works
1. **Pose Detection:**
   - Uses MediaPipe Pose to estimate body keypoints on each video frame.
   - Draws pose skeleton and landmarks on a canvas overlay.
   - Calculates 3D positions of all body joints.

2. **Ball Detection:**
   - Uses YOLOv8, fine-tuned on basketball images, to detect the ball in each frame.
   - YOLO detection results are precomputed and stored as JSON files (one per frame).
   - The app preloads all YOLO JSONs for instant overlay during playback.

3. **Joint Angle Calculation:**
   - Calculates key joint angles relevant to basketball shooting form:
     - Elbow angle (shooting arm)
     - Shoulder angle
     - Knee bend
     - Hip angle
     - Trunk angle (alignment)
     - Wrist flexion
   - All angles are calculated in 3D space for greater accuracy.

4. **Real-time AI Coaching:**
   - Joint angle data is sent to the Gemini AI API for analysis.
   - AI provides real-time feedback on shooting form.
   - Feedback is displayed as an overlay on the video.
   - Throttled to avoid excessive API calls.

5. **Comprehensive Analysis:**
   - After video completion, a complete shot analysis is generated.
   - Includes statistical analysis of joint angles throughout the shot.
   - Provides actionable coaching advice for improving shooting form.ctor AI is a web application that analyzes basketball shooting form from user-uploaded videos. It uses real-time pose estimation (MediaPipe) and custom-trained YOLOv8 ball detection to provide instant, visual feedback and analytics. The app features both 2D and 3D visualization options with real-time joint angle calculation and AI-powered coaching feedback.

## Features
- Upload and analyze basketball shooting videos
- Real-time pose tracking overlay (body keypoints and skeleton)
- Real-time basketball detection overlay (green box)
- Both overlays are perfectly synced and drawn on the same canvas
- **3D visualization with interactive camera controls**
- **View basketball shots from any angle in 3D space**
- **NEW: Real-time joint angle calculations for shooting mechanics**
- **NEW: AI-powered coaching feedback based on joint angles**
- **NEW: Comprehensive shot analysis after video completion**
- Fast, in-browser processing (no backend required for inference)
- Modular UI components for progress, steps, and feedback

## Tech Stack
- React (Vite)
- TypeScript
- MediaPipe Pose (Google)
- YOLOv8 (Ultralytics, custom-trained)
- Three.js (3D rendering)
- React Three Fiber (React bindings for Three.js)
- Gemini AI API (for real-time coaching feedback)
- Tailwind CSS (for styling)

## How It Works
1. **Pose Detection:**
   - Uses MediaPipe Pose to estimate body keypoints on each video frame.
   - Draws pose skeleton and landmarks on a canvas overlay.
2. **Ball Detection:**
   - Uses YOLOv8, fine-tuned on basketball images, to detect the ball in each frame.
   - YOLO detection results are precomputed and stored as JSON files (one per frame).
   - The app preloads all YOLO JSONs for instant overlay during playback.
3. **Overlay Pipeline:**
   - Both pose and ball overlays are drawn on the same canvas, synced to the video’s current time.
   - Works smoothly during both playback and pause.

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add your Gemini API key: `API_KEY=your_gemini_api_key_here`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to the local address (usually http://localhost:5173/)
   - Toggle between 2D and 3D views using the buttons
   - Enable "Analysis Mode" to see real-time joint angle feedback
   - Wait for the video to complete for a comprehensive analysis

5. **Analyzing Your Own Videos:**
   - Replace the sample video with your own basketball shot footage
   - For optimal results, ensure the camera has a clear side view
   - Wear form-fitting clothing for better pose detection

## Customizing or Retraining YOLO
- To improve ball detection, retrain YOLOv8 on your own dataset (see Ultralytics docs).
- Export detection results as JSON (one per frame) and place them in `public/yolo_results/`.

## File Structure
- `components/PoseYoloOverlay.tsx` — 2D overlay component (pose + ball)
- `components/Pose3DOverlay.tsx` — 3D visualization component (Three.js)
- `public/yolo_results/` — YOLO detection JSONs (one per frame)
- `public/final_ball.mov` — Example basketball video
- `App.tsx` — Main app entry point with view toggle

## Credits
- [MediaPipe](https://mediapipe.dev/)
- [Ultralytics YOLO](https://github.com/ultralytics/ultralytics)
- [Roboflow Basketball Dataset](https://universe.roboflow.com/eagle-eye/basketball-1zhpe)

---
For questions or contributions, open an issue or pull request!
# basketball
# basketball
# basketball
