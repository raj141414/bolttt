
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aishwarya xerox</h3>
            <p className="text-gray-600">
              Professional printing and copying services for all your needs.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-xerox-700">Home</Link>
              </li>
              <li>
                <Link to="/order" className="text-gray-600 hover:text-xerox-700">Place Order</Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-600 hover:text-xerox-700">Track Order</Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-xerox-700">Admin</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600">
              <p>ADB road near pragati engineering college</p>
              <p>ramesampeta, surampalem</p>
              <p className="mt-2">Phone: 6301526803</p>
              <p>Email: aishwaryaxerox1999@gmail.com</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            &copy; {currentYear} Aishwarya xerox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
