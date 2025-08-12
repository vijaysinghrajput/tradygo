import { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, Clock, Shield, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@tradygo/ui';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Returns & Exchanges',
  description: 'Learn about TradyGo\'s hassle-free return and exchange policy. Easy returns within 30 days with free pickup and full refunds.',
  canonical: '/returns',
});

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Go to your orders and select the item you want to return.',
    icon: RotateCcw,
  },
  {
    step: 2,
    title: 'Schedule Pickup',
    description: 'Choose a convenient time for our team to pick up the item.',
    icon: Clock,
  },
  {
    step: 3,
    title: 'Quality Check',
    description: 'We inspect the item to ensure it meets return conditions.',
    icon: Shield,
  },
  {
    step: 4,
    title: 'Refund Processed',
    description: 'Your refund is processed within 5-7 business days.',
    icon: CheckCircle,
  },
];

const returnableItems = [
  'Electronics (unopened, with original packaging)',
  'Fashion items (unworn, with tags)',
  'Books (in original condition)',
  'Home & Garden items (unused)',
  'Sports equipment (unused)',
];

const nonReturnableItems = [
  'Perishable goods (food, flowers)',
  'Personal care items (opened)',
  'Custom or personalized items',
  'Digital downloads',
  'Gift cards',
  'Items damaged by misuse',
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Hassle-free returns within 30 days
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/account/orders">View My Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">30-Day Window</h3>
            <p className="text-sm text-gray-600">Return items within 30 days of delivery for a full refund.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Pickup</h3>
            <p className="text-sm text-gray-600">We'll pick up the item from your doorstep at no extra cost.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Full Refund</h3>
            <p className="text-sm text-gray-600">Get your money back in 5-7 business days after pickup.</p>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How Returns Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {returnSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Policy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Returnable Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What Can Be Returned</h3>
            </div>
            <ul className="space-y-3">
              {returnableItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <XCircle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What Cannot Be Returned</h3>
            </div>
            <ul className="space-y-3">
              {nonReturnableItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy Details</h2>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Return Window</h3>
              <p className="text-gray-700 leading-relaxed">
                You have 30 days from the date of delivery to initiate a return. The return window starts from the day you receive your order. For orders with multiple items, the return window applies to each item individually.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Condition Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                To be eligible for a return, items must be:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>In original condition with all tags and labels attached</li>
                <li>Unused and unworn (for fashion items)</li>
                <li>In original packaging with all accessories and manuals</li>
                <li>Free from damage not caused by defects</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Once we receive and inspect your returned item:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We'll send you an email confirmation of receipt</li>
                <li>Quality check is completed within 2-3 business days</li>
                <li>Approved refunds are processed within 5-7 business days</li>
                <li>Refunds are credited to your original payment method</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Exchanges</h3>
              <p className="text-gray-700 leading-relaxed">
                We currently offer exchanges for size and color variations of the same product, subject to availability. If the desired variant is not available, we'll process a full refund instead.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Damaged or Defective Items</h3>
              <p className="text-gray-700 leading-relaxed">
                If you receive a damaged or defective item, please contact us within 48 hours of delivery. We'll arrange for immediate pickup and provide a replacement or full refund, including any shipping charges.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Return Shipping</h3>
              <p className="text-gray-700 leading-relaxed">
                We provide free return shipping for all eligible returns. Our logistics partner will pick up the item from your registered address. Please ensure someone is available during the scheduled pickup time.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Support</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have any questions about returns or need assistance with your return request:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Customer Support</strong><br />
                  Email: returns@tradygo.com<br />
                  Phone: 1800-123-TRADY (87239)<br />
                  Hours: Monday - Saturday, 9 AM - 8 PM IST
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need to Return Something?
          </h2>
          <p className="text-gray-600 mb-6">
            Start your return process or contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/account/orders">Start Return Process</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}