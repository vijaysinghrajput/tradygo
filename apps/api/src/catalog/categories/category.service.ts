import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  defaultCommissionType: string;
  defaultCommissionValue: string | number;
  createdAt: Date;
  updatedAt: Date;
  children?: CategoryNode[];
}

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async listAll(): Promise<any[]> {
    try {
      return (this.prisma as any).category.findMany({
        orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch categories');
    }
  }

  async listTree(): Promise<CategoryNode[]> {
    const categories = await this.listAll();
    const byId: Record<string, CategoryNode> = {};
    const roots: CategoryNode[] = [];

    for (const c of categories) {
      byId[c.id] = { ...c, children: [] };
    }

    for (const c of categories) {
      const node = byId[c.id];
      if (c.parentId && byId[c.parentId]) {
        byId[c.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    }

    // sort children by sortOrder then name
    const sortRecursive = (nodes: CategoryNode[]) => {
      nodes.sort((a, b) => (a.sortOrder - b.sortOrder) || a.name.localeCompare(b.name));
      for (const n of nodes) {
        if (n.children && n.children.length > 0) sortRecursive(n.children);
      }
    };
    sortRecursive(roots);
    return roots;
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await (this.prisma as any).category.create({ data: dto });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('Slug must be unique');
      }
      if (error?.code === 'P2003') {
        throw new BadRequestException('Invalid parent category');
      }
      throw new BadRequestException('Failed to create category');
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      return await (this.prisma as any).category.update({ where: { id }, data: dto });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      if (error?.code === 'P2002') {
        throw new BadRequestException('Slug must be unique');
      }
      throw new BadRequestException('Failed to update category');
    }
  }

  async remove(id: string, cascade = false) {
    // Check for children
    const childCount = await (this.prisma as any).category.count({ where: { parentId: id } });
    if (childCount > 0 && !cascade) {
      throw new BadRequestException('Category has subcategories. Delete or move them first, or enable cascade.');
    }

    if (cascade) {
      // delete recursively
      const children = await (this.prisma as any).category.findMany({ where: { parentId: id }, select: { id: true } });
      for (const child of children) {
        await this.remove(child.id, true);
      }
    }

    try {
      return await (this.prisma as any).category.delete({ where: { id } });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      throw new BadRequestException('Failed to delete category');
    }
  }
}