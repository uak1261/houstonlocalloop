'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Building2, School, MapPin, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ZIP code
    if (!/^\d{5}$/.test(zipcode)) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }
    
    // Navigate to ZIP page
    router.push(`/zip/${zipcode}`);
  };

  const handleQuickZip = (zip: string) => {
    router.push(`/zip/${zip}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={28} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Houston Local Loop
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#neighborhoods" className="text-gray-700 hover:text-blue-600 transition-colors">
                Neighborhoods
              </a>
{user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <User size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-900 truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setAuthModalView('signin');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setAuthModalView('signup');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Houston Neighborhood, Connected
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Discover local events, businesses, schools, and civic updates—all by your ZIP code
            </p>

            {/* ZIP Search */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Enter ZIP code (e.g., 77024)"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
                    maxLength={5}
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 font-semibold"
                >
                  Explore
                </button>
              </div>
            </form>

            {/* Popular ZIP Quick Access */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm text-gray-600">Popular:</span>
              {['77024', '77005', '77008', '77019', '77098'].map((zip) => (
                <button
                  key={zip}
                  onClick={() => handleQuickZip(zip)}
                  className="px-4 py-2 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all text-sm font-medium"
                >
                  {zip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything Local, In One Place
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Local Events',
                description: 'Discover farmers markets, festivals, and community gatherings',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Building2,
                title: 'Businesses',
                description: 'Find restaurants, shops, and services in your neighborhood',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: School,
                title: 'School Updates',
                description: 'Stay informed about local school news and events',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: MapPin,
                title: 'Civic Info',
                description: 'Access city council meetings, road closures, and permits',
                color: 'from-orange-500 to-orange-600'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Houston Neighborhoods
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { zip: '77024', name: 'Memorial', desc: '234 events this month' },
              { zip: '77005', name: 'Museum District', desc: '189 events this month' },
              { zip: '77008', name: 'Heights', desc: '312 events this month' },
              { zip: '77019', name: 'River Oaks', desc: '156 events this month' },
              { zip: '77098', name: 'Upper Kirby', desc: '203 events this month' },
              { zip: '77007', name: 'East Downtown', desc: '178 events this month' }
            ].map((neighborhood) => (
              <button
                key={neighborhood.zip}
                onClick={() => handleQuickZip(neighborhood.zip)}
                className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{neighborhood.name}</h3>
                    <p className="text-gray-600 text-sm">ZIP: {neighborhood.zip}</p>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                </div>
                <p className="text-sm text-gray-500">{neighborhood.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Connected to Your Community
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get weekly updates about what's happening in your neighborhood
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-xl text-gray-900 flex-1 max-w-md"
            />
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={24} />
                <span className="font-bold text-lg">Houston Local Loop</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting Houston neighborhoods, one ZIP code at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Events Calendar</li>
                <li>Business Directory</li>
                <li>School Updates</li>
                <li>Civic Information</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Realtors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Sponsor Events</li>
                <li>Community Newsletters</li>
                <li>Local Presence</li>
                <li>Lead Generation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Houston Local Loop. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </div>
  );
}