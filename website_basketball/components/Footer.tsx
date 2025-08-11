import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Shot Doctor AI. All Rights Reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
