import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User, ShoppingBasketIcon } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart' },
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBasketIcon, label: 'Shop', path: '/wishlist' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-[-1px] left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <nav className="flex justify-around items-center h-16 px-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 py-1
              transition-colors duration-200
              ${isActive 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-green-600'
              }
            `}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="h-safe-area bg-white" />
    </div>
  );
};

export default BottomNavigation;