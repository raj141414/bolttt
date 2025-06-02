
import PageLayout from '@/components/layout/PageLayout';
import OrderForm from '@/components/order/OrderForm';

const Order = () => {
  return (
    <PageLayout>
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
            <p className="mt-4 text-xl text-gray-600">
              Fill out the form below to submit your print job
            </p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
            <OrderForm />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Order;
