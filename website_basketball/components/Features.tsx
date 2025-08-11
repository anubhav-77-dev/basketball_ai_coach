import React from 'react';

const features = [
	{
		name: 'Biomechanical Tracking',
		description:
			'Our AI maps 33 body keypoints in 3D space to analyze your form with scientific precision.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-10 w-10"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
				/>
			</svg>
		),
	},
	{
		name: 'Instant AI Coaching',
		description:
			'Receive actionable tips and drills from our AI coach, just like having a pro by your side 24/7.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-10 w-10"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
				/>
			</svg>
		),
	},
	{
		name: 'Performance Analytics',
		description:
			'Track your progress over time with detailed reports on joint angles, shot arc, and consistency.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-10 w-10"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
				/>
			</svg>
		),
	},
];

const Features: React.FC = () => {
	return (
		<section id="features" className="bg-gray-50 py-20">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h3 className="text-3xl font-bold text-gray-900">
						The Ultimate Training Partner
					</h3>
					<p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
						Shot Doctor AI gives you the elite-level analysis previously only
						available to the pros.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((feature) => (
						<div
							key={feature.name}
							className="feature-card p-8 rounded-xl"
							style={{
								background: '#ffffff',
								border: '1px solid #e5e7eb',
								transition:
									'transform 0.3s ease, box-shadow 0.3s ease',
							}}
						>
							<div className="text-sky-500 mb-4">{feature.icon}</div>
							<h4 className="text-xl font-bold text-gray-900 mb-2">
								{feature.name}
							</h4>
							<p className="text-gray-500">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
