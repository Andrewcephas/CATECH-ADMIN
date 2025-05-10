import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: "#017020" }} // Catech green
      className="text-white py-5 px-3"
    >
      <div className="container">
        <div className="row">
          {/* Logo and Description */}
          <div className="col-md-3">
            <h2 className="fw-bold">Catech</h2>
            <p className="mt-2 small">
              At Catech, we fuse creativity, technology, and design to offer solutions in IT, graphics, research, and innovation. Empowering ideas with impact.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Quick Links</h5>
            <ul className="list-unstyled small">
              <li>
                <a href="/services" className="text-white text-decoration-none">
                  Services
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-white text-decoration-none">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/team" className="text-white text-decoration-none">
                  Our Team
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Support</h5>
            <ul className="list-unstyled small">
              <li>
                <a href="/help" className="text-white text-decoration-none">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white text-decoration-none">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white text-decoration-none">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Subscribe</h5>
            <p className="small">Join our mailing list for updates and offers.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                aria-label="Your email"
              />
              <button className="btn fw-bold" style={{ backgroundColor: "#ff9900", color: "#fff" }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center small mt-4 border-top border-white pt-3">
        &copy; {new Date().getFullYear()} Catech Solutions & Graphics. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
