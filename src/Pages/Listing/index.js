import React, { useState } from 'react'
import Button from "@mui/material/Button";
import { SlMenu } from "react-icons/sl";
import { HiViewGrid } from "react-icons/hi";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from 'react-icons/fa'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Sidebar from '../../Components/Sidebar';
import HoriBannerBox from '../../Assets/Images/Banners/Listing_Horizontal_Banner.jpg';
import ProductItem from '../../Components/ProductItem';
import BaggyPant from "../../Assets/Images/Items/Baggy_Pants.jpeg";
import Zipper1 from "../../Assets/Images/Items/Zipper-1.jpeg";
import Jacket1 from "../../Assets/Images/Items/Jacket-1.jpeg";
import Wallet1 from "../../Assets/Images/Items/Wallet-1.jpeg";
import SunGlasses from "../../Assets/Images/Items/Sun_Glasses.jpeg";
import TShirt from "../../Assets/Images/Items/T_Shirt.jpeg";
import Jacket2 from "../../Assets/Images/Items/Jacket-2.jpeg";
import Caps1 from "../../Assets/Images/Items/Caps-1.jpeg";
import ProductModel from "../../Components/ProductModel";
import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';


function Listing() {
  const id = React.useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [productView, setProductView] = useState('four');

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



  const [isOpenProductModel, setisOpenProductModel] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);



  const viewProductDetails = (product) => {

    setSelectedProduct(product);

    setisOpenProductModel(true);

  };



  const closeProductModal = () => {

    setisOpenProductModel(false);

  };


  return (
    <>
      <section className='product_listing_page'>
        <div className="container">
          <div className="productListing d-flex">
            <Sidebar />

            <div className="content_right">
              <img className='w-100 ml-4' style={{ borderRadius: '8px' }} src={HoriBannerBox} alt="not Found" />

              <div className="showBy ml-4 mb-3 mt-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button  className={`ico2 ${productView === 'one' ? 'act' : ''}`}
                    onClick={() => setProductView('one')}><SlMenu /></Button>
                  <Button  className={`ico1 ${productView === 'two' ? 'act' : ''}`}
                    onClick={() => setProductView('two')}><HiViewGrid /></Button>
                  <Button  className={`ico1 ${productView === 'three' ? 'act' : ''}`}
                    onClick={() => setProductView('three')}><BiSolidGrid /></Button>
                  <Button
                    className={`ico2 ${productView === 'four' ? 'act' : ''}`}
                    onClick={() => setProductView('four')}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>

                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>Show 9 <FaAngleDown /></Button>
                  <Menu
                    className='w-100 showPerPageDropdown'
                    id={menuId}
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    slotProps={{
                      list: {
                        'aria-labelledby': buttonId,
                      },
                    }}
                  >
                    <MenuItem onClick={handleClose}>8</MenuItem>
                    <MenuItem onClick={handleClose}>16</MenuItem>
                    <MenuItem onClick={handleClose}>24</MenuItem>
                    <MenuItem onClick={handleClose}>32</MenuItem>
                    <MenuItem onClick={handleClose}>40</MenuItem>
                  </Menu>
                </div>
              </div>

              <div className="productGrid ml-5">

                {
                  products.map((product) => (

                    <ProductItem
                      key={product.id}
                      itemView={productView}
                      product={product}
                      viewProductDetails={viewProductDetails}
                    />

                  ))
                }

              </div>

              <div className="PaginationPart d-flex align-items-center justify-content-center mt-5">
                <Pagination count={8} color='primary' />
              </div>
            </div>
          </div>
        </div>
        {
          isOpenProductModel && (

            <ProductModel
              product={selectedProduct}
              closeProductModal={closeProductModal}
            />

          )
        }

      </section>
    </>
  )
};

export default Listing;