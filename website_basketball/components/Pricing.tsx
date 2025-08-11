import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing That Makes Sense</h2>
                <p className="text-gray-500 text-lg">From casual players to elite teams, we have a plan that fits your goals and your budget.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="pricing-card bg-white rounded-xl p-8 flex flex-col" style={{ border: '1px solid #e5e7eb' }}>
                    <h3 className="text-xl font-bold text-gray-900">Rookie</h3>
                    <p className="text-4xl font-extrabold text-gray-900 my-4">$0 <span className="text-base font-medium text-gray-500">/ month</span></p>
                    <p className="text-gray-500 mb-6">Perfect for getting started.</p>
                    <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>5 Video Analyses / mo</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>Basic Joint Angles</li>
                    </ul>
                    <a href="#" className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">Get Started</a>
                </div>
                <div className="pricing-card bg-white rounded-xl p-8 flex flex-col popular-plan relative" style={{ border: '1px solid #0ea5e9', boxShadow: '0 0 30px rgba(14, 165, 233, 0.2)' }}>
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                        <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">All-Star</h3>
                    <p className="text-4xl font-extrabold text-gray-900 my-4">$15 <span className="text-base font-medium text-gray-500">/ month</span></p>
                    <p className="text-gray-500 mb-6">For the dedicated player.</p>
                    <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>Unlimited Analyses</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>Advanced Analytics</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>Real-Time AI Coaching</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>3D Visualization</li>
                    </ul>
                    <a href="#" className="w-full text-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">Choose Plan</a>
                </div>
                <div className="pricing-card bg-white rounded-xl p-8 flex flex-col" style={{ border: '1px solid #e5e7eb' }}>
                    <h3 className="text-xl font-bold text-gray-900">Franchise</h3>
                    <p className="text-4xl font-extrabold text-gray-900 my-4">Contact Us</p>
                    <p className="text-gray-500 mb-6">For teams and coaches.</p>
                    <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>Everything in All-Star</li>
                        <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>Multi-user Dashboards</li>
                    </ul>
                    <a href="#" className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">Contact Sales</a>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Pricing;
