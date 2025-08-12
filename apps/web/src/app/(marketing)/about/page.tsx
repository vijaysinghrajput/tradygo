import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Target, Award, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@tradygo/ui';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'About Us',
  description: 'Learn about TradyGo\'s mission to connect buyers with trusted sellers across India. Discover our story, values, and commitment to quality e-commerce.',
  canonical: '/about',
});

const stats = [
  { label: 'Active Sellers', value: '10,000+', icon: Users },
  { label: 'Products Listed', value: '1M+', icon: Target },
  { label: 'Happy Customers', value: '500K+', icon: Heart },
  { label: 'Cities Served', value: '100+', icon: Award },
];

const values = [
  {
    title: 'Trust & Transparency',
    description: 'We verify every seller and ensure transparent pricing with no hidden fees.',
    icon: '🛡️',
  },
  {
    title: 'Quality Assurance',
    description: 'Every product goes through our quality checks before reaching customers.',
    icon: '✨',
  },
  {
    title: 'Customer First',
    description: 'Our customers are at the heart of everything we do, from product selection to support.',
    icon: '❤️',
  },
  {
    title: 'Innovation',
    description: 'We continuously innovate to provide the best shopping experience.',
    icon: '🚀',
  },
];

const team = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO & Founder',
    bio: 'Former e-commerce executive with 15+ years of experience building marketplaces.',
    image: '/images/team/rajesh.jpg',
  },
  {
    name: 'Priya Sharma',
    role: 'CTO',
    bio: 'Technology leader passionate about building scalable platforms for millions of users.',
    image: '/images/team/priya.jpg',
  },
  {
    name: 'Amit Patel',
    role: 'Head of Operations',
    bio: 'Supply chain expert ensuring smooth operations across India.',
    image: '/images/team/amit.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Building India's Most
              <span className="text-primary block">Trusted Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              TradyGo connects millions of customers with thousands of verified sellers, 
              creating a trusted ecosystem for quality products and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Selling
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-xl text-gray-600">
                From a small startup to India's fastest-growing marketplace
              </p>
            </div>
            
            <div className="prose prose-lg mx-auto">
              <p>
                Founded in 2020, TradyGo began with a simple mission: to create a marketplace 
                where quality products meet trusted sellers. We saw the challenges faced by both 
                buyers and sellers in the Indian e-commerce landscape and decided to build a 
                platform that addresses these pain points.
              </p>
              
              <p>
                Today, we're proud to serve over 500,000 customers across 100+ cities, working 
                with more than 10,000 verified sellers. Our platform hosts over 1 million 
                products across diverse categories, from electronics to fashion, home goods to books.
              </p>
              
              <p>
                What sets us apart is our commitment to trust and quality. Every seller goes 
                through our rigorous verification process, and every product is backed by our 
                quality guarantee. We believe that e-commerce should be simple, safe, and 
                satisfying for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind TradyGo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-center mb-3">{member.role}</p>
                <p className="text-gray-600 text-center text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a buyer or seller, we'd love to have you as part of the TradyGo family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/register">Start Selling Today</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}