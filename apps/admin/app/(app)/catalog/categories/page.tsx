"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Upload, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CategoryForm } from './components/category-form';
import { CategoryTree } from './components/category-tree';
import { ImageUpload } from './components/image-upload';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isVisible: boolean;
  commissionType: 'PERCENTAGE' | 'FLAT';
  commissionValue: number;
  inheritCommission: boolean;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
    children: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, selectedParent]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedParent) params.append('parentId', selectedParent);
      params.append('includeChildren', 'true');

      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      DRAFT: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  const getCommissionDisplay = (category: Category) => {
    if (category.inheritCommission && category.parent) {
      return `Inherited (${category.parent.commissionType === 'PERCENTAGE' ? `${category.parent.commissionValue}%` : `$${category.parent.commissionValue}`})`;
    }
    return category.commissionType === 'PERCENTAGE' 
      ? `${category.commissionValue}%` 
      : `$${category.commissionValue}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories with multi-level hierarchy and commission settings
          </p>
        </div>
        <Button onClick={handleCreateCategory} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All levels</option>
              <option value="null">Root categories</option>
              {categories.filter(c => c.level === 0).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tree')}
              >
                Tree
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'tree' ? (
        <CategoryTree
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onRefresh={fetchCategories}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Categories List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading categories...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No categories found. Create your first category to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {category.imageUrl && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                          <span className="text-sm text-muted-foreground">
                            {category.parent.name}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Root</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {category.level}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(category.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {getCommissionDisplay(category)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {category._count?.products || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {category._count?.children || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}


