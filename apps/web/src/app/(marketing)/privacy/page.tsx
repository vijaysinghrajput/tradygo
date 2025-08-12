import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Eye, Lock, Users } from 'lucide-react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy',
  description: 'Learn how TradyGo protects your privacy and handles your personal data. Read our comprehensive privacy policy and data protection practices.',
  canonical: '/privacy',
  noIndex: true, // Legal pages typically not indexed
});

const privacyHighlights = [
  {
    icon: Shield,
    title: 'Data Protection',
    description: 'We use industry-standard encryption to protect your personal information.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'We clearly explain what data we collect and how we use it.',
  },
  {
    icon: Lock,
    title: 'Secure Storage',
    description: 'Your data is stored securely and accessed only when necessary.',
  },
  {
    icon: Users,
    title: 'Your Control',
    description: 'You have full control over your data and can request deletion anytime.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your privacy is important to us
          </p>
          <p className="text-gray-500">
            Last updated: January 1, 2024
          </p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {privacyHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Name, email address, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Account preferences and settings</li>
                <li>Communications with our customer service team</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you use our services, we automatically collect certain information about your device and usage:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>IP address and device identifiers</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website or application</li>
                <li>Location information (with your permission)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer service and support</li>
                <li>Send you important updates about your orders and account</li>
                <li>Improve our products and services</li>
                <li>Personalize your shopping experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We work with trusted third-party service providers who help us operate our business, such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Payment processors</li>
                <li>Shipping and logistics partners</li>
                <li>Cloud hosting providers</li>
                <li>Customer service platforms</li>
                <li>Analytics and marketing tools</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose your information if required by law or in response to valid legal requests from government authorities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have several rights regarding your personal information:
              </p>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">Access and Correction</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can access and update your account information at any time through your account settings.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">Data Deletion</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can request deletion of your account and personal data by contacting our support team.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">Marketing Communications</h3>
              <p className="text-gray-700 leading-relaxed">
                You can opt out of marketing emails by clicking the unsubscribe link in any email or updating your preferences in your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For more information about our use of cookies, please see our{' '}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers are conducted in accordance with applicable data protection laws and with appropriate safeguards in place.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Data Protection Officer</strong><br />
                  TradyGo Technologies Pvt. Ltd.<br />
                  Email: privacy@tradygo.com<br />
                  Phone: 1800-123-TRADY (87239)<br />
                  Address: Mumbai, Maharashtra, India
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-500">
                Your privacy is protected by this policy.
              </p>
              <div className="flex space-x-4 text-sm">
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}