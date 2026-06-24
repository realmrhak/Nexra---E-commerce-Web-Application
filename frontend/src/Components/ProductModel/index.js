import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { MdClose } from 'react-icons/md';
import Rating from "@mui/material/Rating";
import QuantityBox from '../QuantityBox';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoShuffleOutline } from "react-icons/io5";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { useRef } from 'react';

// Fallback images
import Dress1 from '../../Assets/Images/Items/Dress-1.jpeg';
import Dress12 from '../../Assets/Images/Items/Dress-1-2.png';
import Dress13 from '../../Assets/Images/Items/Dress-1-3.png';

const DEFAULT_IMAGES = [Dress1, Dress12, Dress13];

const ProductModel = ({ product, closeProductModal }) => {
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState('');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Image slider refs (like original code)
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    if (!product) return null;

    const title = product.name || product.title || 'Product';
    const image = product.images?.[0]?.url || product.img || '';
    const price = product.price !== undefined ? Number(product.price) : null;
    const oldPrice = product.oldPrice ?? null;
    const brand = product.brand || 'Generic';
    const rating = product.ratings || 5;
    const numReviews = product.numReviews || 0;
    const stock = product.stock ?? 0;
    const description = product.description || '';
    const sizes = product.sizes || [];

    // Build images array for slider
    const imgs = (product.images && product.images.length)
        ? product.images.map(i => (typeof i === 'string' ? i : i.url))
        : (image ? [image] : DEFAULT_IMAGES);

    const goto = (index) => {
        zoomSlider.current?.slickGoTo?.(index);
        zoomSliderBig.current?.slickGoTo?.(index);
    };

    const handleAddToCart = async () => {
        try {
            const productId = product._id || product.id;
            await addToCart(productId, qty, size, '');
            closeProductModal();
        } catch (err) {
            toast.error(err?.message || 'Could not add to cart.');
        }
    };

    const goToProduct = () => {
        const id = product.slug || product._id || product.id;
        closeProductModal();
        navigate(`/product/${id}`);
    };

    // Slider settings (like original code)
    const settingsBig = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToScroll: 1,
        slidesToShow: 1,
        fade: false,
        arrows: false,
    };

    const settingsThumbs = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: Math.min(5, imgs.length),
        fade: false,
        arrows: true,
        swipeToSlide: true,
        focusOnSelect: true,
    };

    return (
        <Dialog open={true} className='ProductModel' onClose={closeProductModal} disableScrollLock>
            <Button className='close_' onClick={closeProductModal}><MdClose /></Button>
            <h4 className='mb-2 font-weight-bold cursor' onClick={goToProduct}>{title}</h4>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center mr-4">
                    <span className='reviews'>Brands:</span>
                    <span className='ml-2'>{brand}</span>
                </div>
                <div className="d-flex align-items-center">
                    <Rating className="mt-2 mb-2" value={Number(rating)} readOnly size="small" precision={0.5} />
                    <span className='ml-1 reviews'>{numReviews} Reviews</span>
                </div>
            </div>
            <hr />

            <div className="row mt-2 productDetailsModel">
                <div className="col-md-5">
                    {/* ===== Image Slider with thumbnails (like original code) ===== */}
                    <div className="productZoom">
                        <div className='ProductZoom position-relative'>
                            <Slider {...settingsBig} className='zoomSliderBig' ref={zoomSliderBig}>
                                {imgs.map((src, i) => (
                                    <div className='item' key={i}>
                                        <InnerImageZoom
                                            zoomType='hover'
                                            zoomScale={1}
                                            src={src}
                                            alt={`${title} - image ${i + 1}`}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        {imgs.length > 1 && (
                            <Slider {...settingsThumbs} className='zoomSlider' ref={zoomSlider}>
                                {imgs.map((src, i) => (
                                    <div className='item' key={i}>
                                        <img
                                            className='w-100'
                                            src={src}
                                            alt={`${title} thumbnail ${i + 1}`}
                                            onClick={() => goto(i)}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        )}
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="d-flex info align-items-cener mb-3">
                        {oldPrice && <span className="oldPrice lg">${Number(oldPrice).toFixed(2)}</span>}
                        {price !== null && (
                            <span className='netPrice lg text-danger ml-2'>${price.toFixed(2)}</span>
                        )}
                    </div>

                    <span className={`badge ${stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                    <h5 className="mt-4">Description</h5>
                    <p className="mt-3 text-sml">
                        {description || 'No description available for this product.'}
                    </p>

                    {sizes.length > 0 && (
                        <div className="productSize d-flex align-items-center mt-3">
                            <span>Size:</span>
                            <ul className="list list-inline mb-0 pl-4">
                                {sizes.map((s, i) => (
                                    <li className="list-inline-item" key={s}>
                                        <a
                                            className={`tag ${size === s ? 'active' : ''}`}
                                            onClick={() => setSize(s)}
                                        >
                                            {s}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="d-flex align-items-center mt-4">
                        <QuantityBox value={qty} onChange={setQty} max={Math.max(1, stock)} />
                        <Button
                            className='btn-green btn-lg btn-big btn-round ml-3'
                            onClick={handleAddToCart}
                            disabled={stock <= 0}
                        >
                            Add to Cart
                        </Button>
                    </div>
                    <div className="d-flex align-items-center mt-4">
                        <Button className='btn-sml btn-round cursor'>
                            <IoIosHeartEmpty style={{ fontSize: "18px" }} /> &nbsp; Add to Wishlist
                        </Button>
                        <Button className='btn-sml btn-round cursor ml-3'>
                            <IoShuffleOutline style={{ fontSize: "18px" }} /> &nbsp; Compare
                        </Button>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center mr-4 mb-2">
                        <span className='reviews'>Category:</span>
                        <span className='ml-2'>{product.category?.name || 'General'}</span>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModel;
