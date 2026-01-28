import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FuturisticLoader from './components/FuturisticLoader';
import BitcoinPuzzle from './components/BitcoinPuzzle';
import AccessPortal from './components/AccessPortal';
import AuthModule from './components/auth/AuthModule';
import Dashboard from './components/dashboard/Dashboard';
import MatrixRain from './components/MatrixRain';
import DonationSection from './components/DonationSection';
import ContactCard from './components/ContactCard';
import TermsModal from './components/modals/TermsModal';
import PrivacyModal from './components/modals/PrivacyModal';
import ErrorBoundary from './components/ErrorBoundary';
import { AppState, User } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const AppContent: React.FC = () => {
  const { user, isLoading: authLoading, session } = useAuth();
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.LOADING);
  const [showContact, setShowContact] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // OPTIMIZACIÓN: Bypass de Login redundante.
  // Si ya hay sesión en el navegador, al resolver el puzzle vamos directo al Dashboard.
  useEffect(() => {
    if (!authLoading && session && currentStep === AppState.AUTH) {
      setCurrentStep(AppState.DASHBOARD);
    }
  }, [session, authLoading, currentStep]);

  const handleLoadingComplete = () => {
    // Comprobar si el usuario ya verificó ser humano en esta sesión (Cookie sutil de navegador)
    const isHumanVerified = localStorage.getItem('ap_human_verified') === 'true';
    
    if (session && isHumanVerified) {
      setCurrentStep(AppState.DASHBOARD);
    } else {
      setCurrentStep(AppState.PUZZLE);
    }
  };

  const handlePuzzleSolved = () => {
    localStorage.setItem('ap_human_verified', 'true');
    setCurrentStep(AppState.GRANTED);
  };

  const handleEnterPortal = () => {
    if (session) {
      setCurrentStep(AppState.DASHBOARD);
    } else {
      setCurrentStep(AppState.AUTH);
    }
  };

  const handleLogoutSuccess = useCallback(() => {
    localStorage.removeItem('ap_human_verified');
    setCurrentStep(AppState.PUZZLE);
  }, []);

  // Determinar si estamos en el dashboard activo
  const isDashboard = currentStep === AppState.DASHBOARD && session !== null;

  return (
    <div className={`relative min-h-screen w-full bg-[#050505] text-white flex flex-col ${isDashboard ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      <MatrixRain />
      
      {/* Grid Decorativo */}
      <div className="fixed inset-0 opacity-10 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#00d2ff 1px, transparent 1px), linear-gradient(90deg, #00d2ff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {currentStep !== AppState.LOADING && !isDashboard && <Header />}

      <main className={`relative z-20 w-full flex-1 flex flex-col items-center ${isDashboard ? 'h-full' : 'pt-24 pb-32'}`}>
        {currentStep === AppState.LOADING && (
          <FuturisticLoader onComplete={handleLoadingComplete} duration={2000} />
        )}

        {currentStep === AppState.PUZZLE && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <BitcoinPuzzle onSolved={handlePuzzleSolved} />
            <DonationSection />
          </div>
        )}

        {currentStep === AppState.GRANTED && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
            <AccessPortal onEnter={handleEnterPortal} />
            <DonationSection />
          </div>
        )}

        {currentStep === AppState.AUTH && (
          <AuthModule onAuthSuccess={() => setCurrentStep(AppState.DASHBOARD)} />
        )}

        {isDashboard && (
          <div className="w-full h-full animate-in fade-in duration-500">
            <Dashboard user={(user as User) || {
              fullName: '',
              email: session?.user?.email || '',
              username: session?.user?.email?.split('@')[0] || 'User',
              gender: 'other',
              ageRange: 'unknown',
              membership: 'FREE',
              balance: 0
            }} onLogout={handleLogoutSuccess} />
          </div>
        )}
      </main>

      {showContact && <ContactCard onClose={() => setShowContact(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      {currentStep !== AppState.LOADING && !isDashboard && (
        <footer className="relative z-40 w-full py-6 bg-black/60 backdrop-blur-md flex flex-wrap justify-center items-center gap-x-6 text-[10px] text-[#00d2ff] opacity-60 font-mono tracking-widest border-t border-white/5 uppercase">
          <span>&copy; {new Date().getFullYear()} ADAL PAREDES</span>
          <button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors">TÉRMINOS</button>
          <button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">PRIVACIDAD</button>
          <button onClick={() => setShowContact(true)} className="text-[#00ff88] hover:text-[#00d2ff] font-bold">CONTACTO</button>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;