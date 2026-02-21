import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Clock, Award, Heart, Beef, Home, Users, ChevronRight } from 'lucide-react';

export default function HausschlachtereiStrassberger() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [marketTab, setMarketTab] = useState('week'); // 'today' or 'week'
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [modalTab, setModalTab] = useState('today');
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'impressum', 'datenschutz', 'automat', 'sortiment'
  
  // Get today's day in German
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long' });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Auto-highlight active section based on scroll position
      const sections = ['home', 'hours', 'origin', 'about'];
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show market modal on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarketModal(true);
    }, 800); // Show after 800ms for better UX
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const getFilteredMarkets = () => {
    if (marketTab === 'today') {
      return markets.filter(m => m.day === todayCapitalized);
    }
    // 'week' shows all markets (since we only have markets for specific weekdays anyway)
    return markets;
  };

  const getFilteredMarketsForModal = () => {
    if (modalTab === 'today') {
      return markets.filter(m => m.day === todayCapitalized);
    }
    // 'week' shows all markets
    return markets;
  };

  // Check if a market is currently open
  const isMarketOpen = (day, timeString) => {
    if (day !== todayCapitalized) return false;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    // Parse time string like "08:00 bis 13:00"
    const timeMatch = timeString.match(/(\d{2}):(\d{2})\s*bis\s*(\d{2}):(\d{2})/);
    if (!timeMatch) return false;
    
    const startHours = parseInt(timeMatch[1]);
    const startMinutes = parseInt(timeMatch[2]);
    const endHours = parseInt(timeMatch[3]);
    const endMinutes = parseInt(timeMatch[4]);
    
    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;
    
    return currentTime >= startTime && currentTime <= endTime;
  };

  // Check if a market time has passed today
  const isMarketPassed = (day, timeString) => {
    if (day !== todayCapitalized) return false;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    // Parse time string like "08:00 bis 13:00"
    const timeMatch = timeString.match(/(\d{2}):(\d{2})\s*bis\s*(\d{2}):(\d{2})/);
    if (!timeMatch) return false;
    
    const endHours = parseInt(timeMatch[3]);
    const endMinutes = parseInt(timeMatch[4]);
    const endTime = endHours * 60 + endMinutes;
    
    return currentTime > endTime;
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const markets = [
    {
      day: 'Dienstag',
      locations: [
        { name: 'Marktplatz, Obernkirchen', time: '08:00 bis 13:00', address: 'Marktplatz 5-6, 31683 Obernkirchen' }
        ]
    },
    {
      day: 'Mittwoch',
      locations: [
        { name: 'Wochenmarkt, Bad Eilsen', time: '08:00 bis 13:00', address: 'Bückeburger Str. 4, 31707 Bad Eilsen' },
        { name: 'Gottschalk\'s Hof, Helpsen', time: '14:00 bis 17:00', address: 'Bahnhofstraße 1, 31691 Helpsen' }
      ]
    },
    {
      day: 'Donnerstag',
      locations: [
        { name: 'Wochenmarkt, Minden', time: '08:00 bis 13:00', address: 'Markt, 32423 Minden' },
        { name: 'Straßberger\'s Hof, Buchholz', time: '14:00 bis 17:00', address: 'Neue Str. 2, 31710 Buchholz' }
      ]
    },
    {
      day: 'Freitag',
      locations: [
        { name: 'Marktplatz, Obernkirchen', time: '07:30 bis 13:00', address: 'Lange Str. 24, 31683 Obernkirchen' },
        { name: 'Ovesiek\'s Hof, Meinsen', time: '14:00 bis 18:00', address: 'Meinser Str. 23, 31675 Bückeburg' }
      ]
    },
    {
      day: 'Samstag',
      locations: [
        { name: 'Ovesiek\'s Hof, Meinsen', time: '07:30 bis 10:00', address: 'Meinser Str. 23, 31675 Bückeburg' },
        { name: 'Straßberger\'s Hof, Buchholz', time: '10:30 bis 11:30', address: 'Neue Str. 2, 31710 Buchholz' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'Wo kann ich einkaufen?',
      answer: 'Auf unseren Wochenmärkten und am 24/7 Automaten in Buchholz.'
    },
    {
      question: 'Woher stammen die Schweine?',
      answer: 'Aus Gelldorf von Hof Pohl & Hof Eggelmann, Ferkelzucht KLEPO Agrar GbR.'
    },
    {
      question: 'Gibt es Bestellungen?',
      answer: 'Gerne nach Absprache – z. B. Aufschnittplatten oder Wurstmollen. Rufen Sie uns gerne an! - +49 5751 7260 '
    }
  ];

  return (
    <div className="website">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bitter:wght@600;700;800&family=Manrope:wght@400;500;600;700&family=Anton&family=Fette+Fraktur&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --color-red: #e0393b;
          --color-gray: #424242;
          --color-white: #ffffff;
          --color-bg-light: #fafafa;
          --color-bg-cream: #f9f5f1;
          --font-display: 'Bitter', serif;
          --font-body: 'Manrope', sans-serif;
        }

        body {
          font-family: var(--font-body);
          color: var(--color-gray);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .website {
          min-height: 100vh;
          background: var(--color-white);
        }

        /* Header Styles */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          background: var(--color-white);
        }

        .header.scrolled {
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.2rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .logo-name {
  font-size: 1.4rem;
  line-height: 1.2;
  color: var(--color-gray);
}

.logo-name span:first-child {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000;
  display: block;
}

.logo-name span:last-child {
  font-family: 'Fette Fraktur', cursive;
  font-weight: 400;
  color: #e0393b;
  font-size: 1.6rem;
  display: block;
}

        .logo-tagline {
          font-size: 0.75rem;
          color: var(--color-red);
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .nav-desktop {
          display: none;
        }

        .nav-links {
          display: flex;
          gap: 0.3rem;
          list-style: none;
        }

        .nav-link {
          font-weight: 600;
          color: var(--color-gray);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9rem;
          position: relative;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          white-space: nowrap;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--color-red), transparent);
          transition: transform 0.3s ease;
        }

        .nav-link:hover {
          color: var(--color-red);
          background: rgba(224, 57, 59, 0.05);
        }

        .nav-link:hover::before {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-link.active {
          color: var(--color-white);
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          box-shadow: 0 2px 8px rgba(224, 57, 59, 0.25);
        }

        .nav-link.active::before {
          display: none;
        }

        .nav-link.automat {
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          color: var(--color-white);
          box-shadow: 0 2px 12px rgba(224, 57, 59, 0.3);
          padding: 0.7rem 1.4rem;
          animation: pulse-glow 2s infinite;
        }

        .nav-link.automat:hover {
          background: linear-gradient(135deg, #c9302c 0%, #b02a29 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(224, 57, 59, 0.4);
        }

        .nav-link.automat::before {
          display: none;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 2px 12px rgba(224, 57, 59, 0.3); }
          50% { box-shadow: 0 2px 20px rgba(224, 57, 59, 0.5); }
        }

        .mobile-menu-button {
          background: none;
          border: none;
          color: var(--color-gray);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-menu-button:hover {
          background: var(--color-bg-light);
          transform: scale(1.05);
        }

        .mobile-menu-button:active {
          transform: scale(0.95);
        }

        .mobile-nav {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          background: var(--color-white);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 2000;
          padding: 2rem 1.5rem;
          overflow-y: auto;
        }

        .mobile-nav.open {
          transform: translateX(0);
        }

        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .mobile-nav-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-nav-link {
          font-weight: 600;
          font-size: 1rem;
          color: var(--color-gray);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          background: var(--color-bg-light);
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0;
          transform: translateX(20px);
          position: relative;
          overflow: hidden;
        }

        .mobile-nav.open .mobile-nav-link {
          animation: slideInRight 0.4s ease forwards;
        }

        .mobile-nav.open .mobile-nav-link:nth-child(1) { animation-delay: 0.1s; }
        .mobile-nav.open .mobile-nav-link:nth-child(2) { animation-delay: 0.15s; }
        .mobile-nav.open .mobile-nav-link:nth-child(3) { animation-delay: 0.2s; }
        .mobile-nav.open .mobile-nav-link:nth-child(4) { animation-delay: 0.25s; }
        .mobile-nav.open .mobile-nav-link:nth-child(5) { animation-delay: 0.3s; }
        .mobile-nav.open .mobile-nav-link:nth-child(6) { animation-delay: 0.35s; }

        @keyframes slideInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-nav-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--color-red);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .mobile-nav-link:active {
          transform: scale(0.97);
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: var(--color-white);
          border-color: var(--color-red);
          color: var(--color-red);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(224, 57, 59, 0.15);
        }

        .mobile-nav-link:hover::before,
        .mobile-nav-link.active::before {
          transform: scaleY(1);
        }

        .mobile-nav-link.automat-mobile {
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          color: var(--color-white);
          border-color: var(--color-red);
          box-shadow: 0 4px 12px rgba(224, 57, 59, 0.25);
        }

        .mobile-nav-link.automat-mobile:hover {
          background: linear-gradient(135deg, #c9302c 0%, #b02a29 100%);
          transform: translateX(4px) scale(1.02);
          box-shadow: 0 6px 16px rgba(224, 57, 59, 0.35);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 1500;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
        }

        .mobile-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* Section Styles */
        section {
          padding: 4rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        section:first-of-type {
          margin-top: 70px;
        }

        /* Hero Section */
        .hero {
          text-align: center;
          padding: 3rem 1.5rem 4rem;
          background: linear-gradient(135deg, var(--color-bg-cream) 0%, var(--color-white) 100%);
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(224, 57, 59, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(224, 57, 59, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-headline {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-gray);
          margin-bottom: 1rem;
          line-height: 1.1;
          animation: fadeInUp 0.8s ease;
        }

        .hero-subline {
          font-size: 1.1rem;
          color: var(--color-gray);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          font-weight: 500;
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease 0.4s both;
        }

        .btn {
          padding: 1.1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          font-family: var(--font-body);
        }

        .btn-primary {
          background: var(--color-red);
          color: var(--color-white);
          box-shadow: 0 4px 12px rgba(224, 57, 59, 0.25);
        }

        .btn-primary:hover {
          background: #c9302c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(224, 57, 59, 0.35);
        }

        .btn-secondary {
          background: var(--color-white);
          color: var(--color-gray);
          border: 2px solid var(--color-gray);
        }

        .btn-secondary:hover {
          background: var(--color-gray);
          color: var(--color-white);
          transform: translateY(-2px);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 3rem;
          animation: fadeInUp 0.8s ease 0.6s both;
        }

        .feature-card {
          background: var(--color-white);
          padding: 2rem 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: var(--color-white);
        }

        .feature-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 0.5rem;
        }

        .feature-text {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.5;
        }

        /* Section Headings */
        .section-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-gray);
          margin-bottom: 1rem;
          text-align: center;
        }

        .section-subtitle {
          font-size: 1.05rem;
          color: #666;
          text-align: center;
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        /* Markets Section */
        .where-to-find {
          background: var(--color-bg-light);
          margin: 0 -1.5rem;
          padding: 3rem 1.5rem;
        }

        .market-teaser {
          background: var(--color-white);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }

        .market-day {
          font-weight: 700;
          color: var(--color-red);
          margin-bottom: 0.5rem;
        }

        .market-location {
          font-size: 0.95rem;
          color: var(--color-gray);
        }

        /* Automat Card */
        .automat-card {
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          color: var(--color-white);
          padding: 2rem;
          border-radius: 16px;
          margin: 2rem 0;
          box-shadow: 0 8px 24px rgba(224, 57, 59, 0.25);
        }

        .automat-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .automat-text {
          margin-bottom: 1.5rem;
          line-height: 1.6;
          opacity: 0.95;
        }

        .automat-address {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-white {
          background: var(--color-white);
          color: var(--color-red);
          font-weight: 700;
        }

        .btn-white:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }

        /* Content Section */
        .content-section {
          background: var(--color-white);
          padding: 2rem;
          border-radius: 16px;
          margin: 2rem 0;
          border-left: 4px solid var(--color-red);
        }

        .content-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 1rem;
        }

        .content-text {
          color: #555;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        /* FAQ Section */
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .faq-item {
          background: var(--color-white);
          border-radius: 12px;
          border: 2px solid #f0f0f0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item.open {
          border-color: var(--color-red);
        }

        .faq-question {
          font-weight: 700;
          color: var(--color-gray);
          font-size: 1.05rem;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          user-select: none;
        }

        .faq-question:hover {
          background: var(--color-bg-light);
        }

        .faq-chevron {
          transition: transform 0.3s ease;
          color: var(--color-red);
          flex-shrink: 0;
        }

        .faq-item.open .faq-chevron {
          transform: rotate(90deg);
        }

        .faq-answer {
          color: #666;
          line-height: 1.7;
          padding: 0 1.5rem;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          padding: 0 1.5rem 1.25rem 1.5rem;
        }

        /* Opening Hours Section */
        .market-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding: 0.5rem;
          background: var(--color-bg-light);
          border-radius: 12px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .market-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-gray);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-body);
        }

        .market-tab:hover {
          background: rgba(224, 57, 59, 0.1);
        }

        .market-tab.active {
          background: var(--color-red);
          color: var(--color-white);
          box-shadow: 0 2px 8px rgba(224, 57, 59, 0.25);
        }

        .hours-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .day-card {
          background: var(--color-white);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          border: 2px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .day-card.today {
          border-color: var(--color-red);
          box-shadow: 0 4px 20px rgba(224, 57, 59, 0.15);
        }

        .day-card:hover {
          border-color: var(--color-red);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .day-header {
          background: var(--color-red);
          color: var(--color-white);
          padding: 1.25rem 1.5rem;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          display: flex;
          justify-content: space-between;
          align-items: center;
          letter-spacing: 0.3px;
        }

        .today-badge {
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.25);
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-weight: 700;
          letter-spacing: 0.8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .day-locations {
          padding: 1.5rem;
        }

        .location-item {
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .location-item:last-child {
          border-bottom: none;
        }

        .location-item.market-open {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.03) 100%);
          padding: 1.25rem;
          margin: 0 -1.5rem;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          border-radius: 8px;
          border: 2px solid #4CAF50;
          border-bottom: 2px solid #4CAF50 !important;
        }

        .location-item.market-passed {
          opacity: 0.6;
        }

        .location-name {
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 0.5rem;
          font-size: 1.05rem;
        }

        .location-item.market-open .location-name {
          color: #2e7d32;
        }

        .location-time {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .location-item.market-open .location-time {
          color: #2e7d32;
          font-weight: 600;
        }

        .location-item.market-passed .location-time {
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
        }

        .open-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #4CAF50;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin-left: 0.5rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .open-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .btn-map {
          background: var(--color-bg-light);
          color: var(--color-gray);
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          border-radius: 6px;
          border: 1px solid #ddd;
        }

        .btn-map:hover {
          background: var(--color-gray);
          color: var(--color-white);
          border-color: var(--color-gray);
        }

        /* Origin Section */
        .origin-section {
          background: var(--color-bg-cream);
          margin: 0 -1.5rem;
          padding: 3rem 1.5rem;
        }
        
.origin-section > * {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

        .origin-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .origin-list {
          list-style: none;
          margin: 2rem 0;
        }

        .origin-list li {
          padding: 1rem 0 1rem 2.5rem;
          position: relative;
          line-height: 1.7;
          color: #555;
        }

        .origin-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 1rem;
          width: 28px;
          height: 28px;
          background: var(--color-red);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .trust-box {
          background: var(--color-white);
          padding: 2rem;
          border-radius: 12px;
          border: 3px solid var(--color-red);
          text-align: center;
          margin-top: 2rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .trust-box-text {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-gray);
          line-height: 1.5;
        }

        /* About Section */
        .about-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .about-item {
          background: var(--color-bg-light);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid var(--color-red);
        }

        .about-item-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--color-gray);
          margin-bottom: 0.75rem;
        }

        .about-item-text {
          color: #555;
          line-height: 1.7;
        }

        .image-placeholder {
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          color: #999;
          font-size: 0.9rem;
          margin: 2rem 0;
          border: 2px dashed #ccc;
        }

        /* Footer */
        .footer {
          background: var(--color-gray);
          color: var(--color-white);
          padding: 3rem 1.5rem 1.5rem;
          margin-top: 4rem;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-logo {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.footer-logo span:first-child {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  color: #fff;
}

.footer-logo span:last-child {
  font-family: 'Fette Fraktur', cursive;
  font-weight: 400;
  font-size: 1.8rem;
  color: #fff;
}

        .footer-tagline {
          color: var(--color-red);
          font-weight: 600;
          margin-bottom: 2rem;
          letter-spacing: 0.5px;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          list-style: none;
        }

        .footer-link {
          color: var(--color-white);
          cursor: pointer;
          transition: color 0.3s ease;
          font-weight: 500;
        }

        .footer-link:hover {
          color: var(--color-red);
        }

        .footer-copyright {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Mobile Quick-Actions Bar */
        .quick-actions {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-white);
          box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.15);
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-around;
          gap: 0.5rem;
          z-index: 900;
          border-top: 1px solid #f0f0f0;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          padding: 0.5rem;
          background: none;
          border: none;
          color: var(--color-gray);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 600;
          flex: 1;
          max-width: 120px;
        }

        .quick-action-btn:active {
          transform: scale(0.95);
        }

        .quick-action-btn.primary {
          color: var(--color-red);
        }

        .quick-action-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-bg-light);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .quick-action-btn.primary .quick-action-icon {
          background: var(--color-red);
          color: var(--color-white);
        }

        .quick-action-btn:hover .quick-action-icon {
          transform: scale(1.1);
        }

        /* Market Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }

        .modal-content {
          background: var(--color-white);
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transform: scale(0.9) translateY(20px);
          animation: modalSlideUp 0.3s ease 0.1s forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          to { 
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          color: var(--color-white);
          padding: 2rem;
          border-radius: 20px 20px 0 0;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: var(--color-white);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          font-size: 0.95rem;
          opacity: 0.95;
          font-weight: 500;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          background: var(--color-bg-light);
          border-radius: 12px;
        }

        .modal-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-gray);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-body);
        }

        .modal-tab:hover {
          background: rgba(224, 57, 59, 0.1);
        }

        .modal-tab.active {
          background: var(--color-red);
          color: var(--color-white);
          box-shadow: 0 2px 8px rgba(224, 57, 59, 0.25);
        }

        .modal-markets {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-market-card {
          background: var(--color-bg-light);
          border-radius: 12px;
          padding: 1.25rem;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .modal-market-card.today {
          border-color: var(--color-red);
          background: rgba(224, 57, 59, 0.05);
        }

        .modal-market-day {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-gray);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.3px;
        }

        .modal-today-badge {
          font-size: 0.65rem;
          background: var(--color-red);
          color: var(--color-white);
          padding: 0.3rem 0.7rem;
          border-radius: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          box-shadow: 0 2px 6px rgba(224, 57, 59, 0.3);
        }

        .modal-location {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .modal-location:last-child {
          margin-bottom: 0;
        }

        .modal-location.market-open {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
          border: 2px solid #4CAF50;
        }

        .modal-location.market-passed {
          opacity: 0.6;
        }

        .modal-location-name {
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 0.4rem;
          font-size: 0.95rem;
        }

        .modal-location.market-open .modal-location-name {
          color: #2e7d32;
        }

        .modal-location-time {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .modal-location.market-open .modal-location-time {
          color: #2e7d32;
          font-weight: 600;
        }

        .modal-location.market-passed .modal-location-time {
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
        }

        .modal-empty {
          text-align: center;
          padding: 2rem 1rem;
          color: #666;
        }

        .modal-empty-icon {
          width: 64px;
          height: 64px;
          background: var(--color-bg-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: #999;
        }

        .modal-empty-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 0.5rem;
        }

        .modal-empty-text {
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .modal-automat-card {
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          color: var(--color-white);
          padding: 1.5rem;
          border-radius: 12px;
          margin-top: 1rem;
        }

        .modal-automat-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-automat-text {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          opacity: 0.95;
          line-height: 1.5;
        }

        /* Legal Pages */
        .legal-page {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 4rem;
        }

        .legal-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .legal-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-bg-light);
          color: var(--color-gray);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          font-family: var(--font-body);
        }

        .legal-back-btn:hover {
          background: var(--color-gray);
          color: var(--color-white);
          transform: translateX(-4px);
        }

        .legal-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-gray);
          margin-bottom: 1rem;
        }

        .legal-subtitle {
          color: #666;
          font-size: 1.05rem;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .legal-section {
          margin-bottom: 3rem;
        }

        .legal-section-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-red);
        }

        .legal-text {
          color: #555;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .legal-text strong {
          color: var(--color-gray);
          font-weight: 700;
        }

        .legal-list {
          list-style: none;
          margin: 1rem 0;
        }

        .legal-list li {
          padding-left: 1.5rem;
          position: relative;
          margin-bottom: 0.75rem;
          color: #555;
          line-height: 1.7;
        }

        .legal-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--color-red);
          font-weight: 700;
          font-size: 1.2rem;
        }

        /* Product Pages */
        .product-page {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 4rem;
        }

        .product-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .product-hero {
          background: linear-gradient(135deg, var(--color-red) 0%, #c9302c 100%);
          color: var(--color-white);
          padding: 3rem 2rem;
          border-radius: 20px;
          margin-bottom: 3rem;
          text-align: center;
        }

        .product-hero-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .product-hero-text {
          font-size: 1.1rem;
          opacity: 0.95;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto 1.5rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-card {
          background: var(--color-white);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid #f0f0f0;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: var(--color-red);
        }

        .product-image {
          width: 250px;
          height: 350px;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.9rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .product-content {
          padding: 1.5rem;
        }

        .product-category {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-red);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 0.5rem;
        }

        .product-name {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-gray);
          margin-bottom: 0.75rem;
        }

        .product-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .product-features {
          list-style: none;
          margin: 1rem 0;
        }

        .product-features li {
          padding-left: 1.5rem;
          position: relative;
          margin-bottom: 0.5rem;
          color: #555;
          font-size: 0.9rem;
        }

        .product-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--color-red);
          font-weight: 700;
        }

        .category-section {
          margin-bottom: 4rem;
        }

        .category-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-gray);
          margin-bottom: 0.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 3px solid var(--color-red);
          display: inline-block;
        }

        .category-description {
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (min-width: 768px) {
          .nav-desktop {
            display: block;
          }

          .mobile-menu-button {
            display: none;
          }

          .quick-actions {
            display: none;
          }

          .hero-headline {
            font-size: 3.5rem;
          }

          .hero-subline {
            font-size: 1.3rem;
          }

          .hero-buttons {
            flex-direction: row;
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .hours-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          section {
            padding: 5rem 2rem;
          }

          .section-title {
            font-size: 2.5rem;
          }

          .where-to-find,
          .origin-section {
            margin: 0 -2rem;
            padding: 4rem 2rem;
          }
        }

        @media (min-width: 900px) {
          .nav-link {
            font-size: 0.95rem;
            padding: 0.6rem 1.2rem;
          }

          .nav-links {
            gap: 0.5rem;
          }
        }

        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .hours-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .logo-name {
            font-size: 1.6rem;
          }

          .hero-headline {
            font-size: 4rem;
          }

          .product-hero-title {
            font-size: 3rem;
          }
        }
      `}</style>

      {/* Render Impressum Page */}
      {currentPage === 'impressum' && (
        <>
          <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
              <div className="logo" onClick={() => navigateToPage('main')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <img 
    src="/images/logo.jpg" 
    alt="Hausschlachterei Straßberger" 
    style={{ 
      height: '45px',
      width: 'auto',
      display: 'block',
      marginBottom: '0.15rem'
    }}
  />
  <div className="logo-tagline">Seit 1973</div>
</div>
            </div>
          </header>

          <div className="legal-page">
            <div className="legal-container">
              <button className="legal-back-btn" onClick={() => navigateToPage('main')}>
                <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                Zurück zur Startseite
              </button>

              <h1 className="legal-title">Impressum</h1>
              <p className="legal-subtitle">Angaben gemäß § 5 TMG</p>

              <div className="legal-section">
                <h2 className="legal-section-title">Angaben zum Unternehmen</h2>
                <p className="legal-text">
                  <strong>Hausschlachterei Straßberger</strong><br />
                  Neue Straße 2<br />
                  31710 Buchholz<br />
                  Deutschland
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">Kontakt</h2>
                <p className="legal-text">
                  <strong>Telefon:</strong> [+49 5751 7260]<br />
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">Vertreten durch</h2>
                <p className="legal-text">
                  [Kai Straßberger]
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">Umsatzsteuer-ID</h2>
                <p className="legal-text">
                  Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                  [44/143/07006]
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">EU-Streitschlichtung</h2>
                <p className="legal-text">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br />
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-red)', textDecoration: 'underline' }}>
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <br /><br />
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">Verbraucherstreitbeilegung</h2>
                <p className="legal-text">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">Haftungsausschluss</h2>
                <p className="legal-text">
                  <strong>Haftung für Inhalte:</strong><br />
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p className="legal-text">
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Render Datenschutz Page */}
      {currentPage === 'datenschutz' && (
        <>
          <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
              <div className="logo" onClick={() => navigateToPage('main')} style={{ cursor: 'pointer' }}>
                <img 
    src="/images/logo.jpg" 
    alt="Hausschlachterei Straßberger" 
    style={{ 
      height: '45px',
      width: 'auto',
      display: 'block'
    }}
  />
                <div className="logo-tagline">Seit 1973</div>
              </div>
            </div>
          </header>

          <div className="legal-page">
            <div className="legal-container">
              <button className="legal-back-btn" onClick={() => navigateToPage('main')}>
                <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                Zurück zur Startseite
              </button>

              <h1 className="legal-title">Datenschutzerklärung</h1>
              <p className="legal-subtitle">Informationen zur Verarbeitung Ihrer Daten gemäß DSGVO</p>

              <div className="legal-section">
                <h2 className="legal-section-title">1. Datenschutz auf einen Blick</h2>
                <p className="legal-text">
                  <strong>Allgemeine Hinweise:</strong><br />
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">2. Datenerfassung auf dieser Website</h2>
                <p className="legal-text">
                  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>
                <p className="legal-text">
                  <strong>Wie erfassen wir Ihre Daten?</strong><br />
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="legal-text">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">3. Hosting</h2>
                <p className="legal-text">
                  Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">4. Allgemeine Hinweise und Pflichtinformationen</h2>
                <p className="legal-text">
                  <strong>Datenschutz:</strong><br />
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
                <p className="legal-text">
                  Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">5. Server-Log-Dateien</h2>
                <p className="legal-text">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="legal-list">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="legal-text">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
                </p>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">6. Ihre Rechte</h2>
                <p className="legal-text">
                  Sie haben jederzeit das Recht:
                </p>
                <ul className="legal-list">
                  <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
                  <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
                  <li>Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
                  <li>Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen</li>
                  <li>Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen</li>
                  <li>Datenübertragbarkeit zu verlangen</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2 className="legal-section-title">7. Kontakt</h2>
                <p className="legal-text">
                  Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten wenden Sie sich bitte an die im Impressum angegebenen Kontaktdaten.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Render 24/7 Automat Page */}
      {currentPage === 'automat' && (
        <>
          <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
              <div className="logo" onClick={() => navigateToPage('main')} style={{ cursor: 'pointer' }}>
                <img 
    src="/images/logo.jpg" 
    alt="Hausschlachterei Straßberger" 
    style={{ 
      height: '45px',
      width: 'auto',
      display: 'block'
    }}
  />
                <div className="logo-tagline">Seit 1973</div>
              </div>
            </div>
          </header>

          <div className="product-page">
            <div className="product-container">
              <button className="legal-back-btn" onClick={() => navigateToPage('main')}>
                <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                Zurück zur Startseite
              </button>

              <div className="product-hero">
                <div className="product-hero-title">🕐 24/7 Fleischautomat</div>
                <div className="product-hero-text">
                  Frische Qualität rund um die Uhr – unser Automat auf Straßberger's Hof in Buchholz bietet Ihnen jederzeit 
                  eine große Auswahl an Grillfleisch, Würstchen, Suppen, Salaten und vielem mehr. Perfekt für spontanen Genuss!
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  📍 Straßberger's Hof, Buchholz – Neue Straße 2
                </div>
                <button 
                  className="btn btn-white"
                  onClick={() => openGoogleMaps('Neue Str. 2, 31710 Buchholz')}
                  style={{ display: 'inline-flex' }}
                >
                  <MapPin size={20} />
                  Route planen
                </button>
              </div>

              <div className="category-section">
                <h2 className="category-title">Unser Sortiment im Automaten</h2>
                <p className="category-description">
                  Täglich frisch befüllt mit hochwertigen Produkten aus eigener Herstellung
                </p>

                <div className="product-grid">
                  <div className="product-card">
                    <div className="product-image">
                      <img 
  src="/images/grillfleisch.jpg" 
  alt="Premium Grillfleisch" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
                    </div>
                    <div className="product-content">
                      <div className="product-category">Grillfleisch</div>
                      <div className="product-name">Premium Grillfleisch</div>
                      <div className="product-description">
                        Verschiedene Grillspezialitäten aus eigener Schlachtung – mariniert und naturbelassen.
                      </div>
                      <ul className="product-features">
                        <li>Schweinenackensteaks</li>
                        <li>Schweinerückensteaks</li>
                        <li>Bauchfleisch-gewürzt</li>
                      </ul>
                    </div>
                  </div>

                  <div className="product-card">
                    <div className="product-image">
                      <img 
  src="/images/bratwurst.jpg" 
  alt="Hausgemachte Bratwürste" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
                    </div>
                    <div className="product-content">
                      <div className="product-category">Würstchen & Wurst</div>
                      <div className="product-name">Bratwürste & Grillwurst</div>
                      <div className="product-description">
                        Hausgemachte Bratwürste nach traditioneller Rezeptur – perfekt für den Grill.
                      </div>
                      <ul className="product-features">
                        <li>Bratwurst</li>
                        <li>Currywurst</li>
                        <li>Schinkengriller</li>
                        <li>Krakauer</li>
                        <li>Wildbratwurst</li>
                      </ul>
                    </div>
                  </div>

                  <div className="product-card">
                    <div className="product-image">
                      <img 
  src="/images/aufschnitt.jpg" 
  alt="Aufschnitt & Wurst" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
                    </div>
                    <div className="product-content">
                      <div className="product-category">Wurstwaren</div>
                      <div className="product-name">Aufschnitt & Wurst</div>
                      <div className="product-description">
                        Verschiedene Aufschnittsorten und Wurstwaren aus eigener Herstellung.
                      </div>
                      <ul className="product-features">
                        <li>Leberwurst</li>
                        <li>Mortadella</li>
                        <li>Bierschinken</li>
                        <li>Jagdwurst</li>
                        <li>Mettwurst</li>
                      </ul>
                    </div>
                  </div>

                  <div className="product-card">
                    <div className="product-image">
                      <img 
  src="/images/suppen.jpg" 
  alt="Hausgemachte Suppen" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
                    </div>
                    <div className="product-content">
                      <div className="product-category">Fertiggerichte</div>
                      <div className="product-name">Hausgemachte Suppen</div>
                      <div className="product-description">
                        Frisch zubereitete Suppen nach Hausrezept – einfach erwärmen und genießen.
                      </div>
                      <ul className="product-features">
                        <li>Hühnersuppe</li>
                        <li>Hochzeitssuppe</li>
                        <li>Kohlroulade</li>
                      </ul>
                    </div>
                  </div>

                  <div className="product-card">
                    <div className="product-image">
                     <img 
  src="/images/salate.jpg" 
  alt="Frische Salate" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
                    </div>
                    <div className="product-content">
                      <div className="product-category">Frische Salate</div>
                      <div className="product-name">Frische Salate</div>
                      <div className="product-description">
                        Täglich frisch zubereitete Salate als Beilage oder für den kleinen Hunger.
                      </div>
                      <ul className="product-features">
                        <li>Kartoffelsalat</li>
                        <li>Fleischsalat</li>
                      </ul>
                    </div>
                  </div>

                  <div className="product-card">
                    <div className="product-image">
                      <img 
  src="/images/sonderangebote.jpg" 
  alt="Saisonale Angebote" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
                    </div>
                    <div className="product-content">
                      <div className="product-category">Saisonales</div>
                      <div className="product-name">Wechselndes Sortiment</div>
                      <div className="product-description">
                        Saisonale Spezialitäten und Angebote – schauen Sie vorbei und entdecken Sie Neues!
                      </div>
                      <ul className="product-features">
                        <li>Saisonale Spezialitäten</li>
                        <li>verschiedene Wurstsorten</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  background: 'var(--color-bg-light)', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  textAlign: 'center',
                  marginTop: '3rem'
                }}>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    color: 'var(--color-gray)',
                    marginBottom: '1rem'
                  }}>
                    So funktioniert's
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '1rem' }}>
                    Unser Automat ist kinderleicht zu bedienen: Produkt auswählen, mit Bargeld oder Karte bezahlen, 
                    und schon können Sie Ihre frischen Waren mitnehmen. Der Automat ist 24 Stunden am Tag, 7 Tage die Woche verfügbar.
                  </p>
                  <p style={{ 
                    color: 'var(--color-red)', 
                    fontWeight: '700',
                    fontSize: '1.05rem'
                  }}>
                    💳 Zahlung: Bargeld & EC-Karte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Render Main Page */}
      {currentPage === 'main' && (
      <>
      {/* Header */}
      <div className="logo" onClick={() => navigateToPage('main')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
  <img 
    src="/images/logo.jpg" 
    alt="Hausschlachterei Straßberger" 
    style={{ 
      height: '45px',
      width: 'auto',
      display: 'block',
      objectFit: 'contain'
    }}
  />
  <div className="logo-tagline" style={{ marginTop: '0.2rem' }}>Seit 1973</div>
</div>

          <nav className="nav-desktop">
  <ul className="nav-links">
    <li 
      className={`nav-link automat`}
      onClick={() => navigateToPage('automat')}
    >
      🕐 24/7 Automat
    </li>
    <li 
      className={`nav-link ${activeSection === 'hours' ? 'active' : ''}`}
      onClick={() => scrollToSection('hours')}
    >
      Standorte
    </li>
    <li 
      className={`nav-link ${activeSection === 'origin' ? 'active' : ''}`}
      onClick={() => scrollToSection('origin')}
    >
      Herkunft
    </li>
    <li 
      className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
      onClick={() => scrollToSection('about')}
    >
      Über uns
    </li>
  </ul>
</nav>

          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            <Menu size={28} />
          </button>

      {/* Mobile Navigation */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
  <div className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
  <img 
    src="/images/logo.jpg" 
    alt="Hausschlachterei Straßberger" 
    style={{ 
      height: '45px',
      width: 'auto',
      display: 'block',
      objectFit: 'contain'
    }}
  />
  <div className="logo-tagline" style={{ marginTop: '0.2rem' }}>Seit 1973</div>
</div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            style={{ 
              background: 'var(--color-bg-light)', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--color-red)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-light)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
            aria-label="Menü schließen"
          >
            <X size={28} color="var(--color-gray)" />
          </button>
        </div>
        <ul className="mobile-nav-links">
          <li 
            className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => scrollToSection('home')}
          >
            <Home size={20} />
            <span>Startseite</span>
          </li>
          <li 
            className="mobile-nav-link automat-mobile"
            onClick={() => navigateToPage('automat')}
          >
            <Clock size={20} />
            <span>24/7 Automat</span>
          </li>
          <li 
            className={`mobile-nav-link ${activeSection === 'hours' ? 'active' : ''}`}
            onClick={() => scrollToSection('hours')}
          >
            <MapPin size={20} />
            <span>Öffnungszeiten & Standorte</span>
          </li>
          <li 
            className={`mobile-nav-link ${activeSection === 'origin' ? 'active' : ''}`}
            onClick={() => scrollToSection('origin')}
          >
            <Award size={20} />
            <span>Herkunft</span>
          </li>
          <li 
            className={`mobile-nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => scrollToSection('about')}
          >
            <Users size={20} />
            <span>Über uns</span>
          </li>
        </ul>
      </div>

      {/* Market Modal */}
      {showMarketModal && (
        <div className="modal-overlay" onClick={() => setShowMarketModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="modal-close"
                onClick={() => setShowMarketModal(false)}
                aria-label="Schließen"
              >
                <X size={20} />
              </button>
              <div className="modal-title">Wo finden Sie uns heute?</div>
              <div className="modal-subtitle">Unsere Wochenmärkte und der 24/7 Automat</div>
            </div>
            
            <div className="modal-body">
              <div className="modal-tabs">
                <button 
                  className={`modal-tab ${modalTab === 'today' ? 'active' : ''}`}
                  onClick={() => setModalTab('today')}
                >
                  Heute
                </button>
                <button 
                  className={`modal-tab ${modalTab === 'week' ? 'active' : ''}`}
                  onClick={() => setModalTab('week')}
                >
                  Diese Woche
                </button>
              </div>

              <div className="modal-markets">
                {getFilteredMarketsForModal().length > 0 ? (
                  getFilteredMarketsForModal().map((day, index) => {
                    const isToday = day.day === todayCapitalized;
                    return (
                      <div key={index} className={`modal-market-card ${isToday ? 'today' : ''}`}>
                        <div className="modal-market-day">
                          {day.day}
                          {isToday && <span className="modal-today-badge">HEUTE</span>}
                        </div>
                        {day.locations.map((location, locIndex) => {
                          const marketOpen = isMarketOpen(day.day, location.time);
                          const marketPassed = isMarketPassed(day.day, location.time);
                          return (
                            <div 
                              key={locIndex} 
                              className={`modal-location ${marketOpen ? 'market-open' : ''} ${marketPassed ? 'market-passed' : ''}`}
                            >
                              <div className="modal-location-name">
                                {location.name}
                                {marketOpen && (
                                  <span className="open-badge">
                                    <span className="open-dot"></span>
                                    JETZT GEÖFFNET
                                  </span>
                                )}
                              </div>
                              <div className="modal-location-time">
                                <Clock size={14} />
                                {location.time}
                              </div>
                              <button 
                                className="btn btn-primary"
                                onClick={() => {
                                  openGoogleMaps(location.address);
                                  setShowMarketModal(false);
                                }}
                                style={{ width: '100%', padding: '0.75rem' }}
                              >
                                <MapPin size={18} />
                                Route planen
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                ) : (
                  <div className="modal-empty">
                    <div className="modal-empty-icon">
                      <Clock size={32} />
                    </div>
                    <div className="modal-empty-title">Heute keine Märkte</div>
                    <div className="modal-empty-text">
                      Heute haben wir keine Wochenmärkte geöffnet.<br />
                      Besuchen Sie uns an einem anderen Tag!
                    </div>
                  </div>
                )}

                {/* Always show 24/7 Automat in modal */}
                <div className="modal-automat-card">
                  <div className="modal-automat-title">
                    <Clock size={24} />
                    24/7 Fleischautomat
                  </div>
                  <div className="modal-automat-text">
                    Jederzeit verfügbar auf dem Straßberger's Hof in Buchholz – Neue Straße 2
                  </div>
                  <button 
                    className="btn btn-white"
                    onClick={() => {
                      openGoogleMaps('Neue Str. 2, 31710 Buchholz');
                      setShowMarketModal(false);
                    }}
                    style={{ width: '100%' }}
                  >
                    <MapPin size={18} />
                    Route zum Automaten
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Home Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="hero-headline">Wissen, wo's herkommt.</h1>
          <p className="hero-subline">
            Frisches Fleisch und handgemachte Wurstwaren – direkt aus unserem Familienbetrieb in Buchholz. Seit 1973.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('hours')}
            >
              Öffnungszeiten & Standorte ansehen
              <ChevronRight size={20} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => openGoogleMaps('Neue Str. 2, 31710 Buchholz')}
            >
              <MapPin size={20} />
              24/7 Fleischautomat – Route
            </button>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Beef size={28} />
              </div>
              <h3 className="feature-title">Eigene Schlachtung</h3>
              <p className="feature-text">Verantwortungsvolle Verarbeitung im eigenen Betrieb</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MapPin size={28} />
              </div>
              <h3 className="feature-title">Regionaler Hof aus Schaumburg</h3>
              <p className="feature-text">Kurze Wege von bekannten lokalen Höfen</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={28} />
              </div>
              <h3 className="feature-title">Handgemachte Wurstwaren</h3>
              <p className="feature-text">Nach traditioneller Rezeptur hergestellt</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Award size={28} />
              </div>
              <h3 className="feature-title">Kurze Wege & stressarme Verarbeitung</h3>
              <p className="feature-text">Für beste Qualität und Tierwohl</p>
            </div>
          </div>
        </div>
      </section>

      {/* Where to Find Us */}
      <div className="where-to-find">
        <h2 className="section-title">Wo Sie uns finden</h2>
        <p className="section-subtitle">
          Sie finden uns auf den Wochenmärkten sowie jederzeit an unserem 24/7 Automaten auf dem Hof in Buchholz, Neue Straße 2.
        </p>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="market-teaser">
            <div className="market-day">Dienstag</div>
            <div className="market-location">Marktplatz, Obernkirchen • 08:00 bis 13:00</div>
          </div>

          <div className="market-teaser">
            <div className="market-day">Mittwoch</div>
            <div className="market-location">Wochenmarkt, Bad Eilsen • 08:00 bis 13:00</div>
            <div className="market-location">Gottschalk's Hof, Helpsen • 14:00 bis 17:00</div>
          </div>

          <div className="market-teaser">
            <div className="market-day">Donnerstag</div>
            <div className="market-location">Wochenmarkt, Minden • 08:00 bis 13:00</div>
            <div className="market-location">Straßberger's Hof, Buchholz • 14:00 bis 17:00</div>
          </div>

          <div className="market-teaser">
            <div className="market-day">Freitag</div>
            <div className="market-location">Marktplatz, Obernkirchen • 07:30 bis 13:00</div>
            <div className="market-location">Ovesiek's Hof, Meinsen • 14:00 bis 18:00</div>
          </div>

          <div className="market-teaser">
            <div className="market-day">Samstag</div>
            <div className="market-location">Ovesiek's Hof, Meinsen • 07:00 bis 10:00</div>
            <div className="market-location">Straßberger's Hof, Buchholz • 10:30 bis 11:30</div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => scrollToSection('hours')}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Alle Marktzeiten ansehen
          </button>
        </div>
      </div>

      {/* 24/7 Automat Section */}
      <section>
        <div className="automat-card">
          <h3 className="automat-title">
            <Clock size={32} />
            Unser 24/7 Fleischautomat
          </h3>
          <p className="automat-text">
            Unser Automat bietet Ihnen jederzeit frisches Grillfleisch, Würstchen, Suppen, Salate und vieles mehr – perfekt für spontanen Genuss rund um die Uhr.
          </p>
          <div className="automat-address">
            <MapPin size={24} />
            <span>Straßberger's Hof, Buchholz – Neue Straße 2</span>
          </div>
          <button 
            className="btn btn-white"
            onClick={() => openGoogleMaps('Neue Str. 2, 31710 Buchholz')}
          >
            <MapPin size={20} />
            Route planen
          </button>
        </div>
      </section>

      {/* Tradition Section */}
      <section>
        <div className="content-section">
          <h3 className="content-title">Tradition & Familienhandwerk seit 1973</h3>
          <p className="content-text">
            Seit über 50 Jahren steht die Hausschlachterei Straßberger für echte Handwerkskunst und höchste Qualität. Als Familienbetrieb wissen wir: Gutes Fleisch braucht Zeit, Sorgfalt und die richtigen Partner. Unsere Tiere kommen von regionalen Höfen aus Schaumburg, die wir persönlich kennen. Die Verarbeitung erfolgt in unserem eigenen Betrieb – von der Schlachtung bis zur fertigen Wurst.
          </p>
          <p className="content-text">
            Diese kurzen Wege garantieren nicht nur Frische und Geschmack, sondern auch Transparenz. Sie können sich darauf verlassen, dass jedes unserer Produkte mit Respekt vor Tier und Natur hergestellt wird. Tradition bedeutet für uns nicht Stillstand, sondern bewährte Rezepturen mit modernem Qualitätsbewusstsein zu vereinen.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => scrollToSection('about')}
          >
            Mehr über uns
          </button>
        </div>
      </section>

      {/* Origin Teaser */}
      <section>
        <div className="content-section">
          <h3 className="content-title">Herkunft, die wir kennen</h3>
          <p className="content-text">
            Unsere Schweine stammen ausschließlich von den Höfen Pohl und Eggelmann in Gelldorf. Die sehr kurzen Transportwege bedeuten weniger Stress für die Tiere und bessere Fleischqualität für Sie. Durch die Fütterung mit selbst angebautem Getreide und einer angepassten Aufzucht erreichen wir ein langsameres Wachstum – das Fleisch wird dadurch fester und aromatischer.
          </p>
          <p className="content-text">
            Die stressarme Schlachtung erfolgt in unserem eigenen Betrieb nach einer Ruhephase. So können wir jeden Schritt selbst kontrollieren und garantieren lückenlose Herkunft vom Hof bis zum fertigen Produkt.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => scrollToSection('origin')}
          >
            Zur Herkunft
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="section-title">Häufige Fragen</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <ChevronRight size={20} className="faq-chevron" />
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Opening Hours Section */}
      <section id="hours">
  <h2 className="section-title">Öffnungszeiten & Standorte</h2>
        <p className="section-subtitle">
          Besuchen Sie uns auf einem unserer Wochenmärkte oder nutzen Sie unseren 24/7 Fleischautomaten für spontanen Einkauf.
        </p>

        {/* Tabs */}
        <div className="market-tabs">
          <button 
            className={`market-tab ${marketTab === 'today' ? 'active' : ''}`}
            onClick={() => setMarketTab('today')}
          >
            Heute
          </button>
          <button 
            className={`market-tab ${marketTab === 'week' ? 'active' : ''}`}
            onClick={() => setMarketTab('week')}
          >
            Diese Woche
          </button>
        </div>

        <div className="hours-grid">
          {getFilteredMarkets().length > 0 ? (
            getFilteredMarkets().map((day, index) => {
              const isToday = day.day === todayCapitalized;
              return (
                <div key={index} className={`day-card ${isToday ? 'today' : ''}`}>
                  <div className="day-header">
                    <span>{day.day}</span>
                    {isToday && <span className="today-badge">HEUTE</span>}
                  </div>
                  <div className="day-locations">
                    {day.locations.map((location, locIndex) => {
                      const marketOpen = isMarketOpen(day.day, location.time);
                      const marketPassed = isMarketPassed(day.day, location.time);
                      return (
                        <div 
                          key={locIndex} 
                          className={`location-item ${marketOpen ? 'market-open' : ''} ${marketPassed ? 'market-passed' : ''}`}
                        >
                          <div className="location-name">
                            {location.name}
                            {marketOpen && (
                              <span className="open-badge">
                                <span className="open-dot"></span>
                                JETZT GEÖFFNET
                              </span>
                            )}
                          </div>
                          <div className="location-time">
                            <Clock size={16} />
                            {location.time}
                          </div>
                          <button 
                            className="btn btn-map"
                            onClick={() => openGoogleMaps(location.address)}
                          >
                            <MapPin size={16} />
                            Route planen
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#666' 
            }}>
              <p style={{ fontSize: '1.1rem' }}>Heute haben wir keine Marktstände geöffnet.</p>
              <p style={{ marginTop: '0.5rem' }}>Besuchen Sie uns an einem anderen Tag oder nutzen Sie unseren 24/7 Automaten!</p>
            </div>
          )}

          {/* 24/7 Automat Card - always show when tab is 'week' or 'today' */}
          {(marketTab === 'week' || marketTab === 'today') && (
            <div className="day-card" style={{ gridColumn: 'span 1' }}>
              <div className="day-header">
                <span>24/7 Fleischautomat</span>
              </div>
              <div className="day-locations">
                <div className="location-item">
                  <div className="location-name">Neue Str. 2, 31710 Buchholz</div>
                  <div className="location-time">
                    <MapPin size={16} />
                    Neue Straße 2
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
                    Unser Automat bietet Ihnen jederzeit frisches Grillfleisch, Würstchen, Suppen, Salate und vieles mehr – perfekt für spontanen Genuss rund um die Uhr.
                  </p>
                  <button 
                    className="btn btn-map"
                    onClick={() => openGoogleMaps('Neue Str. 2, 31710 Buchholz')}
                  >
                    <MapPin size={16} />
                    Route planen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Origin Section */}
      <section id="origin">
        <div className="origin-content">
          <h2 className="section-title">Herkunft unserer Schweine</h2>
          <p className="section-subtitle">
            Transparenz vom Hof bis zum fertigen Produkt – wir kennen jeden Schritt.
          </p>

          <ul className="origin-list">
            <li>
              Unsere Schweine stammen ausschließlich von den Höfen Pohl und Eggelmann in Gelldorf (Schaumburg).
            </li>
            <li>
              Die Ferkel kommen aus der Ferkelzucht der KLEPO Agrar GbR, ebenfalls aus Gelldorf.
            </li>
            <li>
              Sehr kurze Transportwege bedeuten weniger Stress für die Tiere und bessere Qualität für Sie.
            </li>
            <li>
              Fütterung mit selbst angebautem Getreide & Gerste, vor Ort gemahlen und ergänzt mit Eiweißfutter.
            </li>
            <li>
              Angepasste Fütterung ermöglicht langsameres Wachstum – das Fleisch wird dadurch fester und aromatischer.
            </li>
            <li>
              Medikamente sind weitestgehend vermeidbar; bei Bedarf nur Wurmkur.
            </li>
            <li>
              Schlachtung im eigenen Betrieb nach Ruhephase – verantwortungsvoll, hygienisch und mit Fokus auf Tierwohl.
            </li>
            <li>
              Vom Tier bis zum fertigen Produkt – alles aus einer Hand.
            </li>
          </ul>

          <div className="trust-box">
            <div className="trust-box-text">
              „Wir kennen die Höfe persönlich und können die Herkunft lückenlos garantieren."
            </div>
          </div>

          
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <div className="about-content">  
          <h2 className="section-title">Über uns</h2>
          <p className="section-subtitle">
            Familienbetrieb seit 1973 – Handwerk, Regionalität und Vertrauen in jeder Wurst.
          </p>

          <div className="product-image">
            <img 
    src="/images/verkaufswagen.jpg" 
    alt="Unser Verkaufswagen" 
    style={{ width: '250px', height: '350px'}}
  />
          </div>

          <div className="about-grid">
            <div className="about-item">
              <div className="about-item-title">Familienbetrieb seit 1973</div>
              <div className="about-item-text">
                Über drei Generationen hinweg pflegen wir das Handwerk der Hausschlachterei. Was als kleiner Betrieb begann, ist heute eine feste Größe in der Region Schaumburg – immer mit dem Anspruch, Tradition und Qualität zu vereinen.
              </div>
            </div>

            <div className="about-item">
              <div className="about-item-title">Höchste Standards & EU-Zulassung</div>
              <div className="about-item-text">
                Wir erfüllen alle Hygiene- und Sicherheitsvorschriften und verfügen über die EU-Zulassung. Als einer der wenigen Betriebe in Schaumburg dürfen wir noch selbst schlachten – ein Privileg, das wir mit großer Verantwortung ausüben.
              </div>
            </div>

            <div className="about-item">
              <div className="about-item-title">Handarbeit nach alter Tradition</div>
              <div className="about-item-text">
                Von der Zerlegung bis zur Wurstherstellung – alles passiert bei uns von Hand. Wir verwenden bewährte Rezepturen und natürliche Gewürze. Unser Team sorgt dafür, dass jedes Produkt mit Sorgfalt entsteht.
              </div>
            </div>

            <div className="about-item">
              <div className="about-item-title">Regional & persönlich</div>
              <div className="about-item-text">
                Sie finden uns auf Wochenmärkten in der Region – im Verkaufswagen, wo wir Sie persönlich beraten. Bestellungen für besondere Anlässe wie Aufschnittplatten oder Wurstmollen nehmen wir gerne nach Absprache entgegen.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
         <img 
  src="/images/logo.jpg" 
  alt="Hausschlachterei Straßberger" 
  style={{ 
    height: '50px',
    width: 'auto',
    marginBottom: '0.5rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }}
/>
          <div className="footer-tagline">WISSEN, WO'S HERKOMMT – SEIT 1973</div>
          
          <ul className="footer-links">
            <li className="footer-link" onClick={() => navigateToPage('main')}>Startseite</li>
            <li className="footer-link" onClick={() => navigateToPage('automat')}>24/7 Automat</li>
            <li className="footer-link" onClick={() => { navigateToPage('main'); setTimeout(() => scrollToSection('hours'), 100); }}>Öffnungszeiten & Standorte</li>
            <li className="footer-link" onClick={() => { navigateToPage('main'); setTimeout(() => scrollToSection('origin'), 100); }}>Herkunft</li>
            <li className="footer-link" onClick={() => { navigateToPage('main'); setTimeout(() => scrollToSection('about'), 100); }}>Über uns</li>
            <li className="footer-link" onClick={() => navigateToPage('impressum')}>Impressum</li>
            <li className="footer-link" onClick={() => navigateToPage('datenschutz')}>Datenschutz</li>
          </ul>

          <div className="footer-copyright">
            © 2025 Hausschlachterei Straßberger. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>

      {/* Mobile Quick-Actions Bar */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn"
          onClick={() => scrollToSection('hours')}
        >
          <div className="quick-action-icon">
            <Clock size={20} />
          </div>
          <span>Standorte</span>
        </button>
        
        <button 
          className="quick-action-btn primary"
          onClick={() => openGoogleMaps('Neue Str. 2, 31710 Buchholz')}
        >
          <div className="quick-action-icon">
            <MapPin size={20} />
          </div>
          <span>Route 24/7</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={scrollToTop}
        >
          <div className="quick-action-icon">
            <ChevronRight size={20} style={{ transform: 'rotate(-90deg)' }} />
          </div>
          <span>Nach oben</span>
        </button>
      </div>
      </>
      )}
    </div>
  );
}
