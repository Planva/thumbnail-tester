import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ABTestPage } from './pages/ABTestPage';
import { ThumbnailTestPage } from './pages/ThumbnailTestPage';
import { HowToPage } from './pages/HowToPage';
import { AITesterPage } from './pages/AITesterPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ThumbnailDownloadPage } from './pages/ThumbnailDownloadPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="youtube-b/b-test" element={<ABTestPage />} />
        <Route path="thumbnail-tester-ai" element={<AITesterPage />} />
        <Route path="thumbnail-tester-online-free" element={<ThumbnailTestPage />} />
        <Route path="how-to-ab-test-thumbnails" element={<HowToPage />} />
        <Route path="thumbnail-download" element={<ThumbnailDownloadPage />} />
        <Route path="youtube-thumbnail-test-and-compare" element={<ComparisonPage />} />
      </Route>
    </Routes>
  );
}

export default App;