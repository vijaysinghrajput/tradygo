'use client';

import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, X, ExternalLink } from 'lucide-react';
import { Button } from '@tradygo/ui';
import Link from 'next/link';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
  dismissible?: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Stock Alert',
    message: '15 products are running low on inventory. Review and restock to avoid stockouts.',
    action: {
      label: 'View Products',
      href: '/catalog/products?filter=low-stock',
    },
    dismissible: true,
  },
  {
    id: '2',
    type: 'info',
    title: 'Pending Seller Verifications',
    message: '8 new sellers are waiting for verification. Review their documents to approve.',
    action: {
      label: 'Review Sellers',
      href: '/sellers?status=pending',
    },
    dismissible: true,
  },
  {
    id: '3',
    type: 'success',
    title: 'System Update Complete',
    message: 'Platform has been successfully updated to version 2.1.0 with new features.',
    dismissible: true,
  },
];

export function SystemAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          IconComponent: AlertTriangle,
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-800',
          message: 'text-red-700',
          IconComponent: AlertTriangle,
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          title: 'text-green-800',
          message: 'text-green-700',
          IconComponent: CheckCircle,
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700',
          IconComponent: Info,
        };
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const styles = getAlertStyles(alert.type);
        const Icon = styles.IconComponent;

        return (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${styles.container}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${styles.icon}`} />
              </div>
              
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-medium ${styles.title}`}>
                  {alert.title}
                </h3>
                <p className={`mt-1 text-sm ${styles.message}`}>
                  {alert.message}
                </p>
                
                {alert.action && (
                  <div className="mt-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Link href={alert.action.href} className="flex items-center space-x-1">
                        <span>{alert.action.label}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {alert.dismissible && (
                <div className="ml-3 flex-shrink-0">
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className={`inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.icon}`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}