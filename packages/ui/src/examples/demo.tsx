import * as React from 'react';
import {
  Button,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Checkbox,
  Switch,
  Progress,
  Spinner,
  Stat,
  Container,
  Section,
  PageHeader,
  PageTitle,
  Breadcrumbs,
} from '../index';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import type { CheckedState } from '@radix-ui/react-checkbox';

export function ComponentDemo() {
  const [checked, setChecked] = React.useState<CheckedState>(false);
  const [switched, setSwitched] = React.useState(false);
  const [progress, setProgress] = React.useState(65);

  return (
    <div className="min-h-screen bg-background">
      <Container size="lg">
        <Section spacing="lg">
          <PageHeader>
            <div>
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Components', href: '/components' },
                  { label: 'Demo' },
                ]}
              />
              <PageTitle size="lg" variant="gradient">
                TradyGo UI Components
              </PageTitle>
              <p className="text-muted-foreground mt-2">
                A comprehensive showcase of all available components
              </p>
            </div>
          </PageHeader>

          {/* Buttons Section */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Various button styles and sizes for different use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Status indicators and labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Section */}
          <div className="space-y-4">
            <Alert variant="default">
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is a default alert with some important information.
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your action was completed successfully!
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please review this information carefully.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>
          </div>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>
                Interactive form components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={checked}
                  onCheckedChange={setChecked}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={switched}
                  onCheckedChange={setSwitched}
                />
                <label htmlFor="notifications" className="text-sm">
                  Enable notifications
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Progress and Loading */}
          <Card>
            <CardHeader>
              <CardTitle>Progress & Loading</CardTitle>
              <CardDescription>
                Progress indicators and loading states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} showValue />
              </div>
              
              <div className="flex items-center space-x-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat
              title="Total Users"
              value="12,345"
              description="+12% from last month"
              variant="success"
              size="md"
            />
            <Stat
              title="Revenue"
              value="$45,678"
              description="+8% from last month"
              variant="primary"
              size="md"
            />
            <Stat
              title="Orders"
              value="1,234"
              description="-2% from last month"
              variant="warning"
              size="md"
            />
          </div>

          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Avatars</CardTitle>
              <CardDescription>
                User profile pictures and fallbacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </Section>
      </Container>
    </div>
  );
}

export default ComponentDemo;