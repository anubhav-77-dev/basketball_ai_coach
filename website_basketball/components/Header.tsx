import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50" style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e7eb',
    }}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Shot Doctor<span className="text-sky-500">.AI</span>
        </h1>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="nav-link hover:text-sky-500 transition duration-300">Home</a>
          <a href="#analysis" className="nav-link hover:text-sky-500 transition duration-300">Analyzer</a>
          <a href="#tech" className="nav-link hover:text-sky-500 transition duration-300">Technology</a>
          <a href="#pricing" className="nav-link hover:text-sky-500 transition duration-300">Pricing</a>
        </nav>
        <a href="#analysis" className="hidden md:block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-300">Get Started</a>
        <button id="mobile-menu-button" className="md:hidden text-gray-600 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
      {/* Mobile Menu */}
      <div id="mobile-menu" className={`md:hidden ${isMenuOpen ? '' : 'hidden'} px-6 pb-4 space-y-2`}>
        <a href="#home" className="nav-link block hover:text-sky-500 transition duration-300">Home</a>
        <a href="#analysis" className="nav-link block hover:text-sky-500 transition duration-300">Analyzer</a>
        <a href="#tech" className="nav-link block hover:text-sky-500 transition duration-300">Technology</a>
        <a href="#pricing" className="nav-link block hover:text-sky-500 transition duration-300">Pricing</a>
      </div>
    </header>
  );
};

export default Header;
