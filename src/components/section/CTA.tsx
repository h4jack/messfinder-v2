// components/CTA.tsx
export default function CTA() {
  return (
    <section className="py-16 bg-teal-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Find Your Room?
        </h2>
        <p className="text-xl text-teal-50 mb-8">
          Join 50,000+ happy tenants who found their home with us.
        </p>
        <button className="bg-white text-teal-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition">
          Browse All Listings
        </button>
      </div>
    </section>
  );
}