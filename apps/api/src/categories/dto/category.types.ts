import { Category } from '@prisma/client';

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  parent?: Category;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  level: number;
  imageUrl?: string;
  isActive: boolean;
  hasCustomCommission: boolean;
  commissionType: string;
  commissionValue: number;
  children: CategoryTreeNode[];
}