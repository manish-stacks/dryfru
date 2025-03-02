import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  PercentDiamond,
  Image,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Plus,
  Layers,
  LucideNotebookPen,
  PackageCheck,
  PackageOpenIcon
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, onLogout }) => {
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/'
    },
    {
      title: 'Products',
      icon: Package,
      submenu: [
        { title: 'Create Product', path: '/products/create', icon: Plus },
        { title: 'Manage Products', path: '/products/manage', icon: Layers }
      ]
    },
    {
      title: 'Categories',
      icon: PackageOpenIcon,
      path: '/Categories'
    },
    {
      title: 'Testimonial',
      icon: Image,
      submenu: [
        { title: 'Create Testimonial', path: '/Testimonial/create', icon: Plus },
        { title: 'Manage Testimonial', path: '/Testimonial/manage', icon: Layers }
      ]
    },
    {
      title: 'Blogs',
      icon: LucideNotebookPen,
      submenu: [
        { title: 'Create Blog', path: '/Blogs/create', icon: Plus },
        { title: 'Manage Blog', path: '/Blogs/manage', icon: Layers }
      ]
    },
    {
      title: 'Users',
      icon: Users,
      path: '/users'
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/orders'
    },
    {
      title: 'Reports',
      icon: BarChart3,
      path: '/reports'
    },
    {
      title: 'Pages',
      icon: FileText,
      submenu: [
        { title: 'Privacy Policy', path: '/pages/Privacy-Policy' },
        { title: 'Return & Refund', path: '/pages/Return-Refund' },
        { title: 'Terms & Conditions', path: '/pages/Term-And-Conditions' },
        { title: 'Shipping Policy', path: '/pages/shipping-policy' },
        { title: 'About Us', path: '/Abouts/Edit' }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings'
    },
    {
      title: 'Announcements',
      icon: Bell,
      path: '/Announcements'
    },
    {
      title: 'Coupons',
      icon: PercentDiamond,
      path: '/Coupons'
    },
    {
      title: 'Support',
      icon: HelpCircle,
      path: '/support'
    }
  ];

  const toggleMenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;

    if (item.submenu) {
      return (
        <div key={item.title} className="relative">
          <button
            onClick={() => toggleMenu(item.title)}
            className={`w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${isSidebarOpen ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50'}
              text-gray-700 dark:text-gray-200`}
          >
            <div className="flex items-center">
              <Icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
              {isSidebarOpen && <span>{item.title}</span>}
            </div>
            {isSidebarOpen && (
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedMenus[item.title] ? 'rotate-180' : ''}`} />
            )}
          </button>
          {expandedMenus[item.title] && isSidebarOpen && (
            <div className="pl-10 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <NavLink
                  key={subItem.path}
                  to={subItem.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                    ${isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                  }
                >
                  {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                  <span>{subItem.title}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
          ${isActive
            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
        }
      >
        <Icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
        {isSidebarOpen && <span>{item.title}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] ${isSidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {menuItems.map(renderMenuItem)}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
          >
            <LogOut className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;