import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradygo/ui';

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Banner</h1>
        <p className="text-muted-foreground">
          Create a new promotional banner
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Banner Creation</CardTitle>
          <CardDescription>
            Design and configure promotional banners for your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Banner creation functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
