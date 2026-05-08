import React from 'react'
import Button from '@mui/material/Button';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import Rating from "@mui/material/Rating";
import BaggyPant from "../../Assets/Images/Items/Baggy_Pants.jpeg";
import Zipper1 from "../../Assets/Images/Items/Zipper-1.jpeg";
import Jacket1 from "../../Assets/Images/Items/Jacket-1.jpeg";
import Wallet1 from "../../Assets/Images/Items/Wallet-1.jpeg";
import SunGlasses from "../../Assets/Images/Items/Sun_Glasses.jpeg";
import TShirt from "../../Assets/Images/Items/T_Shirt.jpeg";
import Jacket2 from "../../Assets/Images/Items/Jacket-2.jpeg";
import Caps1 from "../../Assets/Images/Items/Caps-1.jpeg";


function ProductCardSection() {
  const products = [
    {
      id: 1,
      img: BaggyPant,
      title: "Baggy Pant",
      oldPrice: "$20.00",
      newPrice: "$14.00"
    },
    {
      id: 2,
      img: Zipper1,
      title: "Zipper Jacket",
      oldPrice: "$25.00",
      newPrice: "$18.00"
    },
    {
      id: 3,
      img: Jacket1,
      title: "Winter Jacket",
      oldPrice: "$40.00",
      newPrice: "$30.00"
    },
    {
      id: 4,
      img: Wallet1,
      title: "Leather Wallet",
      oldPrice: "$15.00",
      newPrice: "$10.00"
    },
    {
      id: 5,
      img: SunGlasses,
      title: "Sun Glasses",
      oldPrice: "$22.00",
      newPrice: "$16.00"
    },
    {
      id: 6,
      img: TShirt,
      title: "T-Shirt",
      oldPrice: "$18.00",
      newPrice: "$12.00"
    },
    {
      id: 7,
      img: Jacket2,
      title: "Casual Jacket",
      oldPrice: "$35.00",
      newPrice: "$28.00"
    },
    {
      id: 8,
      img: Caps1,
      title: "Stylish Cap",
      oldPrice: "$10.00",
      newPrice: "$7.00"
    }
  ];

  return (
    <div className="product_row productRow2 w-100 mt-4 d-flex">
      {
        products.map((product) => (
          <NewProductCard
            key={product.id}
            img={product.img}
            title={product.title}
            oldPrice={product.oldPrice}
            newPrice={product.newPrice}
          />
        ))
      }
    </div>
  )
};

export default ProductCardSection;

const NewProductCard = ({ img, title, oldPrice, newPrice }) => {
  return (
      <div className="item productItem mb-4">
          <div className="imageWrapper">
              <img src={img} alt={title} className="w-100" />

              <span className="badge badge-primary">28%</span>

              <div className="actions">
                  <Button>
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