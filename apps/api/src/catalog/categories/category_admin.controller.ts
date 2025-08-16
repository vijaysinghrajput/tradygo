import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('admin/categories')
@ApiBearerAuth()
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'List categories' })
  @ApiQuery({ name: 'tree', required: false, type: Boolean })
  async list(@Query('tree') tree?: string) {
    if (String(tree) === '1' || String(tree) === 'true') {
      return this.categoryService.listTree();
    }
    return this.categoryService.listAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiQuery({ name: 'cascade', required: false, type: Boolean })
  async remove(@Param('id') id: string, @Query('cascade') cascade?: string) {
    const doCascade = String(cascade) === '1' || String(cascade) === 'true';
    return this.categoryService.remove(id, doCascade);
  }
}