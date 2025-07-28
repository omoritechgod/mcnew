import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/hero/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import TrustSection from '../components/TrustSection';
import FAQSection from '../components/FAQSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TrustSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default LandingPage;