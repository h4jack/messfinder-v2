// components/PopularLocalities.tsx
export default function PopularLocalities() {
  const areas = ['Bandra', 'Andheri East', 'Kharghar', 'Powai', 'Malad', 'Vile Parle'];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Popular Localities in Mumbai
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {areas.map((area) => (
            <div
              key={area}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center cursor-pointer border border-gray-200"
            >
              <p className="font-semibold text-gray-800">{area}</p>
              <p className="text-sm text-gray-500">120+ listings</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}