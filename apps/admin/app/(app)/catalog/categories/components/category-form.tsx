"use client";

import { useState, useEffect } from 'react';
import { X, Upload, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from './image-upload';

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
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function CategoryForm({ category, categories, onSubmit, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    iconUrl: '',
    parentId: '',
    status: 'ACTIVE' as const,
    isVisible: true,
    commissionType: 'PERCENTAGE' as const,
    commissionValue: 0,
    inheritCommission: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        iconUrl: category.iconUrl || '',
        parentId: category.parentId || '',
        status: category.status,
        isVisible: category.isVisible,
        commissionType: category.commissionType,
        commissionValue: category.commissionValue,
        inheritCommission: category.inheritCommission,
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        metaKeywords: category.metaKeywords || '',
      });
    }
  }, [category]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: !category ? generateSlug(name) : prev.slug,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Category slug is required';
    }

    if (formData.commissionValue < 0) {
      newErrors.commissionValue = 'Commission value cannot be negative';
    }

    if (formData.commissionType === 'PERCENTAGE' && formData.commissionValue > 100) {
      newErrors.commissionValue = 'Percentage cannot exceed 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableParents = categories.filter(cat => 
    cat.id !== category?.id && 
    cat.level < 4 && // Limit depth
    !isDescendant(cat.id, category?.id)
  );

  const isDescendant = (parentId: string, categoryId?: string): boolean => {
    if (!categoryId) return false;
    
    const parent = categories.find(c => c.id === parentId);
    if (!parent) return false;
    
    if (parent.parentId === categoryId) return true;
    if (parent.parentId) return isDescendant(parent.parentId, categoryId);
    
    return false;
  };

  const getParentCommission = () => {
    if (!formData.parentId) return null;
    const parent = categories.find(c => c.id === formData.parentId);
    return parent;
  };

  const parentCommission = getParentCommission();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select 
                    value={formData.parentId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Parent (Root Category)</SelectItem>
                      {availableParents.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {'  '.repeat(cat.level)} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
                />
                <Label htmlFor="isVisible">Visible to customers</Label>
              </div>
            </TabsContent>

            <TabsContent value="commission" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parentCommission && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="inheritCommission"
                        checked={formData.inheritCommission}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inheritCommission: checked }))}
                      />
                      <Label htmlFor="inheritCommission">
                        Inherit from parent ({parentCommission.commissionType === 'PERCENTAGE' 
                          ? `${parentCommission.commissionValue}%` 
                          : `$${parentCommission.commissionValue}`})
                      </Label>
                    </div>
                  )}

                  {(!formData.inheritCommission || !parentCommission) && (
                    <>
                      <div className="space-y-2">
                        <Label>Commission Type</Label>
                        <Select 
                          value={formData.commissionType} 
                          onValueChange={(value: any) => setFormData(prev => ({ ...prev, commissionType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">
                              <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4" />
                                Percentage
                              </div>
                            </SelectItem>
                            <SelectItem value="FLAT">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Fixed Amount
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commissionValue">
                          Commission Value {formData.commissionType === 'PERCENTAGE' ? '(%)' : '($)'}
                        </Label>
                        <Input
                          id="commissionValue"
                          type="number"
                          min="0"
                          max={formData.commissionType === 'PERCENTAGE' ? 100 : undefined}
                          step={formData.commissionType === 'PERCENTAGE' ? 0.1 : 0.01}
                          value={formData.commissionValue}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            commissionValue: parseFloat(e.target.value) || 0 
                          }))}
                          className={errors.commissionValue ? 'border-red-500' : ''}
                        />
                        {errors.commissionValue && (
                          <p className="text-sm text-red-500">{errors.commissionValue}</p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Category Image</Label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    placeholder="Upload category image"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category Icon</Label>
                  <ImageUpload
                    value={formData.iconUrl}
                    onChange={(url) => setFormData(prev => ({ ...prev, iconUrl: url }))}
                    placeholder="Upload category icon"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="SEO title for this category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="SEO description for this category"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                    placeholder="SEO keywords separated by commas"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}