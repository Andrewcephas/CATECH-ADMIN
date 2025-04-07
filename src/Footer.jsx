import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: "#890010" }}
      className="text-white py-5 px-3"
    >
      <div className="container">
        <div className="row">
          {/* Logo and Description */}
          <div className="col-md-3">
            <h2 className="fw-bold">Engoko</h2>
            <p className="mt-2 small">
              Your trusted Chicken supply store. We offer premium products, you
              cant regret trading with us.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Quick Links</h5>
            <ul className="list-unstyled small">
              <li>
                <a href="/shop" className="text-white text-decoration-none">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="text-white text-decoration-none">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-white text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Customer Service</h5>
            <ul className="list-unstyled small">
              <li>
                <a href="/shipping" className="text-white text-decoration-none">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white text-decoration-none">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-md-3">
            <h5 className="fw-semibold">Subscribe</h5>
            <p className="small">Get the latest updates and offers.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                aria-label="Your email"
              />
              <button className="btn btn-light text-danger fw-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center small mt-4 border-top border-white pt-3">
        &copy; {new Date().getFullYear()} Engoko Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
