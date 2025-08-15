import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradygo/ui';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer database and relationships
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            View, edit, and manage all customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Customer management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
