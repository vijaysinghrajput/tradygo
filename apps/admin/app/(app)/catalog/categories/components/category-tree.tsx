"use client";

import { useState } from 'react';
import { ChevronRight, ChevronDown, Edit, Trash2, MoreHorizontal, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

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

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onRefresh: () => void;
}

interface TreeNodeProps {
  category: Category;
  children: Category[];
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onMove: (categoryId: string, newParentId: string | null, newSortOrder: number) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (categoryId: string) => void;
}

function TreeNode({ 
  category, 
  children, 
  level, 
  onEdit, 
  onDelete, 
  onMove, 
  expandedNodes, 
  onToggleExpand 
}: TreeNodeProps) {
  const [dragOver, setDragOver] = useState(false);
  const [dragging, setDragging] = useState(false);

  const isExpanded = expandedNodes.has(category.id);
  const hasChildren = children.length > 0;

  const handleDragStart = (e: React.DragEvent) => {
    setDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: category.id,
      name: category.name,
      level: category.level,
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Prevent dropping on itself or its descendants
      if (dragData.id === category.id) return;
      
      // Prevent deep nesting (limit to 5 levels)
      if (category.level >= 4) return;
      
      // Move the category
      onMove(dragData.id, category.id, 0);
    } catch (error) {
      console.error('Failed to handle drop:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      DRAFT: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} className="text-xs">
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
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 p-3 border rounded-lg transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}
          ${dragging ? 'opacity-50' : ''}
          hover:bg-muted/50
        `}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpand(category.id)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-6 h-6 rounded object-cover"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{category.name}</span>
              {getStatusBadge(category.status)}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span>Level {category.level}</span>
              <span>Products: {category._count?.products || 0}</span>
              <span>Commission: {getCommissionDisplay(category)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Move className="h-4 w-4 text-muted-foreground cursor-move" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(category.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              children={child.children || []}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree({ categories, onEdit, onDelete, onRefresh }: CategoryTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Build tree structure
  const buildTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    // Sort categories by sortOrder
    const sortCategories = (cats: Category[]) => {
      cats.sort((a, b) => a.sortOrder - b.sortOrder);
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });
    };

    sortCategories(rootCategories);
    return rootCategories;
  };

  const tree = buildTree(categories);

  const handleToggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleMove = async (categoryId: string, newParentId: string | null, newSortOrder: number) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentId: newParentId,
          sortOrder: newSortOrder,
        }),
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to move category');
      }
    } catch (error) {
      console.error('Failed to move category:', error);
      alert('Failed to move category');
    }
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (cats: Category[]) => {
      cats.forEach(cat => {
        allIds.add(cat.id);
        if (cat.children && cat.children.length > 0) {
          collectIds(cat.children);
        }
      });
    };
    collectIds(tree);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Category Tree</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tree.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {tree.map((category) => (
              <TreeNode
                key={category.id}
                category={category}
                children={category.children || []}
                level={0}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={handleMove}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}