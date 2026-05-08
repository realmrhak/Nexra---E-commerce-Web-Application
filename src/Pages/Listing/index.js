import React from 'react'
import Button from "@mui/material/Button";
import { SlMenu } from "react-icons/sl";
import { HiViewGrid } from "react-icons/hi";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from 'react-icons/fa'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Sidebar from '../../Components/Sidebar';
import HoriBannerBox from '../../Assets/Images/Banners/Listing_Horizontal_Banner.jpg'
import ProductCardSection from '../../Components/ProductCardSection/index'


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
                  <Button className='ico2'><SlMenu /></Button>
                  <Button className='ico1'><HiViewGrid /></Button>
                  <Button className='ico1'><BiSolidGrid /></Button>
                  <Button className='ico2'><TfiLayoutGrid4Alt /></Button>
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

              <div className="productListing ml-5">
                <ProductCardSection />
                <ProductCardSection />
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  )
};

export default Listing;