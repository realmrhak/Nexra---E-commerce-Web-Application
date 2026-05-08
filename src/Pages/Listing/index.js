import React from 'react'
import Button from "@mui/material/Button";
import { IoMdMenu } from "react-icons/io";
import { HiViewGrid } from "react-icons/hi";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";


// import { List } from '@mui/icons-material'
import Sidebar from '../../Components/Sidebar';
import HoriBannerBox from '../../Assets/Images/Banners/Listing_Horizontal_Banner.jpg'
function Listing() {
  return (
    <>
    <section className='product_listing_page'>
        <div className="container">
            <div className="productListing d-flex">
                <Sidebar/>

                <div className="content_right">
                    <img className='w-100 ml-4' style={{borderRadius: '8px'}} src={HoriBannerBox} alt="not Found" />

                    <div className="showBy ml-4 mt-3">
                      <Button><IoMdMenu /></Button>
                      <Button><HiViewGrid /></Button>
                      <Button><BiSolidGrid /></Button>
                      <Button><TfiLayoutGrid4Alt /></Button>
                    </div>
                </div>
            </div>
        </div>

    </section>
    </>
  )
};

export default Listing;