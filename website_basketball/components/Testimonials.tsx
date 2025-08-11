import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                 <h3 className="text-3xl font-bold text-gray-900">Trusted by Players and Coaches</h3>
                 <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">See what others are saying about their improvement with Shot Doctor AI.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="testimonial-card p-8 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <p className="text-gray-600 mb-6">"I never realized my elbow was flaring out until I used this app. The visual feedback is a game-changer. My percentage went up within a week."</p>
                    <div className="flex items-center">
                        <img src="https://placehold.co/48x48/e0e7ff/4338ca?text=JS" alt="User avatar" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-gray-900">Jordan S.</p>
                            <p className="text-sm text-gray-500">High School Player</p>
                        </div>
                    </div>
                </div>
                {/* Testimonial 2 */}
                <div className="testimonial-card p-8 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <p className="text-gray-600 mb-6">"As a coach, this tool is invaluable. I can analyze my players' shots remotely and give them specific, data-backed drills to work on. It saves so much time."</p>
                    <div className="flex items-center">
                        <img src="https://placehold.co/48x48/dcfce7/166534?text=CM" alt="User avatar" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-gray-900">Coach Miller</p>
                            <p className="text-sm text-gray-500">AAU Coach</p>
                        </div>
                    </div>
                </div>
                {/* Testimonial 3 */}
                <div className="testimonial-card p-8 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <p className="text-gray-600 mb-6">"The 3D view is incredible. Being able to see my shot from any angle helped me understand my body alignment in a way I never could before."</p>
                    <div className="flex items-center">
                        <img src="https://placehold.co/48x48/fef2f2/991b1b?text=AR" alt="User avatar" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-gray-900">Alex R.</p>
                            <p className="text-sm text-gray-500">College Athlete</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Testimonials;
