// types/user.ts
export type User = {
  name: string;
  email: string;
  avatar?: string | null;
};

// types/nav.ts
export type NavLink = {
  href: string;
  label: string;
};