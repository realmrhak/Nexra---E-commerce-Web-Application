import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountryDropdown from "../CountryDropdown";
import { FiUser, FiChevronDown } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import Button from '@mui/material/Button';
import SearchBox from './SearchBox';
import Navigation from './Navigations';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { User, Heart, LogOut, ShoppingBag } from 'lucide-react';

const Header = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { itemCount, subtotal } = useCart();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate('/');
    };

    return (
        <div className="headerWrapper">
            <div className="top-strip bg-green">
                <div className="container">
                    <p className="mb-0 mt-0 text-center">
                        Due to the COVID 19 epidemic, orders may be processed with a slight delay.
                    </p>
                </div>
            </div>
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="logoWrapper d-flex align-items-center col-sm-2">
                            <Link to='/' className="nexraTextLogo">
                                Ne<span className="brand-x">x</span>ra
                            </Link>
                        </div>
                        <div className="col-sm-10 d-flex align-items-center part2">
                            <CountryDropdown />
                            <SearchBox />

                            <div className="part3 d-flex align-items-center ml-auto">
                                {/* Cart in circle */}
                                <div className="ml-auto cartTab d-flex align-items-center">
                                    <span className='price'>
                                        ${typeof subtotal === 'number' ? subtotal.toFixed(2) : '0.00'}
                                    </span>
                                    <div className="position-relative ml-2">
                                        <Link to="/cart">
                                            <Button className='circle cartCircle'>
                                                <IoBagOutline />
                                            </Button>
                                        </Link>
                                        <span className='count d-flex align-items-center justify-content-center'>
                                            {itemCount}
                                        </span>
                                    </div>
                                </div>

                                {/* Profile / Auth */}
                                <div className="ml-3">
                                    {isAuthenticated ? (
                                        <div className="profileDropdown" ref={dropdownRef}>
                                            <button
                                                className="profileBtn"
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                            >
                                                <span className="avatar">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="profileName">
                                                    Hi, {user?.name?.split(' ')[0]}
                                                </span>
                                                <FiChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                                            </button>

                                            {dropdownOpen && (
                                                <div className="profileMenu">
                                                    <div className="profileMenuHeader">
                                                        <div className="avatar large">
                                                            {user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="menuUserName">{user?.name}</div>
                                                            <div className="menuUserEmail">{user?.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="profileMenuList">
                                                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="profileMenuItem">
                                                            <User size={16} /> My Profile
                                                        </Link>
                                                        <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="profileMenuItem">
                                                            <Heart size={16} /> Wishlist
                                                        </Link>
                                                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="profileMenuItem">
                                                            <ShoppingBag size={16} /> My Orders
                                                        </Link>
                                                        <button onClick={handleLogout} className="profileMenuItem logout">
                                                            <LogOut size={16} /> Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Button className='circle'>
                                            <Link to='/login'><FiUser /></Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <Navigation />
        </div>
    );
};

export default Header;
