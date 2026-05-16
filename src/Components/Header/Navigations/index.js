import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io"
import { FaAngleDown } from "react-icons/fa6"
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';

const Navigation = () => {

    const location = useLocation();

const [isOpenSidebarVal, setIsOpenSidebarVal] = useState(false);
const [isUserToggled, setIsUserToggled] = useState(false);

// Route-based default (sirf jab user ne manually toggle na kiya ho)
useEffect(() => {
    if (!isUserToggled) {
        setIsOpenSidebarVal(location.pathname === "/");
    }
}, [location.pathname, isUserToggled]);

// Button click handler
const handleToggleSidebar = () => {
    setIsOpenSidebarVal(prev => !prev);
    setIsUserToggled(true);
};

    return (
        <nav>
            <div className="container">
                <div className="row">
                    <div className="col-sm-2 navpart1">
                        <div className="cartWrapper">
                            <Button className='allCatTab' onClick={handleToggleSidebar}>
                                <span className='icon1 mr-2'><IoIosMenu /></span>
                                <span className='text'>ALL CATEGORIES</span>
                                <span className='icon2 ml-2'><FaAngleDown /></span>
                            </Button>
                            <div className={`sidebarNav ${isOpenSidebarVal === true ? 'open' : ''}`}>
                                <ul>
                                    <li> <Link to='/'><Button>men<FaAngleRight className='ml-auto'/></Button></Link>
                                        <div className="submenu">
                                            <Link to='/'><Button>clothing</Button></Link>
                                            <Link to='/'><Button>footwear</Button></Link>
                                            <Link to='/'><Button>watches</Button></Link>
                                            <Link to='/'><Button>Perfume</Button></Link>
                                            <Link to='/'><Button>Accessories</Button></Link>
                                        </div>

                                    </li>
                                    <li><Link to='/'><Button>Women<FaAngleRight className='ml-auto'/></Button></Link>
                                    <div className="submenu">
                                            <Link to='/'><Button>clothing</Button></Link>
                                            <Link to='/'><Button>footwear</Button></Link>
                                            <Link to='/'><Button>watches</Button></Link>
                                            <Link to='/'><Button>Perfume</Button></Link>
                                            <Link to='/'><Button>Accessories</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to='/'><Button>Jeans</Button></Link></li>
                                    <li> <Link to='/'><Button>Glasses</Button></Link></li>
                                    <li><Link to='/'><Button>Caps</Button></Link></li>
                                    <li><Link to='/'><Button>Rings & Neckless</Button></Link></li>
                                    <li><Link to='/'><Button>kids</Button></Link></li>
                                    <li><Link to='/'><Button>perfume</Button></Link></li>
                                    <li><Link to='/'><Button>gifts</Button></Link></li>
                                    <li><Link to='/'><Button>Shoes</Button></Link></li>
                                    <li><Link to='/'><Button>Sandals</Button></Link></li>
                                    <li><Link to='/'><Button>Pant & Coat</Button></Link></li>
                                    <li><Link to='/'><Button>Waist Coat</Button></Link></li>
                                    {/* <li><Link to='/'><Button>Slippers</Button></Link></li>
                                    <li><Link to='/'><Button>Jackets</Button></Link></li>
                                    <li><Link to='/'><Button>Under Germents</Button></Link></li>
                                    <li><Link to='/'><Button>watches</Button></Link></li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-10 navpart2 d-flex align-items-center">
                        <ul className="list list-inline ml-auto">
                            <li className="list-inline-item"><Link to='/'><Button>home</Button></Link></li>
                            <li className="list-inline-item nav-item">
                                <Link to='/'><Button>
                                    <div className="menu-content">
                                        <span>Men</span>
                                        <FaAngleDown className="icon" />
                                    </div>
                                </Button></Link>
                                <div className="submenu ">
                                    <Link to='/'><Button>clothing</Button></Link>
                                    <Link to='/'><Button>footwear</Button></Link>
                                    <Link to='/'><Button>watches</Button></Link>
                                    <Link to='/'><Button>Perfume</Button></Link>
                                    <Link to='/'><Button>Accessories</Button></Link>
                                </div></li>
                            <li className="list-inline-item nav-item">
                                <Link to='/'><Button>
                                    <div className="menu-content">
                                        <span>women</span>
                                        <FaAngleDown className="icon" />
                                    </div>
                                </Button></Link>
                                <div className="submenu ">
                                    <Link to='/'><Button>clothing</Button></Link>
                                    <Link to='/'><Button>footwear</Button></Link>
                                    <Link to='/'><Button>watches</Button></Link>
                                    <Link to='/'><Button>Perfume</Button></Link>
                                    <Link to='/'><Button>Accessories</Button></Link>
                                </div></li>
                            <li className="list-inline-item"><Link to='/'><Button>Shop</Button></Link></li>
                            <li className="list-inline-item"><Link to='/'><Button>watches</Button></Link></li>

                            <li className="list-inline-item nav-item">
                                <Link to='/'><Button>
                                    <div className="menu-content">
                                        <span>kids</span>
                                        <FaAngleDown className="icon" />
                                    </div>
                                </Button></Link>
                                <div className="submenu ">
                                    <Link to='/'><Button>clothing</Button></Link>
                                    <Link to='/'><Button>footwear</Button></Link>
                                    <Link to='/'><Button>Accessories</Button></Link>
                                </div></li>

                            <li className="list-inline-item nav-item">
                                <Link to='/'><Button>
                                    <div className="menu-content">
                                        <span>footwear</span>
                                        <FaAngleDown className="icon" />
                                    </div>
                                </Button></Link>
                                <div className="submenu ">
                                    <Link to='/'><Button>Chelsea</Button></Link>
                                    <Link to='/'><Button>Lofers</Button></Link>
                                    <Link to='/'><Button>Sneakers</Button></Link>
                                    <Link to='/'><Button>Long Boots</Button></Link>
                                </div></li>
                            <li className="list-inline-item"><Link to='/'><Button>CONTACT</Button></Link></li>

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation;