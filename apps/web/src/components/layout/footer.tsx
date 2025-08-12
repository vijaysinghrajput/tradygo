'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button, Input } from '@tradygo/ui';
import { footerNavigation } from '@/config/navigation';
import { useState } from 'react';

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/tradygo', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/tradygo', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/tradygo', icon: Instagram },
  { name: 'YouTube', href: 'https://youtube.com/tradygo', icon: Youtube },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">TradyGo</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted marketplace for quality products from verified sellers across India. Shop with confidence and enjoy fast, secure delivery.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer Navigation Columns */}
          {Object.entries(footerNavigation).map(([key, section]) => (
             <div key={key}>
               <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
               <ul className="space-y-3">
                 {section.items.map((item) => (
                   <li key={item.id}>
                     <Link
                       href={item.href}
                       className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2"
                     >
                       {item.icon && <item.icon className="h-4 w-4" />}
                       <span>{item.label}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Stay in the Loop</h3>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special offers.
              </p>
            </div>
            <div>
              {isSubscribed ? (
                <div className="flex items-center space-x-2 text-green-400">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm font-medium">Thank you for subscribing! Check your email for confirmation.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-6"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Email Support</p>
                <p className="text-sm">support@tradygo.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Customer Care</p>
                <p className="text-sm">1800-123-TRADY (87239)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Headquarters</p>
                <p className="text-sm">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>&copy; {currentYear} TradyGo Technologies Pvt. Ltd. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}