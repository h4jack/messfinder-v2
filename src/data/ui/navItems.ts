const navForAll = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/messages", label: "Messages" },
    { href: "/dashboard/bookmarks", label: "Bookmarks" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/settings", label: "Settings" },
];

const ownerExtraNav = [
    { href: "/dashboard/pgs", label: "My PGs" },
    { href: "/dashboard/submit-pg", label: "Submit PG" },
];

export const NAV_ITEMS = {
    owner: [
        navForAll[0], // Dashboard
        ...ownerExtraNav,
        ...navForAll.slice(1), // Remaining common items,
    ],
    user: [
        ...navForAll
    ],
};