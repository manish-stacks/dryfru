import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  Heart,
  X,
  ChevronDown,
  LogIn,
  User
} from 'lucide-react';
import logo from './logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { findMarqueee, findMyDetails, findNavs } from '../../utils/Api';
import { fetchWishlist } from '../../store/slice/whishlist';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search_word, setSearchWord] = useState('')
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const { wishlist } = useSelector((state) => state.whishlist);
  const { cart } = useSelector((state) => state.cart);
  const [annoncement, setAnnouncements] = useState([]);
  const dispatch = useDispatch();
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const announce = await findMarqueee();
        const filter = announce.filter((item) => item.status !== false);
        setAnnouncements(filter);
      } catch (error) {
        console.log("err", error);
      }
    }
    fetch();
  }, []);

  const handleSearch = () => {
    if (search_word.length > 2) {

      window.location.href = `/Search-Product?query=${search_word}&price=high&page=1`
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && search_word.length > 2) {
        handleSearch();
      }
    };


    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [search_word]);

  useEffect(() => {
    const tokens = sessionStorage.getItem('token_login') || {};
    setToken(tokens !== null && tokens !== undefined);

    const fetch = async () => {
      const data = await findNavs();
      setNavLinks(data);
    }

    const fetchData = async () => {
      try {
        await findMyDetails();
      } catch (error) {
        setToken(false);
        sessionStorage.removeItem('token_login');
      }
    };

    dispatch(fetchWishlist());
    fetch();
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (id) => {
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileCategory = (id) => {
    setActiveMobileCategory(activeMobileCategory === id ? null : id);
  };

  return (
    <div className={`w-full ${scrolled ? 'fixed top-0 z-[999] transition-all duration-300' : ''}`}>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-2">
          <div className="inline-flex">
            {[...annoncement, ...annoncement, ...annoncement].map((text, index) => (
              <span key={index} className="mx-8 text-white text-sm font-medium">
                {text.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white border ${scrolled ? 'shadow-lg w-full' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} className="h-12 object-fit" alt="Logo" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.sort((a, b) => a.position - b.position).map((link) => (
                <div
                  key={link._id}
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(link._id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={`/Page/details/${link._id}/${link.name.replace(/\s+/g, '-').replace(/%/g, '-')}`}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-all duration-200 py-6 group-hover:transform group-hover:translate-y-[2px]"                  >
                    <span>{link.name.replace(/%/g, '-')}</span>
                    {link.SubCategory.length > 0 && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === link._id ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                  {link.SubCategory.length > 0 && activeDropdown === link._id && (
                    <div className="absolute top-full  left-0 animate-slideDown bg-white border border-gray-100 rounded-lg shadow-lg py-2 w-56 z-[999]">
                      {link.SubCategory.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/Page/details/sub/${sub._id}/${sub.name.replace(/\s+/g, '-').replace(/%/g, '-')}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 hover:translate-x-1"                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/Shop"
                className="text-gray-700 hover:text-green-600 font-medium transition-all duration-200 hover:transform hover:translate-y-[2px]"
              >
                Shop
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>

              {/* <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="h-5 w-5 text-gray-700" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link> */}

              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              {token ? (
                <Link to="/profile/dashboard" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User className="h-5 w-5 text-gray-700" />
                </Link>
              ) : (
                <Link to="/login" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <LogIn className="h-5 w-5 text-gray-700" />
                </Link>
              )}

              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'h-16 opacity-100' : 'h-0 opacity-0'}`}>
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={search_word}
                  name='search_word'
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Search for products... Type at least 3 characters and press Enter"
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-green-200 rounded-full focus:outline-none focus:border-green-500 transition-colors"
                />
                <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          <nav className="overflow-y-auto h-[calc(100vh-5rem)]">
            {navLinks.map((link) => (
              <div key={link._id} className="border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between">
                  {link.SubCategory.length > 0 ? (
                    // If has subcategories, make the entire header a button
                    <button
                      className="flex items-center justify-between w-full py-3 px-4 text-left hover:bg-gray-50 transition-all duration-200"
                      onClick={() => toggleMobileCategory(link._id)}
                    >
                      <span className="font-medium text-gray-700">
                        {link.name.replace(/%/g, '-')}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${activeMobileCategory === link._id ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                  ) : (
                    // If no subcategories, make it a direct link
                    <Link
                      to={`/Page/details/${link._id}/${link.name.replace(/\s+/g, '-').replace(/%/g, '-')}`}
                      className="block w-full py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name.replace(/%/g, '-')}
                    </Link>
                  )}
                </div>

                {/* Subcategories dropdown */}
                {link.SubCategory.length > 0 && activeMobileCategory === link._id && (
                  <div className="bg-gray-50 py-2 animate-slideDown">
                    {link.SubCategory.map((sub, index) => (
                      <Link
                        key={sub._id}
                        to={`/Page/details/sub/${sub._id}/${sub.name.replace(/\s+/g, '-').replace(/%/g, '-')}`}
                        className="block px-8 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          <span>{sub.name}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/Shop"
              className="block py-3 px-4 font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;