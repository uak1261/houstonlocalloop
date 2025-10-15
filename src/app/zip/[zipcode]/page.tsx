import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Building2, School, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: { zipcode: string };
}

interface Neighborhood {
  zipcode: string;
  city: string;
  neighborhood: string | null;
  active_events: number;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_datetime: string;
  venue_name: string | null;
  category: string | null;
}

async function getZipData(zipcode: string): Promise<Neighborhood | null> {
  const { data, error } = await supabase
    .from('zipcodes')
    .select('*')
    .eq('zipcode', zipcode)
    .single();
  
  if (error) {
    console.error('Error fetching ZIP data:', error);
    return null;
  }
  
  return data;
}

async function getEvents(zipcode: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('zipcode', zipcode)
    .gte('start_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data || [];
}

export default async function ZipPage({ params }: PageProps) {
  const { zipcode } = params;
  
  // Validate ZIP code format
  if (!/^\d{5}$/.test(zipcode)) {
    notFound();
  }

  // Fetch data from Supabase
  const [zipData, events] = await Promise.all([
    getZipData(zipcode),
    getEvents(zipcode),
  ]);

  // If ZIP code not found in database, show 404
  if (!zipData) {
    notFound();
  }

  const neighborhood = zipData.neighborhood || `ZIP ${zipcode}`;
  const city = zipData.city || 'Houston';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              ZIP Code: {zipcode}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {neighborhood}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {city}, Texas
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{events.length} upcoming events</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <span>Coming soon</span>
              </div>
              <div className="flex items-center gap-2">
                <School size={18} />
                <span>Coming soon</span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              <Bell size={20} />
              Subscribe to Updates
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Banner - Data is Connected! */}
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Live Data Connected!
              </h3>
              <p className="text-green-800 text-sm">
                You're now seeing real events from our database for {neighborhood}. More features like businesses and school updates coming soon!
              </p>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            {events.length > 0 && (
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All →
              </button>
            )}
          </div>
          
          {events.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-gray-200">
              <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Upcoming Events
              </h3>
              <p className="text-gray-600">
                Check back soon for new events in {neighborhood}!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const eventDate = new Date(event.start_datetime);
                
                return (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {event.category && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {event.category}
                            </span>
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-gray-600 mb-4">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{eventDate.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🕐</span>
                            <span>{eventDate.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}</span>
                          </div>
                          {event.venue_name && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{event.venue_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                        Learn More
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all">
            <Building2 className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-bold mb-2">Local Businesses</h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover restaurants, shops, and services in your area
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-500 transition-all">
            <School className="text-pink-600 mb-3" size={32} />
            <h3 className="text-lg font-bold mb-2">School Updates</h3>
            <p className="text-gray-600 text-sm mb-4">
              Stay informed about local schools and educational events
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all">
            <MapPin className="text-orange-600 mb-3" size={32} />
            <h3 className="text-lg font-bold mb-2">Civic Information</h3>
            <p className="text-gray-600 text-sm mb-4">
              Access city council updates, permits, and public notices
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
