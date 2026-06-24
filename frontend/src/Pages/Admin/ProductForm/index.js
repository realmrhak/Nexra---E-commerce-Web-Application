import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, X, ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../../api/axios';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '',
  description: '',
  brand: 'Generic',
  category: '',
  price: '',
  oldPrice: '',
  currency: 'USD',
  stock: 0,
  sizes: '',
  colors: '',
  isFeatured: false,
  isNew: false,
  isActive: true,
  tags: '',
};

const ProductForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, refreshCategories } = useApp();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]); // [{ url, public_id }]
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');

  // Ensure categories are loaded
  useEffect(() => {
    if (categories.length === 0) refreshCategories();
  }, [categories.length, refreshCategories]);

  const loadProduct = useCallback(async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      const p = res.data.data;
      setForm({
        name: p.name || '',
        description: p.description || '',
        brand: p.brand || 'Generic',
        category: p.category?._id || p.category || '',
        price: p.price ?? '',
        oldPrice: p.oldPrice ?? '',
        currency: p.currency || 'USD',
        stock: p.stock ?? 0,
        sizes: (p.sizes || []).join(', '),
        colors: (p.colors || []).join(', '),
        isFeatured: !!p.isFeatured,
        isNew: !!p.isNew,
        isActive: p.isActive !== false,
        tags: (p.tags || []).join(', '),
      });
      setImages(p.images || []);
    } catch (err) {
      toast.error(err?.message || 'Could not load product.');
      navigate('/admin/inventory');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (mode === 'edit') loadProduct();
  }, [mode, loadProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Upload each file to Cloudinary via the admin upload endpoint
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append('image', file);
          fd.append('folder', 'products');
          const res = await api.post('/api/upload/image', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data.data;
        })
      );
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded.`);
    } catch (err) {
      toast.error(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (publicId) => {
    if (mode === 'edit' && id) {
      // For existing product, also remove from server
      try {
        await api.delete(`/api/products/${id}/images/${encodeURIComponent(publicId)}`);
        setImages((prev) => prev.filter((i) => i.public_id !== publicId));
        toast.success('Image removed.');
      } catch (err) {
        toast.error(err?.message || 'Could not remove image.');
      }
    } else {
      // New product — just remove from local state
      setImages((prev) => prev.filter((i) => i.public_id !== publicId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.price === '') {
      toast.error('Name and price are required.');
      return;
    }
    if (images.length === 0) {
      if (!confirm('This product has no images. Save anyway?')) return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      brand: form.brand,
      category: form.category || null,
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
      currency: form.currency,
      stock: Number(form.stock) || 0,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isActive: form.isActive,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      images,
    };

    try {
      if (mode === 'edit') {
        await api.put(`/api/products/${id}`, payload);
        toast.success('Product updated.');
      } else {
        await api.post('/api/products', payload);
        toast.success('Product created.');
      }
      navigate('/admin/inventory');
    } catch (err) {
      toast.error(err?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="adminEmpty">Loading product…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="adminForm">
      <div className="adminPanel">
        <h3 className="adminPanelTitle">
          <Link to="/admin/inventory" className="adminBtn secondary" style={{ fontSize: 12, padding: '6px 12px' }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <div style={{ marginLeft: 'auto' }} />
          <span>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</span>
        </h3>

        <div className="adminFormRow">
          <div className="formGroup">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sky-Blue Baggy Jeans Pant"
              required
            />
          </div>
          <div className="formGroup">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Ralph Lauren"
            />
          </div>
        </div>

        <div className="formGroup">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed product description…"
          />
        </div>

        <div className="adminFormRow">
          <div className="formGroup">
            <label>Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="14.00"
              required
            />
          </div>
          <div className="formGroup">
            <label>Old Price (for discounts)</label>
            <input
              type="number"
              step="0.01"
              name="oldPrice"
              value={form.oldPrice}
              onChange={handleChange}
              placeholder="20.00"
            />
          </div>
        </div>

        <div className="adminFormRow">
          <div className="formGroup">
            <label>Stock Quantity</label>
            <input
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
          <div className="formGroup">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="adminFormRow">
          <div className="formGroup">
            <label>Sizes (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="S, M, L, XL"
            />
          </div>
          <div className="formGroup">
            <label>Colors (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={form.colors}
              onChange={handleChange}
              placeholder="Black, Blue, Brown"
            />
          </div>
        </div>

        <div className="formGroup">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="casual, summer, cotton"
          />
        </div>

        {/* Image management — THE KEY FEATURE */}
        <div className="formGroup">
          <label>Product Images</label>
          <div className="adminImageUpload">
            {images.map((img, i) => (
              <div key={img.public_id || i} className="adminImagePreview">
                <img src={img.url} alt={`Product ${i + 1}`} />
                <button
                  type="button"
                  className="removeBtn"
                  onClick={() => handleRemoveImage(img.public_id)}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="adminUploadBox">
              {uploading ? (
                <>Uploading…</>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Click to upload</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>
          {images.length === 0 && (
            <p style={{ fontSize: 12, color: '#f59e0b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ImageIcon size={12} /> This product has no images yet.
            </p>
          )}
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
            Upload multiple images. First image will be the product thumbnail. Max 5MB per image. Formats: JPG, PNG, WebP, GIF, AVIF.
          </p>
        </div>

        {/* Visibility / marketing toggles */}
        <div className="formGroup">
          <label>Visibility & Marketing</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 8 }}>
            <label className="adminToggle">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <span className="toggleSlider" />
              <span style={{ fontSize: 13 }}>Active (visible on store)</span>
            </label>
            <label className="adminToggle">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              <span className="toggleSlider" />
              <span style={{ fontSize: 13 }}>Featured (shows on home slider)</span>
            </label>
            <label className="adminToggle">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
              <span className="toggleSlider" />
              <span style={{ fontSize: 13 }}>New Arrival (shows in "New Products")</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" className="adminBtn primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : (mode === 'edit' ? 'Update Product' : 'Create Product')}
          </button>
          <Link to="/admin/inventory" className="adminBtn secondary">Cancel</Link>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
