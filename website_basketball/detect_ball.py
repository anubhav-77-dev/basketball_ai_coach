from ultralytics import YOLO
import os

# Load your trained model
model = YOLO('best.pt')

# Run detection on your video
results = model('final_ball.mov', save=True)

# Create output directory for JSON results
output_dir = "yolo_results"
os.makedirs(output_dir, exist_ok=True)

# Save detection results as JSON for each frame
for i, result in enumerate(results):
    with open(os.path.join(output_dir, f"frame_{i:04d}.json"), "w") as f:
        f.write(result.tojson())
