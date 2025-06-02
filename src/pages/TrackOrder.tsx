import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { toast } from "sonner";

interface Order {
  orderId: string;
  fullName: string;
  phoneNumber: string;
  printType: string;
  copies: number;
  paperSize: string;
  specialInstructions?: string;
  orderDate: string;
  status: string;
  files: Array<{ name: string; size: number; type: string; path?: string }>;
  totalCost: number;
  printSide: string;
}

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setLoading(true);
    setNotFound(false);
    setOrder(null);

    // Simulate loading delay
    setTimeout(() => {
      try {
        const existingOrders = JSON.parse(localStorage.getItem('xeroxOrders') || '[]') as Order[];
        const foundOrder = existingOrders.find(order => order.orderId === orderId.trim());
        
        if (foundOrder) {
          setOrder(foundOrder);
          toast.success("Order found!");
        } else {
          setNotFound(true);
          toast.error("Order not found. Please check your order ID.");
        }
      } catch (error) {
        console.error('Error searching for order:', error);
        toast.error("Error searching for order");
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <Package className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Ready for Pickup';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  const getPrintTypeName = (type: string) => {
    switch (type) {
      case 'blackAndWhite': return 'Black & White';
      case 'color': return 'Color';
      default: return type;
    }
  };

  return (
    <PageLayout>
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
            <p className="mt-4 text-xl text-gray-600">
              Enter your order ID to check the status of your print job
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Order Lookup
              </CardTitle>
              <CardDescription>
                Enter the order ID you received after placing your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Order ID (e.g., ORD-1234567890)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleTrackOrder} 
                  disabled={loading}
                  className="bg-xerox-600 hover:bg-xerox-700"
                >
                  {loading ? 'Searching...' : 'Track Order'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {notFound && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-800 mb-2">Order Not Found</h3>
                  <p className="text-red-600">
                    Please check your order ID and try again. If you continue to have issues, 
                    please contact us at 6301526803.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {order && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order Status: {getStatusText(order.status)}
                  </CardTitle>
                  <CardDescription>
                    Order ID: {order.orderId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {order.fullName}</p>
                        <p><span className="font-medium">Phone:</span> {order.phoneNumber}</p>
                        <p><span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Print Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Print Type:</span> {getPrintTypeName(order.printType)}</p>
                        <p><span className="font-medium">Print Side:</span> {order.printSide === 'double' ? 'Double Sided' : 'Single Sided'}</p>
                        <p><span className="font-medium">Copies:</span> {order.copies}</p>
                        <p><span className="font-medium">Paper Size:</span> {order.paperSize.toUpperCase()}</p>
                        <p><span className="font-medium">Total Cost:</span> ₹{order.totalCost?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                  {order.specialInstructions && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                      <p className="text-sm text-gray-600">{order.specialInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Files to Print</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                    <p className="text-sm text-blue-700">
                      If you have any questions about your order, please contact us:
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-blue-700">
                      <p>Phone: 6301526803</p>
                      <p>Email: aishwaryaxerox1999@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default TrackOrder;