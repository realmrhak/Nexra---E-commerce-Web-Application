import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { IoIosArrowRoundForward as FwdIcon } from "react-icons/io";
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ProductPickerModal from '../ProductPickerModal';
import ProductModel from '../ProductModel';
import toast from 'react-hot-toast';

/**
 * HomeSlider — the admin-editable "Best Sellers" slider on the home page.
 *
 * - Public users: see the slider with curated products (read-only).
 * - Admins: see a pencil icon on each card (click to swap product) +
 *           an "Add Card" button at the end (pick a product to add).
 *
 * Data comes from /api/home-slides (admin-curated). If no slides exist,
 * we fall back to /api/products/featured so the page is never empty.
 */
const HomeSlider = () => {
    const { isAdmin, isAuthenticated } = useAuth();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpenProductModel, setIsOpenProductModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Admin editing state
    const [pickerOpen, setPickerOpen] = useState(false);
    const [editingSlideId, setEditingSlideId] = useState(null); // null = adding new
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/home-slides');
            let items = res.data.data || [];
            // Fallback: if no slides configured, use featured products
            if (items.length === 0) {
                const featRes = await api.get('/api/products/featured?limit=8');
                items = (featRes.data.data || []).map((p, i) => ({
                    _id: `fallback-${p._id}`,
                    product: p,
                    order: i,
                    isFallback: true,
                }));
            }
            setSlides(items);
        } catch (err) {
            console.warn('HomeSlider load failed:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // ---- Admin: open picker to edit an existing slide ----
    const handleEditSlide = (slide) => {
        if (!isAdmin) return;
        setEditingSlideId(slide._id);
        setPickerOpen(true);
    };

    // ---- Admin: open picker to add a new slide ----
    const handleAddSlide = () => {
        if (!isAdmin) return;
        setEditingSlideId(null);
        setPickerOpen(true);
    };

    // ---- Admin: picker confirmed → create or update slide ----
    const handlePickerSelect = async (productId) => {
        setSaving(true);
        try {
            if (editingSlideId) {
                // Update existing slide
                await api.put(`/api/home-slides/${editingSlideId}`, { product: productId });
                toast.success('Slide updated!');
            } else {
                // Create new slide
                await api.post('/api/home-slides', { product: productId });
                toast.success('New card added to slider!');
            }
            await load();
        } catch (err) {
            toast.error(err?.message || 'Failed to save slide.');
        } finally {
            setSaving(false);
            setEditingSlideId(null);
        }
    };

    // ---- Admin: delete a slide ----
    const handleDeleteSlide = async (slide, e) => {
        e.stopPropagation();
        if (!slide._id || slide.isFallback) {
            toast.error('This is a fallback slide. Add real slides from the admin panel first.');
            return;
        }
        if (!confirm('Remove this card from the home slider? The product itself will NOT be deleted.')) return;
        try {
            await api.delete(`/api/home-slides/${slide._id}`);
            toast.success('Card removed from slider.');
            await load();
        } catch (err) {
            toast.error(err?.message || 'Failed to remove slide.');
        }
    };

    // ---- Product quick-view modal ----
    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setIsOpenProductModel(true);
    };
    const closeProductModal = () => setIsOpenProductModel(false);

    // ---- Add to wishlist ----
    const handleAddToWishlist = async (product) => {
        if (!isAuthenticated) {
            toast.error('Please log in to add items to your wishlist.');
            return;
        }
        try {
            await api.post('/api/users/me/wishlist', { productId: product._id });
            toast.success('Added to wishlist!');
        } catch (err) {
            toast.error(err?.message || 'Could not add to wishlist.');
        }
    };

    return (
        <>
            <div className="d-flex align-items-center">
                <div className="info w-75">
                    <h3 className="mb-0 hd">Best Sellers</h3>
                    <p className="text-light text-sml mb-0">
                        Do not miss the current offers until the end of April.
                    </p>
                </div>
                <Button className="veiwAllBtn ml-auto" href="/shop?sort=popular">
                    View all <FwdIcon />
                </Button>
            </div>

            <div className="product_row w-100 mt-4 position-relative">
                <button className="customSwipPrev" ref={prevRef}>
                    <FaChevronLeft />
                </button>
                <button className="customSwipNext" ref={nextRef}>
                    <FaChevronRight />
                </button>

                {loading ? (
                    <div className="text-center py-5">Loading products…</div>
                ) : slides.length === 0 ? (
                    <div className="text-center py-5 text-muted">No products yet. Check back soon.</div>
                ) : (
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={8}
                        slidesPerGroup={1}
                        modules={[Navigation]}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 },
                        }}
                        className="mySwiper"
                    >
                        {slides.map((slide, idx) => {
                            const p = slide.product;
                            if (!p) return null;

                            const discount = p.oldPrice
                                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                                : null;
                            const img = p.images?.[0]?.url || 'https://placehold.co/300x375/f5f5f5/999999?text=No+Image';
                            const detailHref = p.slug ? `/product/${p.slug}` : `/product/${p._id}`;

                            return (
                                <SwiperSlide key={slide._id || idx}>
                                    <div className={`productItem four`} style={{ position: 'relative' }}>
                                        {/* ---- ADMIN-ONLY: Pencil + Delete icons (shared .adminCardActions style) ---- */}
                                        {isAdmin && (
                                            <div className="adminCardActions">
                                                <button
                                                    className="adminCardBtn edit"
                                                    onClick={() => handleEditSlide(slide)}
                                                    title="Change product in this slot"
                                                    aria-label="Change product in this slot"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    className="adminCardBtn delete"
                                                    onClick={(e) => handleDeleteSlide(slide, e)}
                                                    title="Remove this card from slider"
                                                    aria-label="Remove this card from slider"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        )}
                                        {/* ---- END admin-only ---- */}

                                        <div className="imageWrapper">
                                            <Link to={detailHref}>
                                                <img
                                                    src={img}
                                                    alt={p.name}
                                                    className="w-100"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/300x375/f5f5f5/999999?text=No+Image';
                                                    }}
                                                />
                                            </Link>
                                            {discount && (
                                                <span className="badge badge-primary">-{discount}%</span>
                                            )}
                                            <div className="actions">
                                                <Button onClick={() => viewProductDetails(p)} aria-label="Quick view">
                                                    <TfiFullscreen />
                                                </Button>
                                                <Button onClick={() => handleAddToWishlist(p)} aria-label="Add to wishlist">
                                                    <IoMdHeartEmpty style={{ fontSize: "20px" }} />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="info">
                                            <Link to={detailHref}>
                                                <h4 title={p.name}>{p.name}</h4>
                                            </Link>
                                            <span className={`d-block ${p.stock > 0 ? 'text-success' : 'text-danger'}`}>
                                                {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                            <Rating
                                                className="mt-2 mb-2"
                                                value={Number(p.ratings || 5)}
                                                readOnly
                                                size="small"
                                                precision={0.5}
                                            />
                                            <div className="d-flex align-items-center">
                                                {p.oldPrice && (
                                                    <span className="oldPrice">${Number(p.oldPrice).toFixed(2)}</span>
                                                )}
                                                <span className="netPrice text-danger ml-2">
                                                    ${Number(p.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}

                        {/* ---- ADMIN-ONLY: Add Card slide ---- */}
                        {isAdmin && (
                            <SwiperSlide>
                                <div
                                    onClick={handleAddSlide}
                                    style={{
                                        border: '2px dashed #10B981',
                                        borderRadius: 8,
                                        minHeight: 320,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: '#f0fdf4',
                                        color: '#10B981',
                                        gap: 8,
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#10B981';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f0fdf4';
                                        e.currentTarget.style.color = '#10B981';
                                    }}
                                >
                                    <div style={{
                                        width: 56, height: 56, borderRadius: '50%',
                                        border: '2px solid currentColor',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Plus size={28} />
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>Add Card</span>
                                    <span style={{ fontSize: 11, opacity: 0.8 }}>Pick a product</span>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                )}
            </div>

            {/* ---- Product quick-view modal ---- */}
            {isOpenProductModel && selectedProduct && (
                <ProductModel
                    product={selectedProduct}
                    closeProductModal={closeProductModal}
                />
            )}

            {/* ---- Admin: product picker modal ---- */}
            <ProductPickerModal
                open={pickerOpen}
                onClose={() => {
                    setPickerOpen(false);
                    setEditingSlideId(null);
                }}
                onSelect={handlePickerSelect}
                title={editingSlideId ? 'Change product in this slot' : 'Pick a product for the new card'}
                excludeIds={editingSlideId ? [] : slides.filter(s => !s.isFallback).map(s => s.product?._id).filter(Boolean)}
                currentId={editingSlideId ? slides.find(s => s._id === editingSlideId)?.product?._id : null}
            />
        </>
    );
};

export default HomeSlider;
