import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative hero-gradient-bg" style={{
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.1), rgba(255, 255, 255, 0))',
    }}>
      <div className="container mx-auto px-6 pt-24 pb-32 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Unlock Your Perfect Shot with <span className="hero-gradient-text" style={{
            background: 'linear-gradient(to right, #0ea5e9, #2563eb, #4f46e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>AI Analysis</span>.
        </h2>
        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-8">
          Stop guessing. Start improving. Get instant, data-driven feedback on your basketball shooting form and elevate your game.
        </p>
        <a href="#analysis" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block">Analyze Your First Shot Free</a>
      </div>
    </section>
  );
};

export default Hero;
