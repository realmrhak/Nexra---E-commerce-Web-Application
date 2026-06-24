import { FaSearch } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        navigate(`/shop?search=${encodeURIComponent(q)}`);
    };

    return (
        <form className="headerSearch ml-3 mr-3" onSubmit={handleSubmit} role="search">
            <input
                type="text"
                placeholder='Search for products'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search for products"
            />
            <Button type="submit" aria-label="Search"><FaSearch /></Button>
        </form>
    );
};

export default SearchBox;
