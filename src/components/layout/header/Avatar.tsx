// components/Avatar.tsx
import type { User } from '@/types/User';

export function Avatar({ user }: { user: User }) {
  return user.avatar ? (
    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}