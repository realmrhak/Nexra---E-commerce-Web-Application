import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

/**
 * ProductItem — a single product card.
 *
 * Admin-only features (visible ONLY when an admin is logged in):
 *   - Pencil icon  → navigates to /admin/products/:id/edit
 *   - Trash icon   → opens a delete confirmation modal, then DELETE /api/products/:id
 *   - Both icons sit in the top-right corner, separate from the user-facing
 *     quick-view + wishlist actions, so they never overlap.
 *
 * Public users see only the standard quick-view + wishlist buttons.
 *
 * Props:
 *   product              : the product object (backend or legacy shape)
 *   itemView             : 'one' | 'two' | 'three' | 'four' (grid density)
 *   viewProductDetails   : (product) => void  — opens quick-view modal
 *   onAddToWishlist      : (product) => void
 *   onDelete             : (productId) => void  — OPTIONAL: parent refetches list after delete
 */
const ProductItem = ({ itemView, product, viewProductDetails, onAddToWishlist, onDelete }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = product._id || product.id;
  const title = product.name || product.title;
  const image = product.images?.[0]?.url || product.img || '';
  const price = product.price !== undefined ? Number(product.price) : null;
  const oldPrice = product.oldPrice ?? null;
  const rating = product.ratings || 5;
  const stock = product.stock !== undefined ? product.stock : 1;
  const inStock = stock > 0;

  const discount =
    product.oldPrice && product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const detailHref = product.slug ? `/product/${product.slug}` : `/product/${id}`;
  const fallbackImg = 'https://placehold.co/400x500/f5f5f5/999999?text=No+Image';

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/products/${id}/edit`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/products/${id}`);
      toast.success(`"${title}" deleted.`);
      setConfirmOpen(false);
      // Notify parent so it can refetch / remove from list
      if (onDelete) onDelete(id);
    } catch (err) {
      toast.error(err?.message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={`productItem ${itemView}`}>
        <div className="imageWrapper">
          <Link to={detailHref}>
            <img
              src={image || fallbackImg}
              alt={title || 'Product'}
              className="w-100"
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== fallbackImg) e.target.src = fallbackImg;
              }}
            />
          </Link>

          {discount && (
            <span className="badge badge-primary">-{discount}%</span>
          )}

          {/* ===== Public user actions (quick view + wishlist) ===== */}
          <div className="actions">
            {viewProductDetails && (
              <Button onClick={() => viewProductDetails(product)} aria-label="Quick view">
                <TfiFullscreen />
              </Button>
            )}
            <Button
              onClick={() => onAddToWishlist?.(product)}
              aria-label="Add to wishlist"
            >
              <IoMdHeartEmpty style={{ fontSize: "20px" }} />
            </Button>
          </div>

          {/* ===== ADMIN-ONLY: edit + delete icons (top-right, never overlap with .actions) ===== */}
          {isAdmin && id && (
            <div className="adminCardActions">
              <button
                className="adminCardBtn edit"
                onClick={handleEdit}
                title="Edit product"
                aria-label="Edit product"
              >
                <Pencil size={13} />
              </button>
              <button
                className="adminCardBtn delete"
                onClick={handleDeleteClick}
                title="Delete product"
                aria-label="Delete product"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="info">
          <Link to={detailHref}>
            <h4 title={title}>{title}</h4>
          </Link>

          <span className={`d-block ${inStock ? 'text-success' : 'text-danger'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <Rating
            className="mt-2 mb-2"
            value={Number(rating)}
            readOnly
            size="small"
            precision={0.5}
          />

          <div className="d-flex align-items-center">
            {oldPrice && <span className="oldPrice">${Number(oldPrice).toFixed(2)}</span>}
            <span className="netPrice text-danger ml-2">
              {price !== null ? `$${price.toFixed(2)}` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ===== Delete confirmation modal ===== */}
      {confirmOpen && (
        <div
          className="adminConfirmOverlay"
          onClick={() => setConfirmOpen(false)}
        >
          <div className="adminConfirmModal" onClick={(e) => e.stopPropagation()}>
            <div className="adminConfirmIcon">
              <AlertTriangle size={32} />
            </div>
            <h4>Delete Product?</h4>
            <p>
              Are you sure you want to delete <strong>"{title}"</strong>?
              This action cannot be undone. The product will be removed from
              the entire website including all sliders, listings, and carts.
            </p>
            <div className="adminConfirmActions">
              <button
                className="adminBtn secondary"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="adminBtn danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductItem;
