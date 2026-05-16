import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import ProductModel from '../../../Components/ProductModel'
import Rating from "@mui/material/Rating";
import Jacket1 from "../../../Assets/Images/Items/Jacket-1.jpeg";
import Wallet1 from "../../../Assets/Images/Items/Wallet-1.jpeg";
import SunGlasses from "../../../Assets/Images/Items/Sun_Glasses.jpeg";
import Caps1 from "../../../Assets/Images/Items/Caps-1.jpeg";
import TShirt from "../../../Assets/Images/Items/T_Shirt.jpeg";

function RecentlyViewedProduct() {
  const products = [

    {
      id: 1,
      img: Jacket1,
      title: "Winter Jacket",
      oldPrice: "$40.00",
      newPrice: "$30.00"
    },
    {
      id: 2,
      img: Wallet1,
      title: "Leather Wallet",
      oldPrice: "$15.00",
      newPrice: "$10.00"
    },
    {
      id: 3,
      img: SunGlasses,
      title: "Sun Glasses",
      oldPrice: "$22.00",
      newPrice: "$16.00"
    },
    {
      id: 4,
      img: Caps1,
      title: "Stylish Cap",
      oldPrice: "$10.00",
      newPrice: "$7.00"
    },
    {
      id: 5,
      img: TShirt,
      title: "T-Shirt",
      oldPrice: "$22.00",
      newPrice: "$16.00"
    },
  ];

  const [isOpenProductModel, setisOpenProductModel] = useState(false)

  const veiwProductDetails = (id) => {
    setisOpenProductModel(true);
  }

  const closeProductModal = () => {
    setisOpenProductModel(false);
  }

  return (
    <>
      <div className="d-flex align-items-center mt-5">
        <div className="info w-75 ">
          <h3 className="mb-0 hd">Recently Viewed Products</h3>
        </div>

      </div>
      <div className="product_row productRow5 w-100 mt-4">
        {
          products.map((product) => (
            <NewProductCard
              key={product.id}
              img={product.img}
              title={product.title}
              oldPrice={product.oldPrice}
              newPrice={product.newPrice}
              veiwProductDetails={veiwProductDetails}
            />
          ))
        }
        {
          isOpenProductModel === true && <ProductModel closeProductModal={closeProductModal} />
        }
      </div>
    </>
  )
};

export default RecentlyViewedProduct;

const NewProductCard = ({ img, title, oldPrice, newPrice, veiwProductDetails }) => {
  return (
    <div className="item productItem mb-4">
      <div className="imageWrapper">
        <img src={img} alt={title} className="w-100" />

        <span className="badge badge-primary">28%</span>

        <div className="actions">
          <Button onClick={() => veiwProductDetails(1)}>
            <TfiFullscreen />
          </Button>

          <Button>
            <IoMdHeartEmpty style={{ fontSize: "20px" }} />
          </Button>
        </div>
      </div>

      <div className="info">
        <h4>{title}</h4>

        <span className="text-success d-block">
          In Stock
        </span>

        <Rating
          className="mt-2 mb-2"
          value={5}
          readOnly
          size="small"
        />

        <div className="d-flex">
          <span className="oldPrice">
            {oldPrice}
          </span>

          <span className="netPrice text-danger ml-2">
            {newPrice}
          </span>
        </div>
      </div>
    </div>
  );
};