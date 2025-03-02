import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import ProductPage from './pages/ProductPage/ProductPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import Shop from './pages/shop/Shop';
import Otp from './pages/Otp/Otp';
import Cart from './pages/Cart/Cart';
import CheckOut from './pages/Cart/CheckOut';
import ReceiptComponent from './pages/Cart/Receipt';
import Dashboard from './User_Dashboard/Dashboard';
import { useEffect } from 'react';
import Policy from './pages/Policy/Policy';
import Support from './pages/Support/Support';
import Category_page from './pages/Category_page/Category_page';
import BottomNavigation from './components/Header/BottomNavigation';
import Product_sub from './pages/Category_page/Product_Sub';
import Whatsapp from './components/Whatsapp/Whatsapp';
import BlogDetails from './pages/Blogs/BlogDetails';
import SearchProduct from './pages/SearchProduct/SearchProduct';

function App() {

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [window.location.pathname]);
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/productpage/:_id' element={<ProductPage />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/Verify-Otp' element={<Otp />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/procced-to-checkout' element={<CheckOut />} />
        <Route path='/Receipt/order-confirmed' element={<ReceiptComponent />} />
        <Route path='/pages/:page' element={<Policy />} />
        <Route path='/support' element={<Support />} />
        <Route path='/profile/dashboard' element={<Dashboard />} />
        <Route path='/Page/details/:id/:category' element={<Category_page />} />
        <Route path='/Page/details/sub/:id/:category' element={<Product_sub />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgetpassword' element={<ForgetPassword />} />
        <Route path='/blog/:slug' element={<BlogDetails />} />
        <Route path='/Search-Product' element={<SearchProduct />} />
      </Routes>
      <Whatsapp/>
      {/* <BottomNavigation /> */}
    </>
  );
}
export default App;