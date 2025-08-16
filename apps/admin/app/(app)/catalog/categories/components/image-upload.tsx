"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, placeholder = "Upload image", className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // In a real implementation, you would upload to your storage service
      // For now, we'll create a temporary URL
      const imageUrl = URL.createObjectURL(file);
      onChange(imageUrl);

      // TODO: Implement actual file upload to your storage service
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // onChange(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={handleClick}
            disabled={uploading}
          >
            Change
          </Button>
        </div>
      ) : (
        <Card
          className={`
            relative h-48 border-2 border-dashed cursor-pointer transition-colors
            ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!uploading ? handleClick : undefined}
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">{placeholder}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}