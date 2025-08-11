// We aim to capture 2 frames per second to get good motion detail.
const TARGET_FRAMES_PER_SECOND = 2;

/**
 * Extracts frames from a video file.
 * The number of frames is proportional to the video's duration.
 * @param videoFile The video file to process.
 * @returns A promise that resolves to an array of base64 encoded image strings.
 */
export const extractFramesFromVideo = (
  videoFile: File,
  onProgress?: (progress: number) => void // progress: 0 to 1
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const frames: string[] = [];
    
    if (!context) {
      return reject(new Error('Failed to get canvas context.'));
    }

    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const duration = video.duration;
      if (duration <= 0 || !isFinite(duration)) {
        return resolve([]);
      }

      const numFramesToCapture = Math.ceil(duration * TARGET_FRAMES_PER_SECOND);
      const interval = duration / numFramesToCapture;
      let framesCaptured = 0;

      const DELAY_BETWEEN_FRAMES = 80; // ms, tweak for desired speed

      const captureNextFrame = (currentTime: number) => {
        video.currentTime = currentTime;
      };

      video.onseeked = () => {
        if (framesCaptured < numFramesToCapture) {
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const base64 = canvas.toDataURL('image/jpeg', 0.7); 
          frames.push(base64);
          framesCaptured++;
          if (onProgress) onProgress(framesCaptured / numFramesToCapture);

          if (framesCaptured < numFramesToCapture) {
            setTimeout(() => {
              captureNextFrame(framesCaptured * interval);
            }, DELAY_BETWEEN_FRAMES);
          } else {
            URL.revokeObjectURL(video.src);
            if (onProgress) onProgress(1);
            resolve(frames);
          }
        }
      };

      // Start the process
      captureNextFrame(0);
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(video.src);
      reject(new Error(`Video loading error: ${err}`));
    };
  });
};
