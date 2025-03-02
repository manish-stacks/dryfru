import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardPage from './Pages/Dashboard/DashboardPage';
import CreateProduct from './Pages/Product/CreateProduct';
import Products from './Pages/Product/Products';
import EditProduct from './Pages/Product/EditProduct';
import AllUsers from './Pages/Users/AllUsers';
import Manage_Order from './Pages/Orders/Manage_Order';
import ViewOrder from './Pages/Orders/ViewOrder';
import Settings from './Pages/settings/Settings';
import Hero from './Pages/Hero/Hero';
import Pages from './Pages/Dynamic_Pages/Pages';
import Support from './Pages/Support/Support';
import Reports from './Pages/Reports/Reports';
import Announcements from './components/Announcements/Announcements';
import Coupon from './Pages/Coupons/Coupon';
import Categories from './Pages/Categories/Categories';
import ProtectedRoute from './context/ProtectedRoute';
import EditAboutUs from './Pages/About/EditAboutUs';
import TestimonialCreate from './Pages/Testimonial/TestimonialCreate';
import TestimonialGet from './Pages/Testimonial/TestimonialGet';
import CreateBlogs from './Pages/Blogs/CreateBlogs';
import Blogs from './Pages/Blogs/Blogs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products/manage" element={<Products />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="orders" element={<Manage_Order />} />
            <Route path="order/:id" element={<ViewOrder />} />
            <Route path="settings" element={<Settings />} />
            <Route path="hero-section" element={<Hero />} />
            <Route path="pages/:page" element={<Pages />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="categories" element={<Categories />} />
            <Route path="coupons" element={<Coupon />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
            <Route path="Blogs/create" element={<CreateBlogs />} />
            <Route path="Blogs/manage" element={<Blogs />} />
            <Route path="Abouts/Edit" element={<EditAboutUs />} />
            <Route path="Testimonial/create" element={<TestimonialCreate />} />
            <Route path="Testimonial/manage" element={<TestimonialGet />} />
          </Route>
        </Route>

        {/* Redirect unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
