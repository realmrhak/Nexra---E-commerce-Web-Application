import { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

// Default images used as fallback
import Dress1 from '../../Assets/Images/Items/Dress-1.jpeg';
import Dress12 from '../../Assets/Images/Items/Dress-1-2.png';
import Dress13 from '../../Assets/Images/Items/Dress-1-3.png';

const DEFAULT_IMAGES = [Dress1, Dress12, Dress13];

/**
 * ProductZoom — main image with thumbnails + inner zoom.
 * Pass images as [{ url }] or [url].
 */
const ProductZoom = ({ images = [] }) => {
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();
    const [active, setActive] = useState(0);

    const imgs = (images && images.length)
        ? images.map(i => (typeof i === 'string' ? i : i.url))
        : DEFAULT_IMAGES;

    const goto = (index) => {
        setActive(index);
        zoomSlider.current?.slickGoTo?.(index);
        zoomSliderBig.current?.slickGoTo?.(index);
    };

    useEffect(() => {
        goto(0);
    }, [imgs.length]);

    const settings = {
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

    const settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToScroll: 1,
        slidesToShow: 1,
        fade: false,
        arrows: false,
    };

    return (
        <div className="productZoom">
            <div className='ProductZoom position-relative'>
                <Slider {...settings2} className='zoomSliderBig' ref={zoomSliderBig}>
                    {imgs.map((src, i) => (
                        <div className='item' key={i}>
                            <InnerImageZoom
                                zoomType='hover'
                                zoomScale={1}
                                src={src}
                                alt={`Product image ${i + 1}`}
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            {imgs.length > 1 && (
                <Slider {...settings} className='zoomSlider' ref={zoomSlider}>
                    {imgs.map((src, i) => (
                        <div className='item' key={i}>
                            <img
                                className='w-100'
                                src={src}
                                alt={`Thumbnail ${i + 1}`}
                                onClick={() => goto(i)}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default ProductZoom;
