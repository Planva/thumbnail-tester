import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Upload, Globe, ExternalLink, Menu, X } from 'lucide-react';
import { useStore } from '../store';
import { translations } from '../translations';

const FRIENDLY_LINKS = [
  {
    name: 'Sending Prayers',
    url: 'https://www.sending-prayers.com/',
  },
  {
    name: 'TAT Test',
    url: 'https://www.tat-test.com',
  },
  {
    name: 'Difficult Person Test',
    url: 'https://www.difficult-person-test.com',
  },
  {
    name: 'Smart IQ Test ',
    url: 'https://www.smarttest.cc',
  },
  {
    name: 'Calculator App',
    url: 'https://www.calculator-app.org',
  },
  {
    name: 'Future Value Calculator',
    url: 'https://www.future-value-calculator.com/',
  }
];

export function Layout() {
  const { currentLanguage, setLanguage, isDarkMode, isTestPageDarkMode } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only apply dark mode to navigation on the test page
  const isTestPage = location.pathname === '/thumbnail-tester-online-free';
  const shouldUseDarkMode = isTestPage ? isTestPageDarkMode : false;

  const t = (key: keyof typeof translations) => {
    return translations[key][currentLanguage] || translations[key]['en'];
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${shouldUseDarkMode ? 'bg-[#0f0f0f]' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
      <header className={`shadow-sm border-b ${shouldUseDarkMode ? 'bg-[#212121] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-1.5">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xl font-semibold ${shouldUseDarkMode ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
                Thumbnail Tester
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/youtube-b/b-test" className={`${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>A/B Test</Link>
              <Link to="/thumbnail-tester-ai" className={`${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>AI Analysis</Link>
              <Link to="/how-to-ab-test-thumbnails" className={`${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>How To</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                className={`md:hidden p-2 rounded-md transition-colors ${shouldUseDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className={`md:hidden mt-4 py-2 border-t ${shouldUseDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/youtube-b/b-test" 
                  className={`px-2 py-2 rounded-md ${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                  onClick={closeMobileMenu}
                >
                  A/B Test
                </Link>
                <Link 
                  to="/thumbnail-tester-ai" 
                  className={`px-2 py-2 rounded-md ${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                  onClick={closeMobileMenu}
                >
                  AI Analysis
                </Link>
                <Link 
                  to="/how-to-ab-test-thumbnails" 
                  className={`px-2 py-2 rounded-md ${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                  onClick={closeMobileMenu}
                >
                  How To
                </Link>
                <Link 
                  to="/thumbnail-tester-online-free" 
                  className={`px-2 py-2 rounded-md ${shouldUseDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                  onClick={closeMobileMenu}
                >
                  {t('startTesting')}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1" onClick={closeMobileMenu}>
        <Outlet />
      </main>

      <footer className={`border-t mt-auto ${shouldUseDarkMode ? 'bg-[#212121] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className={`flex flex-wrap gap-4 justify-center items-center text-sm mb-2 ${shouldUseDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {FRIENDLY_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center transition-colors ${shouldUseDarkMode ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}
              >
                {link.name}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            ))}
          </div>
          <p className={`text-center text-xs ${shouldUseDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} www.thumbnail-tester.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}