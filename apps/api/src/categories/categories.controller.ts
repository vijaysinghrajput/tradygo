import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CommissionType } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a new category
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Upload category image
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `category-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/categories/${file.filename}`;
    return this.categoriesService.update(id, { imageUrl });
  }

  // Get all categories
  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('parentId') parentId?: string,
    @Query('isActive') isActive?: string,
    @Query('includeChildren') includeChildren?: string,
  ) {
    return this.categoriesService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where: {
        ...(parentId && { parentId }),
        ...(isActive && { isActive: isActive === 'true' }),
      },
      includeChildren: includeChildren === 'true',
    });
  }

  // Get category tree
  @Get('tree')
  getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  // Get category by slug
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // Get single category
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // Update category
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Delete category
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  // Set vendor-specific commission for a category
  @Post('vendor-commission')
  async setVendorCategoryCommission(
    @Body() body: {
      vendorId: string;
      categoryId: string;
      commissionType: CommissionType;
      commissionValue: number;
    },
  ) {
    const { vendorId, categoryId, commissionType, commissionValue } = body;
    
    if (commissionValue < 0 || commissionValue > 100) {
      throw new BadRequestException('Commission value must be between 0 and 100');
    }
    
    await this.categoriesService.setVendorCategoryCommission(
      vendorId,
      categoryId,
      commissionType,
      commissionValue,
    );
    
    return { message: 'Vendor category commission updated successfully' };
  }

  // Get effective commission for vendor-category
  @Get('commission/:vendorId/:categoryId')
  getEffectiveCommission(
    @Param('vendorId') vendorId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoriesService.getEffectiveCommission(vendorId, categoryId);
  }
}