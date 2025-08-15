import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradygo/ui';

export default function SellersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sellers</h1>
        <p className="text-muted-foreground">
          Manage all seller accounts and onboarding
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Seller Management</CardTitle>
          <CardDescription>
            View, edit, and manage all seller accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Seller management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
