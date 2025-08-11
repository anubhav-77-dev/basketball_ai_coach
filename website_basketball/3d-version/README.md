# Shot Doctor AI

## Overview
Shot Doctor AI is a web application that analyzes basketball shooting form from user-uploaded videos. It uses real-time pose estimation (MediaPipe) and custom-trained YOLOv8 ball detection to provide instant, visual feedback and analytics.

## Features
- Upload and analyze basketball shooting videos
- Real-time pose tracking overlay (body keypoints and skeleton)
- Real-time basketball detection overlay (green box)
- Both overlays are perfectly synced and drawn on the same canvas
- Fast, in-browser processing (no backend required for inference)
- Modular UI components for progress, steps, and feedback

## Tech Stack
- React (Vite)
- TypeScript
- MediaPipe Pose (Google)
- YOLOv8 (Ultralytics, custom-trained)
- Tailwind CSS (optional, for styling)

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
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   - Go to the local address (usually http://localhost:5173/)
   - Upload or use the provided basketball video

## Customizing or Retraining YOLO
- To improve ball detection, retrain YOLOv8 on your own dataset (see Ultralytics docs).
- Export detection results as JSON (one per frame) and place them in `public/yolo_results/`.

## File Structure
- `components/PoseYoloOverlay.tsx` — Main overlay component (pose + ball)
- `public/yolo_results/` — YOLO detection JSONs (one per frame)
- `public/final_ball.mov` — Example basketball video
- `App.tsx` — Main app entry point

## Credits
- [MediaPipe](https://mediapipe.dev/)
- [Ultralytics YOLO](https://github.com/ultralytics/ultralytics)
- [Roboflow Basketball Dataset](https://universe.roboflow.com/eagle-eye/basketball-1zhpe)

---
For questions or contributions, open an issue or pull request!
