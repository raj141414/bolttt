
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/e8c04aca-b737-4fd2-9259-04947199d9b5.png" 
                alt="Aishwarya Xerox Logo" 
                className="h-10 w-auto mr-3"
              />
              <span className="text-2xl font-bold text-xerox-700">Aishwarya xerox</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-xerox-700">
              Home
            </Link>
            <Link to="/order" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-xerox-700">
              Place Order
            </Link>
            <Link to="/track" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-xerox-700">
              Track Order
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-xerox-700">
              Admin
            </Link>
            <Button variant="default" className="ml-4 bg-xerox-600 hover:bg-xerox-700">
              <Link to="/order" className="text-white">
                Order Now
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-xerox-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/order" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-xerox-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Place Order
            </Link>
            <Link 
              to="/track" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-xerox-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Track Order
            </Link>
            <Link 
              to="/admin" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-xerox-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-2">
              <Button variant="default" className="w-full bg-xerox-600 hover:bg-xerox-700">
                <Link to="/order" className="text-white" onClick={() => setMobileMenuOpen(false)}>
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
