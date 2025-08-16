'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { Textarea } from '@ui/components/ui/textarea';
import { Switch } from '@ui/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any;
  isCreateMode: boolean;
  onSuccess: () => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  isCreateMode,
  onSuccess,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parentId: '',
    isActive: true,
    displayOrder: 0,
    hasCustomCommission: false,
    commissionType: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT',
    commissionValue: 0,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        parentId: category.parentId || '',
        isActive: category.isActive ?? true,
        displayOrder: category.displayOrder || 0,
        hasCustomCommission: category.hasCustomCommission || false,
        commissionType: category.commissionType || 'PERCENTAGE',
        commissionValue: category.commissionValue || 0,
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        metaKeywords: category.metaKeywords || '',
      });
      setImagePreview(category.imageUrl || '');
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        parentId: '',
        isActive: true,
        displayOrder: 0,
        hasCustomCommission: false,
        commissionType: 'PERCENTAGE',
        commissionValue: 0,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (categoryId: string) => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${categoryId}/image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isCreateMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${category?.id}`;

      const method = isCreateMode ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      const savedCategory = await response.json();

      // Upload image if selected
      if (imageFile) {
        await uploadImage(savedCategory.id);
      }

      toast.success(`Category ${isCreateMode ? 'created' : 'updated'} successfully`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(`Failed to ${isCreateMode ? 'create' : 'update'} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? 'Create Category' : 'Edit Category'}
            </DialogTitle>
            <DialogDescription>
              {isCreateMode
                ? 'Add a new category to your catalog'
                : 'Update the category information'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Category"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        setFormData({ ...formData, imageUrl: '' });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Commission Settings</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasCustomCommission"
                  checked={formData.hasCustomCommission}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hasCustomCommission: checked })
                  }
                />
                <Label htmlFor="hasCustomCommission">Use Custom Commission</Label>
              </div>

              {formData.hasCustomCommission && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionType">Commission Type</Label>
                    <Select
                      value={formData.commissionType}
                      onValueChange={(value: 'PERCENTAGE' | 'FLAT') =>
                        setFormData({ ...formData, commissionType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FLAT">Flat Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commissionValue">Commission Value</Label>
                    <Input
                      id="commissionValue"
                      type="number"
                      step="0.01"
                      value={formData.commissionValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">SEO Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isCreateMode ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}