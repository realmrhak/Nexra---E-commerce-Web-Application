import React, { useState } from 'react';
import VertBannerBox from '../../Assets/Images/Banners/Listing_Vertical_Banner.png'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link } from 'react-router-dom';

function Sidebar() {

  const [value, setvalue] = useState([100, 60000]);
  return (
    <>
      <div className="sidebar">
        
          <div className="filterBox">
            <h6 className='mb-3'>Product Categories</h6>

            <div className='scroll'>
              <ul>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Shirts' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Pants' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Hoodie' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Jackets' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Footwear' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Wallets' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Perfume' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Caps' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Sun Glasses' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Rings & Chains' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Waist Coat' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Pant Coat' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Kurta' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Shawal' /></li>
              </ul>
            </div>
          </div>

          <div className="filterBox">
            <h6 className='mb-3'>Filter by Price</h6>

            <RangeSlider value={value} onInput={setvalue} min={100} max={60000} step={5} />

            <div className="d-flex pt-2 pb-2 priceRange">
              <span>From: <strong className="text-dark">Rs: {value[0]}</strong></span>
              <span className="ml-auto">From: <strong className="text-dark">Rs:{value[1]}</strong></span>
            </div>
          </div>

          <div className="filterBox">
            <h6 className='mb-3'>Product Status</h6>

            <div className='scroll'>
              <ul>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='In Stock' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='On Sale' /></li>
              </ul>
            </div>
          </div>

          <div className="filterBox">
            <h6 className='mb-3'>Brands</h6>

            <div className='scroll'>
              <ul>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Ralph Lauren' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Zellbury' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Charcoal' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Uniworth' /></li>
                <li><FormControlLabel className='w-100' control={<Checkbox />} label='Legacy' /></li>
              </ul>
            </div>
          </div>

          <Link to='#'><img src={VertBannerBox} className='w-100 ' style={{ marginLeft: '-37px', borderRadius: '15px' }} alt="Not Found" /></Link>




       
      </div>
    </>
  )
}

export default Sidebar