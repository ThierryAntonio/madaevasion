import { Facebook, Mail, MessageCircle, MapPin, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>MadaÉvasion</h3>
          <p>Votre partenaire de confiance pour découvrir les merveilles de Madagascar.</p>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p><MapPin size={18} style={{marginRight: '8px'}} /> Antsiranana 201, Madagascar</p>
          <p><Phone size={18} style={{marginRight: '8px'}} /> +261 38 58 344 40</p>
          <p><Mail size={18} style={{marginRight: '8px'}} /> antoniojunioe2@gmail.com</p>
        </div>

        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
              <Facebook size={24} />
            </a>
            <a href="https://wa.me/261385834440" target="_blank" rel="noreferrer" className="social-icon">
              <MessageCircle size={24} />
            </a>
            <a href="mailto:antoniojunioe2@gmail.com" className="social-icon">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MadaÉvasion. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
