// components/Testimonials.tsx
export default function Testimonials() {
  return (
    <section className="py-16 bg-teal-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {['Rohan', 'Priya', 'Aman'].map((name) => (
            <div key={name} className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 italic mb-4">
                "Found a perfect PG in 2 days! No brokerage, direct owner contact. Best app!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="text-sm text-gray-500">Student, Mumbai</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}