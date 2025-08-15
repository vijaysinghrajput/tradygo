import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradygo/ui';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System administration and configuration
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Administration</CardTitle>
          <CardDescription>
            Manage system settings, users, and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Admin functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
