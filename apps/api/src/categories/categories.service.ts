import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { Category, CategoryStatus } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, level, slug, ...data } = createCategoryDto;

    // Check if slug already exists
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException('Category slug already exists');
    }

    // Validate parent category if provided
    let calculatedLevel = level || 0;
    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      calculatedLevel = parent.level + 1;

      // Limit category depth
      if (calculatedLevel > 5) {
        throw new BadRequestException('Maximum category depth exceeded (5 levels)');
      }
    }

    // Get the next sort order for this level/parent
    const lastCategory = await this.prisma.category.findFirst({
      where: { parentId },
      orderBy: { sortOrder: 'desc' },
    });

    const sortOrder = data.sortOrder ?? (lastCategory?.sortOrder || 0) + 10;

    return this.prisma.category.create({
      data: {
        ...data,
        slug,
        parentId,
        level: calculatedLevel,
        sortOrder,
      },
      include: {
        parent: true,
        children: {
          where: { status: CategoryStatus.ACTIVE },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });
  }

  async findAll(query: CategoryQueryDto) {
    const {
      search,
      parentId,
      level,
      status,
      isVisible,
      includeChildren,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (parentId !== undefined) {
      where.parentId = parentId === 'null' ? null : parentId;
    }

    if (level !== undefined) {
      where.level = level;
    }

    if (status) {
      where.status = status;
    }

    if (isVisible !== undefined) {
      where.isVisible = isVisible;
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          parent: true,
          children: includeChildren
            ? {
                where: { status: CategoryStatus.ACTIVE },
                orderBy: { sortOrder: 'asc' },
              }
            : false,
          _count: {
            select: {
              products: true,
              children: true,
            },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: { status: CategoryStatus.ACTIVE },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: {
                products: true,
                children: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { status: CategoryStatus.ACTIVE },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async getCategoryTree(rootId?: string): Promise<Category[]> {
    const where: any = {
      status: CategoryStatus.ACTIVE,
      isVisible: true,
    };

    if (rootId) {
      where.parentId = rootId;
    } else {
      where.parentId = null;
    }

    return this.prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { status: CategoryStatus.ACTIVE, isVisible: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { status: CategoryStatus.ACTIVE, isVisible: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                children: {
                  where: { status: CategoryStatus.ACTIVE, isVisible: true },
                  orderBy: { sortOrder: 'asc' },
                },
                _count: {
                  select: { products: true },
                },
              },
            },
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { parentId, slug, ...data } = updateCategoryDto;

    // Check slug uniqueness if changing
    if (slug && slug !== category.slug) {
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (existingSlug) {
        throw new ConflictException('Category slug already exists');
      }
    }

    // Validate parent change
    let calculatedLevel = category.level;
    if (parentId !== undefined && parentId !== category.parentId) {
      if (parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: parentId },
        });

        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }

        // Check for circular dependency
        const isCircular = await this.checkCircularDependency(id, parentId);
        if (isCircular) {
          throw new BadRequestException('Circular dependency detected');
        }

        calculatedLevel = parent.level + 1;

        if (calculatedLevel > 5) {
          throw new BadRequestException('Maximum category depth exceeded (5 levels)');
        }
      } else {
        calculatedLevel = 0;
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
        ...(parentId !== undefined && { parentId }),
        level: calculatedLevel,
      },
      include: {
        parent: true,
        children: {
          where: { status: CategoryStatus.ACTIVE },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });
  }

  async updateSortOrder(updates: { id: string; sortOrder: number }[]): Promise<void> {
    await this.prisma.$transaction(
      updates.map(({ id, sortOrder }) =>
        this.prisma.category.update({
          where: { id },
          data: { sortOrder },
        }),
      ),
    );
  }

  async remove(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has children
    if (category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    // Check if category has products
    if (category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with products');
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  private async checkCircularDependency(categoryId: string, parentId: string): Promise<boolean> {
    let currentParentId = parentId;

    while (currentParentId) {
      if (currentParentId === categoryId) {
        return true;
      }

      const parent = await this.prisma.category.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });

      currentParentId = parent?.parentId;
    }

    return false;
  }

  async getCategoryPath(categoryId: string): Promise<Category[]> {
    const path: Category[] = [];
    let currentId = categoryId;

    while (currentId) {
      const category = await this.prisma.category.findUnique({
        where: { id: currentId },
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
        },
      });

      if (!category) break;

      path.unshift(category as Category);
      currentId = category.parentId;
    }

    return path;
  }
}