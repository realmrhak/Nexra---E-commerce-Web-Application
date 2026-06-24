import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();
    const { categories } = useApp();
    const { isAdmin } = useAuth();

    const [isOpenSidebarVal, setIsOpenSidebarVal] = useState(false);
    const [isUserToggled, setIsUserToggled] = useState(false);

    useEffect(() => {
        if (!isUserToggled) {
            setIsOpenSidebarVal(location.pathname === "/");
        }
    }, [location.pathname, isUserToggled]);

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
                            <div className={`sidebarNav ${isOpenSidebarVal ? 'open' : ''}`}>
                                <ul>
                                    {categories.length === 0 && (
                                        <li><Link to='/shop'><Button>All Products</Button></Link></li>
                                    )}
                                    {categories.map((cat) => (
                                        <li key={cat._id}>
                                            <Link to={`/category/${cat.slug}`}>
                                                <Button>
                                                    {cat.name}
                                                    <FaAngleRight className='ml-auto' />
                                                </Button>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-10 navpart2 d-flex align-items-center">
                        <ul className="list list-inline ml-auto">
                            {/* ===== ADMIN-ONLY: Dashboard link FIRST (before Home), same styling ===== */}
                            {isAdmin && (
                                <li className="list-inline-item">
                                    <Link to='/admin'>
                                        <Button>Dashboard</Button>
                                    </Link>
                                </li>
                            )}
                            <li className="list-inline-item"><Link to='/'><Button>Home</Button></Link></li>
                            <li className="list-inline-item"><Link to='/shop'><Button>Shop</Button></Link></li>
                            {categories.slice(0, 4).map((cat) => (
                                <li className="list-inline-item" key={cat._id}>
                                    <Link to={`/category/${cat.slug}`}>
                                        <Button>{cat.name}</Button>
                                    </Link>
                                </li>
                            ))}
                            <li className="list-inline-item"><Link to='/cart'><Button>Cart</Button></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
