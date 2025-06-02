import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Printer, FileText, CheckCircle, Clock, BookOpen, Image, Bookmark } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [
    {
      url: "https://images.pexels.com/photos/6814537/pexels-photo-6814537.jpeg",
      alt: "Professional printing services"
    },
    {
      url: "https://images.pexels.com/photos/6615076/pexels-photo-6615076.jpeg",
      alt: "Modern printing equipment"
    },
    {
      url: "https://images.pexels.com/photos/5905500/pexels-photo-5905500.jpeg",
      alt: "Document printing"
    },
    {
      url: "https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg",
      alt: "Print shop services"
    },
    {
      url: "https://images.pexels.com/photos/5905558/pexels-photo-5905558.jpeg",
      alt: "Professional printing"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-xerox-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Professional Printing Services On Demand
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Fast, affordable, high-quality printing solutions for all your needs. 
                Upload your files and we'll handle the rest.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-xerox-600 hover:bg-xerox-700">
                  <Link to="/order" className="text-white">
                    Start your order
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Carousel 
                className="w-full max-w-lg"
                selectedIndex={currentSlide}
                setSelectedIndex={setCurrentSlide}
              >
                <CarouselContent>
                  {carouselImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="rounded-lg shadow-lg w-full h-[400px] object-cover" 
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600">
              High-quality printing solutions for all your needs
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-xerox-100 rounded-lg flex items-center justify-center">
                <Printer className="h-6 w-6 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Printing</h3>
              <p className="mt-2 text-gray-600">
                High-quality printing for documents, reports, presentations, and more.
              </p>
              <Button className="mt-4 w-full bg-xerox-600 hover:bg-xerox-700">
                <Link to="/order" className="text-white">
                  Order Now
                </Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-xerox-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Spiral Binding</h3>
              <p className="mt-2 text-gray-600">
                Professional spiral binding for documents, reports, and presentations.
              </p>
              <Button className="mt-4 w-full bg-xerox-600 hover:bg-xerox-700">
                <Link to="/order" className="text-white">
                  Order Now
                </Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-xerox-100 rounded-lg flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Project Binding</h3>
              <p className="mt-2 text-gray-600">
                Complete project binding solutions for academic and professional needs.
              </p>
              <Button className="mt-4 w-full bg-xerox-600 hover:bg-xerox-700">
                <Link to="/order" className="text-white">
                  Order Now
                </Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-xerox-100 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Photo Frame</h3>
              <p className="mt-2 text-gray-600">
                Coming Soon! Professional photo framing services for your memories.
              </p>
              <Button className="mt-4 w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple 3-step process to get your documents printed
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-xerox-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">1. Upload Your Files</h3>
              <p className="mt-2 text-gray-600">
                Select and upload the files you want to print.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-xerox-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">2. Choose Options</h3>
              <p className="mt-2 text-gray-600">
                Select paper size, number of copies, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-xerox-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-xerox-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">3. Submit Order</h3>
              <p className="mt-2 text-gray-600">
                We'll process your order and have it ready for pickup.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-xerox-600 hover:bg-xerox-700">
              <Link to="/order" className="text-white">
                Place Your Order Now
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-xerox-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your Print Job?</h2>
          <p className="mt-4 text-xl">
            Fast, reliable printing services for your documents and files
          </p>
          <div className="mt-8">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-xerox-800">
              <Link to="/order">
                Order Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;