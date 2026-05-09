import React from "react";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";


const ProductItem = ({
  itemView,
  product,
  viewProductDetails
}) => {

  return (

    <div className={`productItem ${itemView}`}>

      {/* Product Image */}
      <div className="imageWrapper">

        <img
          src={product.img}
          alt={product.title}
          className="w-100"
        />

        {/* Badge */}
        <span className="badge badge-primary">
          28%
        </span>

        {/* Buttons */}
        <div className="actions">

          <Button onClick={() => viewProductDetails(product)}>
            <TfiFullscreen />
          </Button>

          <Button>
            <IoMdHeartEmpty style={{ fontSize: "20px" }} />
          </Button>

        </div>

      </div>

      {/* Product Info */}
      <div className="info">

        <h4>{product.title}</h4>

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
            {product.oldPrice}
          </span>

          <span className="netPrice text-danger ml-2">
            {product.newPrice}
          </span>

        </div>

      </div>

    </div>

  );
};

export default ProductItem;