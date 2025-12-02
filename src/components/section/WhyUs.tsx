// components/WhyChooseUs.tsx
import { Shield, Camera, Clock, MessageCircle } from 'lucide-react';

export default function WhyChooseUs() {
  const perks = [
    { icon: Shield, title: 'Verified Owners', desc: 'Background checked hosts' },
    { icon: Camera, title: 'Real Photos', desc: 'No fake images' },
    { icon: Clock, title: 'Instant Move-in', desc: 'Ready rooms today' },
    { icon: MessageCircle, title: 'Direct Chat', desc: 'Talk to owner instantly' },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {perks.map((perk) => (
            <div key={perk.title} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <perk.icon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">{perk.title}</h3>
              <p className="text-gray-600">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}