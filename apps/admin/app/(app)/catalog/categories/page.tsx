'use client';

import { useState, useEffect } from 'react';
import { Button } from '@ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Image } from 'lucide-react';
import { CategoryDialog } from './category-dialog';
import { CommissionDialog } from './commission-dialog';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  displayOrder: number;
  commissionType: 'PERCENTAGE' | 'FLAT';
  commissionValue: number;
  hasCustomCommission: boolean;
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/tree`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCreate = (parentCategory?: Category) => {
    setSelectedCategory(parentCategory ? { ...parentCategory, parentId: parentCategory.id } : null);
    setIsCreateMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsCreateMode(false);
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }

      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleCommission = (category: Category) => {
    setSelectedCategory(category);
    setIsCommissionDialogOpen(true);
  };

  const renderCategory = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="mb-2">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 ${
            depth > 0 ? `ml-${depth * 6}` : ''
          }`}
          style={{ marginLeft: depth * 24 }}
        >
          <button
            onClick={() => hasChildren && toggleExpand(category.id)}
            className="p-1 hover:bg-gray-200 rounded"
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <Image className="w-5 h-5 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{category.name}</h3>
              <span className="text-xs text-gray-500">({category.slug})</span>
              {!category.isActive && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Inactive</span>
              )}
              {category.hasCustomCommission && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {category.commissionType === 'PERCENTAGE' ? `${category.commissionValue}%` : `₹${category.commissionValue}`}
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCommission(category)}
              title="Manage Commission"
            >
              ₹
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCreate(category)}
              title="Add Subcategory"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(category)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Category Management</CardTitle>
          <Button onClick={() => handleCreate()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map(category => renderCategory(category))}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        isCreateMode={isCreateMode}
        onSuccess={fetchCategories}
      />

      <CommissionDialog
        open={isCommissionDialogOpen}
        onOpenChange={setIsCommissionDialogOpen}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}


