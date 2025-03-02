const express = require('express');
const { RegisterUser, LogginUser, LogoutUser, PasswordChangeRequest, verifyOtpForSignIn, Resend_Otp, getAllUsers, findMe, addWhisList, getWishlist, deleteUser } = require('../controller/User.controller');
const { protect } = require('../middleware/auth');
const { createProduct, getAllProducts, deleteProductById, getProductById, updateProduct, getProductsByCategory, getProductsBySubCategory, search_product_and_filter } = require('../controller/Product.controller');
const multer = require("multer");
const { createOrderOfProduct, ChangeOrderStatus, getAllOrder, getMyLastOrder, checkStatus, getOrderByOrderId, OrderProcessRating, getMyAllOrder, getOrderByOrderIdAdmin, generateOrderReport, getRecentsOrders, deleteOrder } = require('../controller/Order_Controller');
const { addSettings, editSettings, getSettings } = require('../controller/Settings');
const { createHeroPage, getHeroPage } = require('../controller/Hero.controller');
const { createPage, getAllPages, getSinglePage, updatePage, deletePage, createAnnouncements, getAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../controller/Pages.controller');
const { createContact, getAllContacts, updateContact, deleteContact } = require('../controller/Contact.controller');
const { createCoupon, updateCoupon, deleteCoupon, applyCoupon, getAllCoupons } = require('../controller/Coupon.controller');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, addSubcategory, UpdateSubcategory, deleteSubcategory, getSubcategoriesByCategory } = require('../controller/Category.controller');
const { getAbout, createOrUpdateAbout } = require('../controller/aboutController');
const {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
} = require("../controller/testimonialController");

const {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog
} = require("../controller/blogController");
const storage = multer.memoryStorage()

const upload = multer({ storage });

const router = express.Router();

// Register Routes
router.post('/regsiter-user', RegisterUser);
router.post('/verify-otp', verifyOtpForSignIn);
router.post('/resend-otp', Resend_Otp);
router.post('/login', LogginUser);
router.get('/logout', LogoutUser);
router.get('/my-details', protect, findMe);
router.post('/Password-Change-Request', PasswordChangeRequest);
router.post('/add-whishlist', protect, addWhisList);
router.get('/wishlist', protect, getWishlist);
router.get('/my-last-order', protect, getMyLastOrder);
router.get('/my-recent-order/:orderId', protect, getOrderByOrderId);
router.get('/recent-order/:orderId', getOrderByOrderIdAdmin);
router.post('/order-proccessing/:orderid', OrderProcessRating);
router.get('/my-all-order', protect, getMyAllOrder);
router.post('/support-request', createContact);



//Admin reports routes
router.post('/get-reports', generateOrderReport);
router.get('/get-recent-orders', getRecentsOrders);

//Admin annoncements routes
router.post('/annoncement', createAnnouncements);
router.get('/admin/annoncements', getAnnouncements);
router.post('/admin/annoncement/:id', updateAnnouncement);
router.delete('/admin/annoncement/:id', deleteAnnouncement);


//Admin Coupons routes
router.post('/add-coupon', createCoupon);
router.post('/update-coupon/:code', updateCoupon);
router.delete('/delete-coupon/:code', deleteCoupon);
router.post('/apply-coupon', applyCoupon);
router.get('/get-coupon', getAllCoupons);


//Admin support routes
router.get('/admin/support-request/all', getAllContacts);
router.post('/admin/support/:id', updateContact);
router.delete('/admin/support-delete/:id', deleteContact);


//Admin category routes

router.post('/admin/create/category', createCategory);
router.get('/admin/category', getCategories);
router.get('/admin/category/:id', getCategoryById);
router.put('/admin/category/edit/:id', updateCategory);
router.delete('/admin/category-del/:id', deleteCategory)
//Admin sub  category routes
router.post('/admin/create/sub-category/:id', addSubcategory);
router.delete('/admin/sub-category/delete/:id', deleteSubcategory);
router.get('/admin/sub-category/:categoryId', getSubcategoriesByCategory);
router.put('/admin/sub-category/edit/:id', UpdateSubcategory);


//Admin user routes

router.get('/admin/get-users', getAllUsers);
router.post('/admin/change-order-status', ChangeOrderStatus);
router.get('/admin/get-all-order', getAllOrder);
router.delete('/admin/delete/:id', deleteUser);

//Admin Settings routes
router.post('/admin/create_and_update/hero_page', createHeroPage);
router.get('/admin/get/hero_page', getHeroPage);


//Admin pages

router.post('/admin/page', createPage);
router.get('/admin/pages', getAllPages);
router.get('/admin/page/:slug', getSinglePage);
router.put('/admin/page/:slug', updatePage);
router.delete('/admin/page/:slug', deletePage);


//Admin Settings routes

router.post('/admin/create/settings', addSettings);
router.put('/admin/settings/:id', editSettings);
router.get('/admin/settings', getSettings);


// product Routes
router.post('/add-new-product', upload.any(), createProduct);
router.post('/update-product/:productId', upload.any(), updateProduct);
router.get('/get-product', getAllProducts);
router.get('/get-product/by-category', getProductsByCategory);
router.get('/get-product/:id', getProductById);
router.get('/get-product/by-sub-category/:id', getProductsBySubCategory);
router.delete('/delete-product/:id', deleteProductById);

// Order Routes
router.post('/add-order', protect, createOrderOfProduct);
// router.post('/verify-payment/:merchantTransactionId', checkStatus);
router.post('/verify-payment', checkStatus);
router.delete('/admin/delete-order/:id', deleteOrder);

// about Routes
router.get("/get-about", getAbout);
router.post("/create-or-update-about", createOrUpdateAbout);

//testimonial routes

router.post("/testimonial", createTestimonial);
router.get("/testimonial", getAllTestimonials);
router.get("/testimonial/:id", getTestimonialById);
router.put("/testimonial/:id", updateTestimonial);
router.delete("/testimonial/:id", deleteTestimonial);

// Routes for blog
router.post("/blog", createBlog);
router.get("/blog", getAllBlogs);
router.get("/blog/:slug", getBlogBySlug)
router.put("/blog/:id", updateBlog)
router.delete("/blog/:id", deleteBlog)

//search query
router.get("/search_product_and_filter", search_product_and_filter)




module.exports = router;