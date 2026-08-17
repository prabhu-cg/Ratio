import { Routes, Route } from 'react-router-dom';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { LandingPage } from '@/pages/LandingPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { AboutPage } from '@/pages/AboutPage';
import { AppPage } from '@/pages/AppPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}

export default App;
