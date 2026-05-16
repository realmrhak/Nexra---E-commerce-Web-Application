import Dress1 from '../../Assets/Images/Items/Dress-1.jpeg';
import Dress12 from '../../Assets/Images/Items/Dress-1-2.png';
import Dress13 from '../../Assets/Images/Items/Dress-1-3.png';
import { useRef } from 'react';
import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

const ProductZoom = () => {

    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        zoomSlider.current.slickGoTo(index);
        zoomSliderBig.current.slickGoTo(index);
    }

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: 5,
        fade: false,
        arrows: true
    };

    var settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToScroll: 1,
        slidesToShow: 1,
        fade: false,
        arrows: false
    };

    return(
        <div className="productZoom">
            <div className='ProductZoom position-relative'>
                            <div className="badge badge-primary">28%</div>
                            <Slider {...settings2} className='zoomSliderBig' ref={zoomSliderBig}>

                                <div className='item'>
                                    <InnerImageZoom zoomType='hover' zoomScale={1} src={Dress1} />

                                </div>
                                <div className='item'>
                                    <InnerImageZoom zoomType='hover' zoomScale={1} src={Dress12} />

                                </div>

                                <div className='item'>
                                    <InnerImageZoom zoomType='hover' zoomScale={1} src={Dress13} />

                                </div>


                            </Slider>
                        </div>
                        <Slider {...settings} className='zoomSlider' ref={zoomSlider}>

                            <div className='item'>
                                <img className='w-100' src={Dress1} alt='Not Found' onClick={() => goto(0)} />

                            </div>
                            <div className='item'>
                                <img className='w-100' src={Dress12} alt='Not Found' onClick={() => goto(1)} />

                            </div>
                            <div className='item'>
                                <img className='w-100' src={Dress13} alt='Not Found' onClick={() => goto(2)} />

                            </div>

                        </Slider>
        </div>
    )
}

export default ProductZoom;