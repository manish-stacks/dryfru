import { FiMenu, FiSun, FiMoon } from 'react-icons/fi'

export default function Navbar({ toggleSidebar, darkMode, toggleDarkMode }) {
  return (
    <nav className="bg-whit fixed w-full z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-indigo-600 dark:text-indigo-400">Dyfru Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
            </button>
            <div className="relative">
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}