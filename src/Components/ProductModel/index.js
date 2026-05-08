import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { MdClose } from 'react-icons/md';
import Rating from "@mui/material/Rating";
import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import Dress1 from '../../Assets/Images/Items/Dress-1.jpeg';
import Dress12 from '../../Assets/Images/Items/Dress-1-2.png';
import Dress13 from '../../Assets/Images/Items/Dress-1-3.png';
import { useRef } from 'react';
import QuantityBox from '../QuantityBox';
import { IoIosHeartEmpty } from 'react-icons/io';
import { MdCompareArrows } from 'react-icons/md';
const ProductModel = (props) => {

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

    return (
        <>
            <Dialog open={true} className='ProductModel' onClose={() => { props.closeProductModal() }} disableScrollLock >

                <Button className='close_' onClick={() => { props.closeProductModal() }}><MdClose /></Button>
                <h4 className='mb-2 font-weight-bold'>Multicolor Casual Collar Long Sleeve Check Shirt</h4>
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center mr-4">
                        <span className='reviews'>Brands:</span>
                        <span className='ml-2'>Ralph Lauren</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <Rating className="mt-2 mb-2" value={4.5} readOnly size="small" precision={0.5} />
                        <span className='ml-1 reviews'>3 Reviews</span>
                    </div>
                </div>
                <hr />

                <div className="row mt-2 productDetailsModel">

                    <div className="col-md-5">
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

                    <div className="col-md-7">
                        <div className="d-flex info align-items-cener mb-3">
                            <span className="oldPrice lg">$20.00</span>
                            <span className='netPrice lg text-danger ml-2'>$14.00</span>
                        </div>

                        <span className="badge bg-success">IN STOCK</span>
                        <h5 className="mt-4">Description</h5>
                        <p className="mt-3 text-sml">Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent</p>

                        <div className="d-flex align-items-center">
                            <QuantityBox />
                            <Button className='btn-green btn-lg btn-big btn-round ml-3'>Add to Cart</Button>
                        </div>
                        <div className="d-flex align-items-center mt-4">
                            <Button className='btn-sml btn-round cursor'><IoIosHeartEmpty style={{ fontSize: "18px" }} /> &nbsp; Add to Wishlist</Button>
                            <Button className='btn-sml btn-round cursor ml-3'><MdCompareArrows style={{ fontSize: "18px" }} /> &nbsp; Compare</Button>
                        </div>
                        <hr />
                        <div className="d-flex align-items-center mr-4 mb-2">
                            <span className='reviews'>Category:</span>
                            <span className='ml-2'>Men's Clothing</span>
                        </div>
                        <div className="d-flex align-items-center mr-4">
                            <span className='reviews'>Tags:</span>
                            <span className='ml-2'>Casual, Modern, Classic</span>
                        </div>

                    </div>
                </div>
            </Dialog>
        </>
    );
}
export default ProductModel;
