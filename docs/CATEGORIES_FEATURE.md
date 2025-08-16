# Multi-Level Categories with Commission Management

## Overview

This feature adds a comprehensive category management system to the multi-vendor e-commerce platform with the following capabilities:

- **Multi-level hierarchy**: Support for parent-child relationships with unlimited depth
- **Commission management**: Category-specific and vendor-specific commission rates
- **Image support**: Category images with upload functionality
- **SEO optimization**: Meta tags for better search engine visibility
- **Tree view UI**: Intuitive admin interface for managing categories

## Database Schema

### Categories Table
- `id`: Unique identifier
- `name`: Category name
- `slug`: URL-friendly identifier
- `description`: Optional description
- `imageUrl`: Category image URL
- `parentId`: Reference to parent category
- `level`: Depth level in hierarchy (0 for root)
- `path`: Full path from root (e.g., "parent-id/child-id")
- `isActive`: Enable/disable category
- `displayOrder`: Sort order
- `commissionType`: PERCENTAGE or FLAT
- `commissionValue`: Commission amount
- `hasCustomCommission`: Flag for custom commission
- `metaTitle`, `metaDescription`, `metaKeywords`: SEO fields

### ProductCategory Table
Junction table for many-to-many relationship between products and categories:
- `productId`: Reference to product
- `categoryId`: Reference to category
- `isPrimary`: Flag for primary category

### VendorCategoryCommission Table
Vendor-specific commission overrides:
- `vendorId`: Reference to vendor
- `categoryId`: Reference to category
- `commissionType`: PERCENTAGE or FLAT
- `commissionValue`: Commission amount
- `isActive`: Enable/disable override

## API Endpoints

### Categories CRUD
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/tree` - Get hierarchical tree structure
- `GET /api/v1/categories/:id` - Get single category
- `GET /api/v1/categories/slug/:slug` - Get category by slug
- `POST /api/v1/categories` - Create category
- `PATCH /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category
- `POST /api/v1/categories/:id/image` - Upload category image

### Commission Management
- `POST /api/v1/categories/vendor-commission` - Set vendor-specific commission
- `GET /api/v1/categories/commission/:vendorId/:categoryId` - Get effective commission

## Commission Priority

The system uses a hierarchical commission structure:

1. **Vendor-specific category commission** (highest priority)
2. **Category default commission**
3. **Vendor default commission** (lowest priority)

## Admin Panel Features

### Category Management Page
Located at `/catalog/categories`, provides:

- **Tree View**: Expandable/collapsible hierarchy
- **Quick Actions**: Edit, delete, add subcategory
- **Commission Management**: Set category and vendor-specific rates
- **Image Upload**: Drag-and-drop or click to upload
- **Bulk Operations**: Activate/deactivate multiple categories

### Category Dialog
Comprehensive form for creating/editing categories:
- Basic information (name, slug, description)
- Parent category selection
- Image upload with preview
- Commission settings
- SEO configuration
- Status and ordering

### Commission Dialog
Dedicated interface for managing vendor-specific commissions:
- Select vendor from dropdown
- Set commission type and value
- View all vendor overrides
- Remove overrides

## Implementation Details

### Backend (NestJS)
- **Module**: `CategoriesModule` with controller and service
- **DTOs**: Input validation for create/update operations
- **Service Methods**:
  - `create()`: Creates category with auto-generated slug
  - `findAll()`: List with pagination and filtering
  - `getCategoryTree()`: Builds hierarchical structure
  - `update()`: Updates with path recalculation
  - `remove()`: Prevents deletion of categories with children/products
  - `getEffectiveCommission()`: Calculates applicable commission

### Frontend (Next.js)
- **Components**:
  - `page.tsx`: Main categories page with tree view
  - `category-dialog.tsx`: Create/edit form
  - `commission-dialog.tsx`: Vendor commission management
- **Features**:
  - Real-time updates
  - Image preview
  - Validation
  - Toast notifications

## Usage Examples

### Creating a Category
```typescript
POST /api/v1/categories
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "hasCustomCommission": true,
  "commissionType": "PERCENTAGE",
  "commissionValue": 15
}
```

### Setting Vendor Commission
```typescript
POST /api/v1/categories/vendor-commission
{
  "vendorId": "vendor-123",
  "categoryId": "category-456",
  "commissionType": "PERCENTAGE",
  "commissionValue": 12
}
```

### Getting Effective Commission
```typescript
GET /api/v1/categories/commission/vendor-123/category-456
// Returns:
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 12,
  "source": "vendor_category"
}
```

## Deployment

1. Run database migration:
   ```bash
   npx prisma migrate deploy
   ```

2. Deploy to production:
   ```bash
   ./scripts/deploy-categories.sh
   ```

3. Verify deployment:
   - Check API endpoints
   - Test admin panel
   - Upload test images

## Security Considerations

- Image upload limited to 5MB
- Supported formats: jpg, jpeg, png, gif, webp
- Slug uniqueness enforced
- Circular parent-child relationships prevented
- Deletion restricted for categories with dependencies

## Future Enhancements

1. **Bulk Import/Export**: CSV/Excel support
2. **Category Templates**: Predefined category structures
3. **Advanced Filtering**: By commission, status, level
4. **Analytics**: Category performance metrics
5. **Localization**: Multi-language support
6. **Category Attributes**: Custom fields per category