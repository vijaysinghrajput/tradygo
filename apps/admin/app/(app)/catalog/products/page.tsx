import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradygo/ui';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product catalog and inventory
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            View, edit, and manage all products in your catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Product management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
