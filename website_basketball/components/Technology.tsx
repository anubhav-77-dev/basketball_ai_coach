import React from 'react';

const Technology: React.FC = () => {
  return (
    <section id="tech" className="bg-gray-50 py-20">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">The Tech Behind the Talent</h2>
                <p className="text-gray-500 text-lg">We combine multiple state-of-the-art AI models to deliver analysis that's both comprehensive and easy to understand.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center p-6 rounded-lg">
                    <img src="https://ssl.gstatic.com/mediapipe/images/solutions/pose_landmarker_16_9.png" alt="MediaPipe Pose" className="w-full h-40 object-cover rounded-md mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">MediaPipe Pose</h3>
                    <p className="text-gray-500">Google's MediaPipe provides the backbone, detecting 33 3D body landmarks to map your every movement.</p>
                </div>
                <div className="text-center p-6 rounded-lg">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/1*Z812n2hQk-4s_2O-pY2zVw.jpeg" alt="YOLOv8" className="w-full h-40 object-cover rounded-md mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">YOLOv8 Detection</h3>
                    <p className="text-gray-500">Our custom-trained YOLOv8 model finds the basketball, ensuring we track it through your entire shooting motion.</p>
                </div>
                <div className="text-center p-6 rounded-lg">
                    <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_flash_1.width-1300.format-webp.webp" alt="Gemini AI" className="w-full h-40 object-cover rounded-md mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gemini AI Coach</h3>
                    <p className="text-gray-500">All data is fed to Google's Gemini, which acts as your personal coach, providing insightful, human-like feedback.</p>
                </div>
            </div>
         </div>
    </section>
  );
};

export default Technology;
