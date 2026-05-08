import Dress1 from "../../Assets/Images/Items/Dress-1.jpeg";
import Dress2 from "../../Assets/Images/Items/Dress-2.jpeg";
import BaagyPants from "../../Assets/Images/Items/Baggy_Pants-2.jpeg";
import Dress4 from "../../Assets/Images/Items/Dress-4.jpeg";
import Dress5 from "../../Assets/Images/Items/Dress-5.jpeg";
import Dress6 from "../../Assets/Images/Items/Dress-6.jpeg";
import Dress7 from "../../Assets/Images/Items/Dress-7.jpeg";
import Dress8 from "../../Assets/Images/Items/Dress-8.jpeg";
import ProductModel from "../ProductModel"; 
import Button from "@mui/material/Button";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import Rating from "@mui/material/Rating";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductItem = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isOpenProductModel, setisOpenProductModel] = useState(false)

  const veiwProductDetails=(id) =>{
    setisOpenProductModel(true);
  }

  const closeProductModal = ()=>{
    setisOpenProductModel(false);
  }

  return (
    <div className="product_row w-100 mt-4 position-relative">

      {/* CUSTOM NAVIGATION BUTTONS */}
      <button className="customSwipPrev" ref={prevRef}>
        <FaChevronLeft />
      </button>

      <button className="customSwipNext" ref={nextRef}>
        <FaChevronRight />
      </button>

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

        className="mySwiper"
      >
        {/* SLIDES */}
        <SwiperSlide>
          <ProductCard img={Dress1} veiwProductDetails={veiwProductDetails} />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={Dress5} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={BaagyPants} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={Dress7} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={Dress2} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={Dress6} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={Dress8} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard img={Dress4} veiwProductDetails={veiwProductDetails}/>
        </SwiperSlide>

      </Swiper>
      {
        isOpenProductModel === true && <ProductModel closeProductModal = {closeProductModal} />
      }
      
    </div>
  );
};

export default ProductItem;

/* 🔥 Small reusable product card (cleaner code) */
const ProductCard = ({ img, veiwProductDetails }) => {
  return (
    <>
    <div className="item productItem">
      <div className="imageWrapper">
        <img src={img} alt="Not found" className="w-100" />
        <span className="badge badge-primary">28%</span>

        <div className="actions">
          <Button onClick={()=>veiwProductDetails(1)}>
            <TfiFullscreen />
          </Button>
          <Button>
            <IoMdHeartEmpty style={{ fontSize: "20px" }} />
          </Button>
        </div>
      </div>

      <div className="info">
        <h4>Multicolor Casual Collar Long Sleeve Fabric Shirt</h4>
        <span className="text-success d-block">In Stock</span>

        <Rating className="mt-2 mb-2" value={5} readOnly size="small" />

        <div className="d-flex">
          <span className="oldPrice">$20.00</span>
          <span className="netPrice text-danger ml-2">$14.00</span>
        </div>
      </div>
    </div>
    </>
    
  );
};