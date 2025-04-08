import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
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
  }
];

export function Layout() {
  const { currentLanguage, setLanguage } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-1.5">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Thumbnail Tester
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/youtube-b/b-test" className="text-gray-600 hover:text-indigo-600">A/B Test</Link>
              <Link to="/thumbnail-tester-ai" className="text-gray-600 hover:text-indigo-600">AI Analysis</Link>
              <Link to="/how-to-ab-test-thumbnails" className="text-gray-600 hover:text-indigo-600">How To</Link>
              <Link 
                to="/thumbnail-tester-online-free"
                className="text-gray-600 hover:text-indigo-600"
              >
                {t('startTesting')}
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md bg-white border border-gray-200 hover:border-indigo-300 transition-colors">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{t('language')}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {Object.entries(translations.languageName).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code as keyof typeof translations.languageName)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 ${
                        currentLanguage === code ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-gray-700'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
            <nav className="md:hidden mt-4 py-2 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/youtube-b/b-test" 
                  className="px-2 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                  onClick={closeMobileMenu}
                >
                  A/B Test
                </Link>
                <Link 
                  to="/thumbnail-tester-ai" 
                  className="px-2 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                  onClick={closeMobileMenu}
                >
                  AI Analysis
                </Link>
                <Link 
                  to="/how-to-ab-test-thumbnails" 
                  className="px-2 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                  onClick={closeMobileMenu}
                >
                  How To
                </Link>
                <Link 
                  to="/thumbnail-tester-online-free" 
                  className="px-2 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
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

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-gray-500 mb-2">
            {FRIENDLY_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-indigo-600 transition-colors"
              >
                {link.name}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} YouTube-Thumbnail-Tester. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}