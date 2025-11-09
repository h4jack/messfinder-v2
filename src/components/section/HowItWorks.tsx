// components/HowItWorks.tsx
import { Search, MessageCircle, Home, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Search Your Room',
      desc: 'Enter your preferred area, budget & type (PG, flatmate, private room)',
      color: 'text-teal-600',
      bg: 'bg-teal-100',
    },
    {
      icon: MessageCircle,
      title: 'Connect with Owner',
      desc: 'Chat directly or call the owner — no middleman, no brokerage',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Home,
      title: 'Visit & Verify',
      desc: 'Schedule a visit, see real photos & verified amenities in person',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      icon: CheckCircle,
      title: 'Move In Happily',
      desc: 'Pay token, sign agreement & move in on your chosen date',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Find your perfect PG or room in just 4 simple steps
          </p>
        </div>

        {/* Desktop: Horizontal Flow with Line */}
        <div className="hidden md:flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-teal-200 via-blue-200 to-green-200 -translate-y-1/2 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-20 h-20 ${step.bg} rounded-full flex items-center justify-center mb-4 shadow-lg`}
              >
                <step.icon className={`w-10 h-10 ${step.color}`} />
              </div>
              <div className="text-center max-w-xs">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-800">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Cards */}
        <div className="md:hidden grid gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-2xl shadow-sm"
            >
              <div
                className={`w-16 h-16 ${step.bg} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
              >
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-800">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}