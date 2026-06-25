import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Upload, X, Tags, Package, Hash,
  AlertTriangle,
} from 'lucide-react';
import api from '../../../api/axios';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';

const EMPTY = { name: '', icon: '', isActive: true, order: 0 };

const Categories = () => {
  const { categories, refreshCategories } = useApp();
  const [editing, setEditing] = useState(null); // { _id } or null
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null); // { url, public_id }
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    await refreshCategories();
  }, [refreshCategories]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon || '', isActive: cat.isActive !== false, order: cat.order || 0 });
    setImage(cat.image || null);
  };

  const startNew = () => {
    setEditing({});
    setForm(EMPTY);
    setImage(null);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setImage(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'categories');
      const res = await api.post('/api/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(res.data.data);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required.');
      return;
    }
    setSaving(true);
    const payload = { ...form, order: Number(form.order) || 0, image: image || undefined };
    try {
      if (editing?._id) {
        await api.put(`/api/categories/${editing._id}`, payload);
        toast.success('Category updated.');
      } else {
        await api.post('/api/categories', payload);
        toast.success('Category created.');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/categories/${deleteTarget._id}`);
      toast.success('Category deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err?.message || 'Delete failed.');
    }
  };

  // Toggle category active/hidden status directly from the card dropdown
  const handleStatusChange = async (cat, newIsActive) => {
    const nextActive = newIsActive === 'true';
    try {
      await api.put(`/api/categories/${cat._id}`, { isActive: nextActive });
      toast.success(`Category marked as ${nextActive ? 'Active' : 'Hidden'}`);
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="adminPanel">
      <h3 className="adminPanelTitle">
        <span>
          <Tags size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: '#10B981' }} />
          Categories ({categories.length})
        </span>
        <button className="adminBtn primary" onClick={startNew}>
          <Plus size={16} /> Add Category
        </button>
      </h3>

      {/* Form (inline, shown when editing or creating) */}
      {editing && (
        <form onSubmit={handleSave} className="adminForm categoryForm" style={{
          padding: 16, borderRadius: 8, marginBottom: 16,
        }}>
          <div className="adminFormRow">
            <div className="formGroup">
              <label>Name *</label>
              <input type="text" name="name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="formGroup">
              <label>Icon (emoji or short text)</label>
              <input type="text" name="icon" value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. 👕 or shirt" />
            </div>
          </div>

          <div className="adminFormRow">
            <div className="formGroup">
              <label>Display Order</label>
              <input type="number" name="order" value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
            <div className="formGroup">
              <label>Active</label>
              <label className="adminToggle" style={{ marginTop: 8 }}>
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <span className="toggleSlider" />
                <span style={{ fontSize: 13 }}>{form.isActive ? 'Visible' : 'Hidden'}</span>
              </label>
            </div>
          </div>

          <div className="formGroup">
            <label>Category Image</label>
            <div className="adminImageUpload">
              {image && (
                <div className="adminImagePreview">
                  <img src={image.url} alt="Category" />
                  <button type="button" className="removeBtn" onClick={() => setImage(null)}>
                    <X size={14} />
                  </button>
                </div>
              )}
              <label className="adminUploadBox">
                {uploading ? 'Uploading…' : (<><Upload size={24} /><span>Click to upload</span></>)}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile}
                  style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="adminBtn primary" disabled={saving}>
              {saving ? 'Saving…' : (editing._id ? 'Update Category' : 'Create Category')}
            </button>
            <button type="button" className="adminBtn secondary" onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}

      {/* Categories grid */}
      {categories.length === 0 ? (
        <div className="adminEmpty">
          <Package size={48} />
          <p>No categories yet. Click "Add Category" to create one.</p>
        </div>
      ) : (
        <div className="categoryGrid">
          {categories.map((c) => {
            const isActive = c.isActive !== false;
            return (
              <div key={c._id} className="categoryCard">
                {/* Top row: icon badge + action buttons */}
                <div className="categoryCardTop">
                  <div className="categoryCardIconBadge" title="Category">
                    <Package size={18} />
                  </div>
                  <div className="categoryCardActions">
                    <button className="actionBtn" onClick={() => startEdit(c)} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button className="actionBtn danger" onClick={() => setDeleteTarget(c)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Category image */}
                <div className="categoryCardImgWrap">
                  {c.image?.url ? (
                    <img src={c.image.url} alt={c.name} />
                  ) : (
                    <div className="categoryCardImgPlaceholder">
                      {c.icon || '📦'}
                    </div>
                  )}
                </div>

                {/* Category name */}
                <div className="categoryCardName" title={c.name}>{c.name}</div>

                {/* Meta info: order number */}
                <div className="categoryCardMeta">
                  <Hash size={12} />
                  <span>Order: {c.order || 0}</span>
                </div>

                {/* Status dropdown — styled like the reference design */}
                <select
                  value={String(isActive)}
                  onChange={(e) => handleStatusChange(c, e.target.value)}
                  className={`adminCatStatusSelect ${isActive ? 'is-active' : 'is-hidden'}`}
                  title="Change category status"
                >
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 16,
        }}>
          <div className="categoryModal" style={{
            borderRadius: 12, padding: 24, maxWidth: 400, width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#fee2e2', color: '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Delete category?</h4>
            </div>
            <p style={{ marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}>
              Delete <strong>"{deleteTarget.name}"</strong>? Products in this category will not be deleted but will lose their category reference.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="adminBtn secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="adminBtn danger" onClick={handleDelete}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
