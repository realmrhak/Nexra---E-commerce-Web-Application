import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductZoom from '../../Components/ProductZoom';
import QuantityBox from '../../Components/QuantityBox';
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import { BsCartFill } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import RelatedProducts from './RelatedProducts';
import RecentlyViewedProduct from './RecentlyViewedProduct';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Productdetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSize, setActiveSize] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);
    const [qty, setQty] = useState(1);

    // Review form state
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', name: '', email: '' });

    const loadProduct = useCallback(async () => {
        setLoading(true);
        try {
            // Try slug first, then id
            let res;
            try {
                res = await api.get(`/api/products/slug/${id}`);
            } catch {
                res = await api.get(`/api/products/${id}`);
            }
            const p = res.data.data;
            setProduct(p);

            // Related
            try {
                const relRes = await api.get(`/api/products/${p._id}/related`);
                setRelated(relRes.data.data || []);
            } catch {
                setRelated([]);
            }

            // Persist "recently viewed" in localStorage
            try {
                const key = 'nexra_recent';
                const list = JSON.parse(localStorage.getItem(key) || '[]');
                const filtered = list.filter((it) => it._id !== p._id);
                const next = [
                    {
                        _id: p._id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        images: p.images?.slice(0, 1),
                        ratings: p.ratings,
                    },
                    ...filtered,
                ].slice(0, 6);
                localStorage.setItem(key, JSON.stringify(next));
            } catch {
                // ignore
            }
        } catch (err) {
            toast.error(err?.message || 'Could not load product.');
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
    }, [loadProduct]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please log in to add items to your cart.');
            return;
        }
        if (product.sizes?.length && activeSize === null) {
            toast.error('Please select a size.');
            return;
        }
        try {
            await addToCart(
                product._id,
                qty,
                activeSize !== null ? product.sizes[activeSize] : '',
                ''
            );
        } catch (err) {
            toast.error(err?.message || 'Failed to add to cart.');
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            toast.error('Please log in to use wishlist.');
            return;
        }
        try {
            await api.post('/api/users/me/wishlist', { productId: product._id });
            toast.success('Added to wishlist!');
        } catch (err) {
            toast.error(err?.message || 'Could not add to wishlist.');
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please log in to write a review.');
            return;
        }
        try {
            await api.post(`/api/products/${product._id}/reviews`, {
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });
            toast.success('Review submitted!');
            setReviewForm({ rating: 5, comment: '', name: '', email: '' });
            loadProduct();
        } catch (err) {
            toast.error(err?.message || 'Could not submit review.');
        }
    };

    if (loading) {
        return (
            <section className="ProductDetails section">
                <div className="container">
                    <div className="text-center py-5">Loading product…</div>
                </div>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="ProductDetails section">
                <div className="container">
                    <div className="text-center py-5">
                        <h2>Product not found</h2>
                        <Link to="/shop" className="btn-green btn mt-3">Back to shop</Link>
                    </div>
                </div>
            </section>
        );
    }

    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : null;

    return (
        <section className="ProductDetails section">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 pl-5">
                        <ProductZoom images={product.images} />
                    </div>
                    <div className="col-md-7 pl-5">
                        <h2 className="hd text-capitalize">{product.name}</h2>
                        <ul className="list list-inline d-flex align-items-center">
                            <li className="list-inline-items">
                                <div className="d-flex align-items-center">
                                    <span className="text-light mr-2">Brands: </span>
                                    <span className='mr-4'>{product.brand || 'Generic'}</span>
                                </div>
                            </li>
                            <li className="list-inline-items">
                                <div className="d-flex align-items-center">
                                    <Rating
                                        className='mt-1'
                                        name='read-only'
                                        value={Number(product.ratings || 0)}
                                        readOnly
                                        size="small"
                                        precision={0.5}
                                    />
                                    <span className='text-light cursor ml-2'>
                                        {product.numReviews || 0} Reviews
                                    </span>
                                </div>
                            </li>
                        </ul>

                        <div className="d-fex info mb-3">
                            {product.oldPrice && (
                                <span className="oldPrice">${Number(product.oldPrice).toFixed(2)}</span>
                            )}
                            <span className="netPrice text-danger ml-2">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            {discount && (
                                <span className="ml-2 text-success">Save {discount}%</span>
                            )}
                        </div>

                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {product.stock > 0 ? `IN STOCK (${product.stock})` : 'OUT OF STOCK'}
                        </span>

                        <p className='mt-3'>{product.description || 'No description available.'}</p>

                        {product.sizes?.length > 0 && (
                            <div className="productSize d-flex align-items-center">
                                <span>Size:</span>
                                <ul className="list list-inline mb-0 pl-4">
                                    {product.sizes.map((size, i) => (
                                        <li className="list-inline-item" key={size}>
                                            <a
                                                className={`tag ${activeSize === i ? 'active' : ''}`}
                                                onClick={() => setActiveSize(i)}
                                            >
                                                {size}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="d-flex align-items-center mt-4">
                            <QuantityBox
                                value={qty}
                                onChange={setQty}
                                max={Math.max(1, product.stock || 1)}
                            />
                            <Button
                                className='btn-green btn-lg btn-big btn-round ml-3'
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                <BsCartFill /> &nbsp; Add To Cart
                            </Button>
                            <Tooltip title='Add To Wishlist' placement='top'>
                                <Button
                                    className='btn-green btn-lg btn-circle ml-4'
                                    onClick={handleAddToWishlist}
                                >
                                    <FaRegHeart />
                                </Button>
                            </Tooltip>
                            <Tooltip title='Add To Compare' placement='top'>
                                <Button className='btn-green btn-lg btn-circle ml-2'>
                                    <IoShuffleOutline />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <br />

                <div className="card mt-5 p-5 detalsPageTabs">
                    <div className="customTabs">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <button
                                    className={activeTabs === 0 ? "active" : ""}
                                    onClick={() => setActiveTabs(0)}
                                >
                                    Description
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <button
                                    className={activeTabs === 1 ? "active" : ""}
                                    onClick={() => setActiveTabs(1)}
                                >
                                    Additional Info
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <button
                                    className={activeTabs === 2 ? "active" : ""}
                                    onClick={() => setActiveTabs(2)}
                                >
                                    Reviews ({product.reviews?.length || 0})
                                </button>
                            </li>
                        </ul>

                        {activeTabs === 0 && (
                            <div className="tabContent">
                                <p>{product.description || 'No description available.'}</p>
                            </div>
                        )}

                        {activeTabs === 1 && (
                            <div className="tabContent">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Size</th>
                                            <td>{product.sizes?.join(', ') || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Color</th>
                                            <td>{product.colors?.join(', ') || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Brand</th>
                                            <td>{product.brand || 'Generic'}</td>
                                        </tr>
                                        <tr>
                                            <th>Category</th>
                                            <td>{product.category?.name || 'General'}</td>
                                        </tr>
                                        <tr>
                                            <th>Tags</th>
                                            <td>{product.tags?.join(', ') || '—'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTabs === 2 && (
                            <div className="tabContent">
                                <div className="row">
                                    <div className="col-md-8 mt-3">
                                        <h5>Customer questions & answers</h5>

                                        {product.reviews?.length === 0 && (
                                            <p className="text-muted">No reviews yet. Be the first!</p>
                                        )}

                                        {product.reviews?.map((review, index) => (
                                            <div className="reviewsCard" key={index}>
                                                <div className="reviewLeft">
                                                    <img
                                                        src={`https://i.pravatar.cc/100?u=${review.user}`}
                                                        alt={review.name}
                                                    />
                                                </div>
                                                <div className="reviewRight">
                                                    <div className="reviewTop">
                                                        <h6>{review.name}</h6>
                                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        <Rating value={review.rating} readOnly size="small" />
                                                    </div>
                                                    <p>{review.comment}</p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="reviewForm mt-4">
                                            <h4>Add a review</h4>
                                            <form onSubmit={submitReview}>
                                                <div className="mb-2">
                                                    <Rating
                                                        value={Number(reviewForm.rating)}
                                                        onChange={(_e, v) => setReviewForm({ ...reviewForm, rating: v })}
                                                    />
                                                </div>
                                                <textarea
                                                    placeholder="Write Comment"
                                                    value={reviewForm.comment}
                                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                    required
                                                />
                                                <button className="submitBtn mt-3" type="submit">
                                                    Submit Review
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <h4>Customer reviews</h4>
                                        <h5>{product.ratings?.toFixed(1) || '0.0'} out of 5</h5>
                                        <Rating value={Number(product.ratings || 0)} readOnly size="small" />

                                        <div className="ratingBars">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = product.reviews?.filter((r) => r.rating === star).length || 0;
                                                const pct = product.reviews?.length
                                                    ? (count / product.reviews.length) * 100
                                                    : 0;
                                                return (
                                                    <div key={star} className="barRow">
                                                        <span>{star} star</span>
                                                        <div className="bar">
                                                            <div className="fill" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <br />
                <RelatedProducts title="Related products" products={related} />
                <RecentlyViewedProduct />
            </div>
        </section>
    );
};

export default Productdetails;
