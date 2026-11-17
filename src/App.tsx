import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionsSection } from './components/SolutionsSection';
import { ProcessSection } from './components/ProcessSection';
import { AssessmentSection } from './components/AssessmentSection';
import { LeadFormSection } from './components/LeadFormSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';

interface PublicConfig {
  contactEmail: string;
  contactPhone: string;
  schedulerUrl: string;
}

export function App() {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [config, setConfig] = useState<PublicConfig>({
    contactEmail: 'contact@newlimitslegacy.com',
    contactPhone: '',
    schedulerUrl: '',
  });

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL || '/';
    const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    fetch(`${normalizedBase}/api/logistics/config`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Partial<PublicConfig> | null) => {
        if (data) {
          setConfig({
            contactEmail: data.contactEmail || 'contact@newlimitslegacy.com',
            contactPhone: data.contactPhone || '',
            schedulerUrl: data.schedulerUrl || '',
          });
        }
      })
      .catch(() => {
        // Fallback defaults remain active when running purely as static bundle
      });
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('assessment-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        firstInputRef.current?.focus({ preventScroll: true });
      }, 450);
    }
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar onScheduleClick={scrollToForm} />

      <main id="main-content">
        <HeroSection onScheduleClick={scrollToForm} />
        <ProblemSection />
        <SolutionsSection />
        <ProcessSection />
        <AssessmentSection
          onScheduleClick={scrollToForm}
          schedulerUrl={config.schedulerUrl || undefined}
        />
        <LeadFormSection
          contactEmail={config.contactEmail}
          contactPhone={config.contactPhone || undefined}
          firstInputRef={firstInputRef}
          onOpenPrivacy={() => setPrivacyOpen(true)}
        />
        <FaqSection />
      </main>

      <Footer
        contactEmail={config.contactEmail}
        contactPhone={config.contactPhone || undefined}
        onOpenPrivacy={() => setPrivacyOpen(true)}
      />

      <PrivacyModal
        open={privacyOpen}
        contactEmail={config.contactEmail}
        onClose={() => setPrivacyOpen(false)}
      />
    </div>
  );
}

export default App;
