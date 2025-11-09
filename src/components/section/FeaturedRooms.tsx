// app/components/RoomCard.tsx
'use client';

import Image, { StaticImageData } from 'next/image';
import { MapPin, Phone, User, Calendar, Share2, UserX } from 'lucide-react';

// Import your images
import room1 from '@/assets/rooms/room1.png';
import room2 from '@/assets/rooms/room2.png';
import room3 from '@/assets/rooms/room3.png';

type SuitableFor =
  | 'students'
  | 'working professionals'
  | 'paying guests'
  | 'temporary stay';

export interface RoomCardProps {
  name: string;
  location: string;
  price?: string; // optional → show "Call to know"
  owner: string;
  postedDate: string; // e.g. "2 days ago"
  shared: boolean;
  suitableFor: SuitableFor[];
  image: StaticImageData;
}

const suitableLabels: Record<SuitableFor, string> = {
  students: 'Students',
  'working professionals': 'Working Professionals',
  'paying guests': 'Paying Guests',
  'temporary stay': 'Temporary Stay',
};

export function RoomCard({
  name,
  location,
  price,
  owner,
  postedDate,
  shared,
  suitableFor,
  image,
}: RoomCardProps) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image + Price Badge */}
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
        />

        {/* Price or Call Badge */}
        <div className="absolute top-3 right-3">
          {price ? (
            <div className="bg-green-100/95 backdrop-blur-sm text-gray-700 font-bold text-lg px-4 py-2 rounded-full shadow-lg border border-gray-300">
              {price}/<span className="text-sm font-medium">mo</span>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              Call to Know
            </div>
          )}
        </div>

        {/* Shared/Private Tag */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1 ${
              shared ? 'bg-emerald-600' : 'bg-indigo-600'
            }`}
          >
            {shared ? <Share2 className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
            {shared ? 'Shared' : 'Private'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Location */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-100 text-lg line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1.5 text-gray-300 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            <span className="opacity-80">{location}</span>
          </div>
        </div>

        {/* Middle Info - Compact */}
        <div className="space-y-2 text-sm text-gray-200 mb-4">
          <div className="flex justify-between">
            <span>Owner</span>
            <span className="font-medium text-blue-100">{owner}</span>
          </div>
          <div className="flex justify-between">
            <span>Posted</span>
            <span className="text-gray-100">{postedDate}</span>
          </div>
        </div>

        {/* Suitable For Tags */}
        <div className="flex flex-wrap gap-1.5">
          {suitableFor.slice(0, 3).map((type) => (
            <span
              key={type}
              className="px-2.5 py-1 bg-gray-700 text-white text-xs rounded-full border border-gray-300"
            >
              {suitableLabels[type]}
            </span>
          ))}
          {suitableFor.length > 3 && (
            <span className="text-xs text-gray-500">+{suitableFor.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Featured Rooms
export default function FeaturedRooms() {
  const rooms: RoomCardProps[] = [
    {
      name: 'Cozy Room in Bandra',
      location: 'Bandra West, Mumbai',
      price: '₹8,500',
      owner: 'Rahul Sharma',
      postedDate: '2 days ago',
      shared: true,
      suitableFor: ['students', 'working professionals', 'paying guests'],
      image: room1,
    },
    {
      name: 'Premium Studio Andheri',
      location: 'Andheri East',
      price: undefined, // → shows "Call to Know"
      owner: 'Priya Mehta',
      postedDate: '1 week ago',
      shared: false,
      suitableFor: ['working professionals', 'temporary stay'],
      image: room2,
    },
    {
      name: 'Girls PG Kharghar',
      location: 'Kharghar, Navi Mumbai',
      price: '₹6,000',
      owner: 'Anita Desai',
      postedDate: '3 days ago',
      shared: true,
      suitableFor: ['students', 'paying guests'],
      image: room3,
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-900 text-center mb-10">
          Featured Rooms
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room, i) => (
            <RoomCard key={i} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
}