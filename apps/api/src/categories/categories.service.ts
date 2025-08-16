import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category, CommissionType } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto, CategoryWithChildren } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Create a new category
  async create(data: CreateCategoryDto): Promise<Category> {
    const { parentId, ...categoryData } = data;
    
    // Generate slug from name if not provided
    const slug = data.slug || this.generateSlug(data.name);
    
    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });
    
    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists');
    }
    
    let level = 0;
    let path = '';
    
    // If parent category is specified, validate and get parent info
    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      });
      
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      
      level = parent.level + 1;
      path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
    }
    
    return this.prisma.category.create({
      data: {
        ...categoryData,
        slug,
        parentId,
        level,
        path,
      },
    });
  }

  // Get all categories with optional filtering
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
    includeChildren?: boolean;
  }): Promise<Category[]> {
    const { skip, take, where, orderBy, includeChildren } = params || {};
    
    return this.prisma.category.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { displayOrder: 'asc' },
      include: includeChildren ? {
        children: {
          orderBy: { displayOrder: 'asc' },
        },
      } : undefined,
    });
  }

  // Get category tree (hierarchical structure)
  async getCategoryTree(): Promise<CategoryWithChildren[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });
    
    // Return only root categories (parentId is null)
    return categories.filter(cat => !cat.parentId) as CategoryWithChildren[];
  }

  // Get a single category by ID
  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { displayOrder: 'asc' },
        },
        vendorCommissions: {
          where: { isActive: true },
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  // Get category by slug
  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  // Update a category
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    
    // If changing parent, update level and path
    if (data.parentId !== undefined && data.parentId !== category.parentId) {
      let level = 0;
      let path = '';
      
      if (data.parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: data.parentId },
        });
        
        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }
        
        // Prevent circular reference
        if (await this.isDescendant(id, data.parentId)) {
          throw new BadRequestException('Cannot set a descendant as parent');
        }
        
        level = parent.level + 1;
        path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
      }
      
      // Update all descendants' level and path
      await this.updateDescendants(id, level, path);
      
      data = { ...data, level, path };
    }
    
    // If slug is being updated, check for uniqueness
    if (data.slug && data.slug !== category.slug) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug: data.slug },
      });
      
      if (existingCategory) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }
    
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // Delete a category
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    
    // Check if category has children
    const childrenCount = await this.prisma.category.count({
      where: { parentId: id },
    });
    
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete category with children');
    }
    
    // Check if category has products
    const productsCount = await this.prisma.productCategory.count({
      where: { categoryId: id },
    });
    
    if (productsCount > 0) {
      throw new BadRequestException('Cannot delete category with products');
    }
    
    await this.prisma.category.delete({
      where: { id },
    });
  }

  // Set vendor-specific commission for a category
  async setVendorCategoryCommission(
    vendorId: string,
    categoryId: string,
    commissionType: CommissionType,
    commissionValue: number,
  ): Promise<void> {
    await this.prisma.vendorCategoryCommission.upsert({
      where: {
        vendorId_categoryId: {
          vendorId,
          categoryId,
        },
      },
      update: {
        commissionType,
        commissionValue,
        isActive: true,
      },
      create: {
        vendorId,
        categoryId,
        commissionType,
        commissionValue,
      },
    });
  }

  // Get effective commission for a vendor-category combination
  async getEffectiveCommission(vendorId: string, categoryId: string): Promise<{
    commissionType: CommissionType;
    commissionValue: number;
    source: 'vendor_category' | 'category' | 'vendor_default';
  }> {
    // First check vendor-specific category commission
    const vendorCategoryCommission = await this.prisma.vendorCategoryCommission.findUnique({
      where: {
        vendorId_categoryId: {
          vendorId,
          categoryId,
        },
        isActive: true,
      },
    });
    
    if (vendorCategoryCommission) {
      return {
        commissionType: vendorCategoryCommission.commissionType,
        commissionValue: vendorCategoryCommission.commissionValue.toNumber(),
        source: 'vendor_category',
      };
    }
    
    // Then check category commission
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    
    if (category?.hasCustomCommission) {
      return {
        commissionType: category.commissionType,
        commissionValue: category.commissionValue.toNumber(),
        source: 'category',
      };
    }
    
    // Finally, use vendor default commission
    const vendorSettings = await this.prisma.vendorSetting.findUnique({
      where: { vendorId },
    });
    
    if (vendorSettings) {
      return {
        commissionType: vendorSettings.defaultCommissionType,
        commissionValue: vendorSettings.defaultCommissionValue.toNumber(),
        source: 'vendor_default',
      };
    }
    
    // If no commission found, return default
    return {
      commissionType: CommissionType.PERCENTAGE,
      commissionValue: 0,
      source: 'vendor_default',
    };
  }

  // Helper: Generate slug from name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }

  // Helper: Check if a category is a descendant of another
  private async isDescendant(childId: string, potentialAncestorId: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: childId },
    });
    
    if (!category) return false;
    
    // Check if potentialAncestorId is in the path
    return category.path.includes(potentialAncestorId);
  }

  // Helper: Update descendants when a category's parent changes
  private async updateDescendants(categoryId: string, newLevel: number, newPath: string): Promise<void> {
    const descendants = await this.prisma.category.findMany({
      where: {
        path: {
          contains: categoryId,
        },
      },
    });
    
    for (const descendant of descendants) {
      const oldPath = descendant.path;
      const newDescendantPath = oldPath.replace(
        new RegExp(`^.*${categoryId}`),
        newPath ? `${newPath}/${categoryId}` : categoryId,
      );
      
      const levelDiff = newLevel - (await this.findOne(categoryId)).level;
      
      await this.prisma.category.update({
        where: { id: descendant.id },
        data: {
          level: descendant.level + levelDiff + 1,
          path: newDescendantPath,
        },
      });
    }
  }
}