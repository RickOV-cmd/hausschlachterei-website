berger's Hof, Buchholz</div>
                  <div className="location-time">
                    <Clock size={16} />
                    Rund um die Uhr verfügbar
                  </div>
                  <button 
                    className="btn btn-map"
                    onClick={() => openGoogleMaps('Neue Str. 2, 31710 Buchholz')}
                  >
                    <MapPin size={16} />
                    Route zum Automaten
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Origin Section */}
      <section id="origin" className="origin-section">
        <div className="origin-content">
          <h2 className="section-title">Herkunft mit Gesicht</h2>
          <p className="section-subtitle">
            Kurze Wege, bekannte Gesichter – wir wissen genau, woher unser Fleisch kommt.
          </p>

          <ul className="origin-list">
            <li>Alle Schweine stammen von den Höfen Pohl und Eggelmann in Gelldorf</li>
            <li>Ferkelzucht durch KLEPO Agrar GbR</li>
            <li>Fütterung mit eigenem Getreide vom Hof</li>
            <li>Stressarme Schlachtung nach Ruhephase in unserem eigenen Betrieb</li>
            <li>Sehr kurze Transportwege für beste Fleischqualität</li>
          </ul>

          <div className="trust-box">
            <p className="trust-box-text">
              "Wir kennen jeden Hof persönlich und stehen für lückenlose Herkunft – vom Ferkel bis zum fertigen Produkt."
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <div className="about-content">
          <h2 className="section-title">Über uns</h2>
          <p className="section-subtitle">
            Tradition trifft Handwerk – seit über 50 Jahren im Dienst der Qualität.
          </p>

          <div className="about-grid">
            <div className="about-item">
              <h3 className="about-item-title">Unser Familienbetrieb</h3>
              <p className="about-item-text">
                Seit 1973 führen wir die Hausschlachterei Straßberger in Buchholz. Was als kleiner Handwerksbetrieb begann, ist heute eine feste Größe in der Region – ohne dabei die familiären Werte zu verlieren.
              </p>
            </div>

            <div className="about-item">
              <h3 className="about-item-title">Handwerk & Qualität</h3>
              <p className="about-item-text">
                Jedes Produkt entsteht in Handarbeit nach bewährten Rezepturen. Von der Auswahl der Tiere über die Verarbeitung bis zum fertigen Produkt – alles liegt in unserer Hand.
              </p>
            </div>

            <div className="about-item">
              <h3 className="about-item-title">Regional verwurzelt</h3>
              <p className="about-item-text">
                Wir arbeiten ausschließlich mit regionalen Höfen zusammen und verkaufen auf den Wochenmärkten der Region. So bleiben wir nah bei unseren Kunden und unseren Werten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Hausschlachterei Straßberger</div>
          <div className="footer-tagline">Seit 1973 – Tradition & Qualität aus Schaumburg</div>
          
          <ul className="footer-links">
            <li className="footer-link" onClick={() => navigateToPage('automat')}>24/7 Automat</li>
            <li className="footer-link" onClick={() => scrollToSection('hours')}>Standorte</li>
            <li className="footer-link" onClick={() => scrollToSection('origin')}>Herkunft</li>
            <li className="footer-link" onClick={() => scrollToSection('about')}>Über uns</li>
            <li className="footer-link" onClick={() => navigateToPage('impressum')}>Impressum</li>
            <li className="footer-link" onClick={() => navigateToPage('datenschutz')}>Datenschutz</li>
          </ul>

          <div className="footer-copyright">
            © {new Date().getFullYear()} Hausschlachterei Straßberger. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>

      {/* Mobile Quick Actions */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn"
          onClick={() => scrollToSection('hours')}
        >
          <div className="quick-action-icon">
            <MapPin size={20} />
          </div>
          Standorte
        </button>
        <button 
          className="quick-action-btn primary"
          onClick={() => setShowMarketModal(true)}
        >
          <div className="quick-action-icon">
            <Clock size={20} />
          </div>
          Heute
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => navigateToPage('automat')}
        >
          <div className="quick-action-icon">
            <Beef size={20} />
          </div>
          24/7 Automat
        </button>
      </div>
      </>
      )}
    </div>
  );
}
