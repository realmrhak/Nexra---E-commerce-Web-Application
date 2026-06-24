import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HomeBanner from "../../Components/HomeBanner";
import BannerBox from "../../Assets/Images/Banners/Vertical-Banner-02.jpg";
import BannerBox1 from "../../Assets/Images/Banners/Vertical-Banner-03.jpg";
import BannerBox2 from "../../Assets/Images/Banners/Horizontal-Banner-02.png";
import newsLetterImg from '../../Assets/Images/News_Letter.webp';
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCategory";
import HomeSlider from "../../Components/HomeSlider";
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMailOutline } from 'react-icons/io5';
import ProductModel from "../../Components/ProductModel";
import api from "../../api/axios";
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const Home = () => {
    const { isAdmin } = useAuth();
    const [isOpenProductModel, setIsOpenProductModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const newRes = await api.get('/api/products/new-arrivals?limit=8');
            setNewProducts(newRes.data.data || []);
        } catch (err) {
            console.warn('Failed to load home products:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setIsOpenProductModel(true);
    };

    const closeProductModal = () => setIsOpenProductModel(false);

    // When admin deletes a product from the New Products section, remove it from state
    const handleDeleteFromNew = (deletedId) => {
        setNewProducts((prev) => prev.filter((p) => p._id !== deletedId));
    };

    const handleNewsletter = (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value.trim();
        if (!email) {
            toast.error('Please enter your email.');
            return;
        }
        toast.success('Subscribed! Check your inbox for the $20 coupon.');
        e.target.reset();
    };

    return (
        <>
            <HomeBanner />
            <HomeCat />

            <section className="homeProducts w-100">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src={BannerBox} alt="Promo banner" className="cursor" loading="lazy" />
                                </div>
                                <div className="banner mt-5">
                                    <img src={BannerBox1} alt="Promo banner" className="cursor" loading="lazy" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 productRow">
                            {/* ===== Best Sellers — admin-editable via HomeSlider ===== */}
                            <HomeSlider />

                            {/* ===== New Products ===== */}
                            <div className="d-flex align-items-center mt-5 flex-wrap" style={{ gap: 8 }}>
                                <div className="info" style={{ flex: 1, minWidth: 200 }}>
                                    <h3 className="mb-0 hd">New Products</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>
                                <Button className="veiwAllBtn" href="/shop?sort=newest&isNew=true">
                                    View all <IoIosArrowRoundForward />
                                </Button>
                                {/* ===== ADMIN-ONLY: Add Product button ===== */}
                                {isAdmin && (
                                    <Link to="/admin/products/new" className="adminAddCardBtn">
                                        <Plus size={16} /> Add Product
                                    </Link>
                                )}
                            </div>

                            <div className="product_row productRow2 w-100 mt-4 d-flex flex-wrap">
                                {loading ? (
                                    <div className="w-100 text-center py-4">Loading…</div>
                                ) : newProducts.length === 0 ? (
                                    <div className="w-100 text-center py-4 text-muted">No new products.</div>
                                ) : (
                                    newProducts.map((product) => (
                                        <ProductItem
                                            key={product._id}
                                            itemView="four"
                                            product={product}
                                            viewProductDetails={viewProductDetails}
                                            onDelete={handleDeleteFromNew}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="Horizontal-Banner">
                <div className="banner mt-4">
                    <img src={BannerBox2} alt="Promo banner" className="cursor" loading="lazy" />
                </div>
            </section>

            <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-light">Join our email subscription now to get updates on <br /> promotions and coupons.</p>

                            <form className="d-flex align-items-center" onSubmit={handleNewsletter}>
                                <IoMailOutline />
                                <input type="email" placeholder="Your Email Address" required />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <img src={newsLetterImg} alt="Newsletter signup" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {isOpenProductModel && (
                <ProductModel
                    product={selectedProduct}
                    closeProductModal={closeProductModal}
                />
            )}
        </>
    );
};

export default Home;
