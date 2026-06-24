import { FaMinus, FaPlus } from 'react-icons/fa6';
import Button from '@mui/material/Button';

/**
 * Controlled quantity stepper.
 * Use as `<QuantityBox value={n} onChange={(v)=>...} max={10} />`
 * or uncontrolled: `<QuantityBox />` (defaults to 1).
 */
const QuantityBox = ({ value, onChange, max = 99, min = 1 }) => {
    const current = Number.isFinite(value) ? value : 1;

    const set = (v) => {
        const clamped = Math.max(min, Math.min(max, v));
        if (onChange) onChange(clamped);
    };

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={() => set(current - 1)} disabled={current <= min} aria-label="Decrease">
                <FaMinus />
            </Button>
            <input
                type="text"
                readOnly
                value={current}
                aria-label="Quantity"
            />
            <Button onClick={() => set(current + 1)} disabled={current >= max} aria-label="Increase">
                <FaPlus />
            </Button>
        </div>
    );
};

export default QuantityBox;
