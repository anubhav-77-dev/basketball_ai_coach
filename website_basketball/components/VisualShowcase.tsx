import React from 'react';

const VisualShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            {/* Item 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                    <span className="text-sky-500 font-semibold">STEP 1</span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Upload Your Video</h3>
                    <p className="text-gray-500 mb-4">Simply record a video of your jumpshot from the side and upload it directly from your phone or computer. No special equipment needed.</p>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Works with any smartphone camera.</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Secure and private uploads.</li>
                    </ul>
                </div>
                <div className="p-8 bg-gray-100 rounded-2xl">
                    <img src="https://placehold.co/400x800/f3f4f6/1f2937?text=Phone+Upload+UI" alt="Phone showing upload interface" className="rounded-xl shadow-2xl mx-auto" />
                </div>
            </div>
            {/* Item 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="md:order-last">
                    <span className="text-sky-500 font-semibold">STEP 2</span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Get Instant Analysis</h3>
                    <p className="text-gray-500 mb-4">Our AI gets to work instantly, overlaying a skeletal track on your video and calculating key metrics like joint angles and shot arc.</p>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>See your form in 2D and 3D.</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Receive real-time coaching feedback.</li>
                    </ul>
                </div>
                <div className="p-8 bg-gray-100 rounded-2xl">
                    <img src="https://placehold.co/400x800/f3f4f6/1f2937?text=App+Analysis+Screen" alt="Phone showing analysis overlay" className="rounded-xl shadow-2xl mx-auto" />
                </div>
            </div>
        </div>
    </section>
  );
};

export default VisualShowcase;
