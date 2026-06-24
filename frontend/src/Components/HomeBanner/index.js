import React from "react";
import Slider from "react-slick";
import Banner1 from '../../Assets/Images/Banners/Banner-1.jpeg';
import Banner2 from '../../Assets/Images/Banners/Banner-2.jpeg';
import Banner3 from '../../Assets/Images/Banners/Banner-3.jpeg';

const HomeBanner = () => {

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true
    };

    return (
        <>
            <div className="homeBannerSec">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-9">
                        <Slider {...settings}>
                            <div className="item">
                                <img src={Banner2} alt="Banner" />
                            </div>
                            <div className="item">
                                <img src={Banner1} alt="Banner" />
                            </div>
                            <div className="item">
                                <img src={Banner3} alt="Banner" />
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeBanner;