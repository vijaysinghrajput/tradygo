'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  defaultCommissionType: 'PERCENTAGE' | 'FLAT';
  defaultCommissionValue: number;
  children?: CategoryNode[];
}

function CategoryItem({ node, onEdit, onDelete }: { node: CategoryNode; onEdit: (n: CategoryNode) => void; onDelete: (n: CategoryNode) => void }) {
  return (
    <div className="border rounded p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            {node.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={node.imageUrl} alt={node.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-500">No image</span>
            )}
          </div>
          <div>
            <div className="font-medium">{node.name}</div>
            <div className="text-xs text-gray-500">{node.slug}</div>
            <div className="text-xs text-gray-500">Commission: {node.defaultCommissionType} {node.defaultCommissionValue}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-2 py-1 text-sm border rounded" onClick={() => onEdit(node)}>Edit</button>
          <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => onDelete(node)}>Delete</button>
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="pl-6 mt-2">
          {node.children.map((child) => (
            <CategoryItem key={child.id} node={child} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<CategoryNode> & { parentId?: string | null }>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parentId: null,
    sortOrder: 0,
    isActive: true,
    defaultCommissionType: 'PERCENTAGE',
    defaultCommissionValue: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchTree() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/categories?tree=1', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load');
      setTree(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTree();
  }, []);

  function resetForm() {
    setForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentId: null,
      sortOrder: 0,
      isActive: true,
      defaultCommissionType: 'PERCENTAGE',
      defaultCommissionValue: 0,
    });
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      imageUrl: form.imageUrl,
      parentId: form.parentId || undefined,
      sortOrder: form.sortOrder ?? 0,
      isActive: form.isActive ?? true,
      defaultCommissionType: form.defaultCommissionType,
      defaultCommissionValue: form.defaultCommissionValue,
    };

    const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.message || 'Save failed');
      return;
    }
    resetForm();
    fetchTree();
  }

  async function handleDelete(node: CategoryNode) {
    if (!confirm(`Delete category "${node.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${node.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data?.message || 'Delete failed');
      return;
    }
    fetchTree();
  }

  function handleEdit(node: CategoryNode) {
    setEditingId(node.id);
    setForm({
      name: node.name,
      slug: node.slug,
      description: node.description || '',
      imageUrl: node.imageUrl || '',
      parentId: node.parentId || null,
      sortOrder: node.sortOrder,
      isActive: node.isActive,
      defaultCommissionType: node.defaultCommissionType,
      defaultCommissionValue: Number(node.defaultCommissionValue || 0),
    });
  }

  async function handleUpload(file: File) {
    const params = new URLSearchParams({});
    const res = await fetch('/api/admin/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'categories', filename: file.name, contentType: file.type }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || 'Failed to sign upload');
      return;
    }
    await fetch(data.url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    setForm((prev) => ({ ...prev, imageUrl: data.publicUrl }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Category Tree</h2>
            <button className="px-2 py-1 text-sm border rounded" onClick={fetchTree}>Refresh</button>
          </div>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div>
              {tree.map((node) => (
                <CategoryItem key={node.id} node={node} onEdit={handleEdit} onDelete={handleDelete} />)
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">{editingId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full border rounded px-3 py-2" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Slug</label>
              <input className="w-full border rounded px-3 py-2" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea className="w-full border rounded px-3 py-2" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Parent Category ID (optional)</label>
              <input className="w-full border rounded px-3 py-2" value={form.parentId || ''} onChange={(e) => setForm({ ...form, parentId: e.target.value || null })} placeholder="Leave empty for root" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Sort Order</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={Number(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Active</label>
                <select className="w-full border rounded px-3 py-2" value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Commission Type</label>
                <select className="w-full border rounded px-3 py-2" value={form.defaultCommissionType || 'PERCENTAGE'} onChange={(e) => setForm({ ...form, defaultCommissionType: e.target.value as any })}>
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FLAT">FLAT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Commission Value</label>
                <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={Number(form.defaultCommissionValue || 0)} onChange={(e) => setForm({ ...form, defaultCommissionValue: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Image</label>
              <div className="flex items-center gap-3">
                <input className="w-full border rounded px-3 py-2" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                <input type="file" accept="image/*" onChange={(e) => e.target.files && e.target.files[0] && handleUpload(e.target.files[0])} />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded" type="submit">{editingId ? 'Update' : 'Create'}</button>
              {editingId && (
                <button className="px-4 py-2 border rounded" type="button" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


