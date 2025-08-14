import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export interface UploadedFile {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
}

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
  ];

  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  /**
   * Validate uploaded file
   */
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`
      );
    }
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalName: string): string {
    const ext = extname(originalName);
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `${timestamp}-${randomString}${ext}`;
  }

  /**
   * Upload file to storage (simplified implementation)
   * In production, this would upload to AWS S3, Google Cloud Storage, etc.
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'kyc'): Promise<UploadedFile> {
    this.validateFile(file);

    const filename = this.generateFilename(file.originalname);
    
    // In a real implementation, you would:
    // 1. Upload to cloud storage (AWS S3, Google Cloud, etc.)
    // 2. Return the actual URL from the cloud provider
    // 3. Store file metadata in database if needed
    
    // For now, we'll simulate the upload and return a mock URL
    const mockUrl = `https://storage.tradygo.com/${folder}/${filename}`;
    
    return {
      originalName: file.originalname,
      filename,
      mimetype: file.mimetype,
      size: file.size,
      url: mockUrl,
    };
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[], 
    folder: string = 'kyc'
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete file from storage
   */
  async deleteFile(url: string): Promise<void> {
    // In a real implementation, you would:
    // 1. Extract the file key/path from the URL
    // 2. Delete from cloud storage
    // 3. Remove from database if needed
    
    console.log(`File deleted: ${url}`);
  }

  /**
   * Get file info from URL
   */
  getFileInfoFromUrl(url: string): { filename: string; folder: string } {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    
    return { filename, folder };
  }

  /**
   * Generate presigned URL for direct upload (for frontend)
   */
  async generatePresignedUrl(
    filename: string, 
    mimetype: string, 
    folder: string = 'kyc'
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    // Validate mimetype
    if (!this.allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    const generatedFilename = this.generateFilename(filename);
    
    // In a real implementation with AWS S3:
    // const uploadUrl = await s3.getSignedUrl('putObject', {
    //   Bucket: 'your-bucket',
    //   Key: `${folder}/${generatedFilename}`,
    //   ContentType: mimetype,
    //   Expires: 3600 // 1 hour
    // });
    
    const uploadUrl = `https://storage.tradygo.com/upload/${folder}/${generatedFilename}`;
    const fileUrl = `https://storage.tradygo.com/${folder}/${generatedFilename}`;
    
    return { uploadUrl, fileUrl };
  }

  /**
   * Validate KYC document type
   */
  validateKycDocumentType(docType: string): boolean {
    const validKycTypes = [
      'GST_CERTIFICATE',
      'PAN_CARD', 
      'AADHAAR_CARD',
      'INCORPORATION_CERTIFICATE',
      'CANCELLED_CHEQUE',
      'BANK_STATEMENT',
      'OTHER'
    ];
    
    return validKycTypes.includes(docType);
  }

  /**
   * Get file extension from mimetype
   */
  getExtensionFromMimetype(mimetype: string): string {
    const mimetypeMap: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
    };
    
    return mimetypeMap[mimetype] || '';
  }

  /**
   * Check if file is an image
   */
  isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  /**
   * Check if file is a PDF
   */
  isPdf(mimetype: string): boolean {
    return mimetype === 'application/pdf';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}