import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface SyncStatusBannerProps {
  isOnline: boolean;
  lastSyncTime?: Date;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  onRetrySync?: () => void;
}

export default function SyncStatusBanner({ 
  isOnline, 
  lastSyncTime, 
  syncStatus, 
  onRetrySync 
}: SyncStatusBannerProps) {
  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'bg-healthcare-success text-white';
      case 'syncing': return 'bg-healthcare-warning text-white';
      case 'error': return 'bg-destructive text-destructive-foreground';
      case 'offline': return 'bg-muted text-muted-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'synced': return lastSyncTime ? `Synced ${formatSyncTime(lastSyncTime)}` : 'All data synced';
      case 'syncing': return 'Syncing data...';
      case 'error': return 'Sync failed - tap to retry';
      case 'offline': return 'Offline mode - limited features';
      default: return 'Connected';
    }
  };

  const formatSyncTime = (time: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  const showBanner = !isOnline || syncStatus === 'syncing' || syncStatus === 'error';

  if (!showBanner && syncStatus === 'synced') {
    // Minimal status indicator when everything is working
    return (
      <div className="flex items-center justify-center py-1 px-3">
        <Badge variant="secondary" className="text-xs" data-testid="badge-sync-status">
          <Wifi className="w-3 h-3 mr-1" />
          {getStatusText()}
        </Badge>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-between px-4 py-3 ${getStatusColor()}`}
      data-testid="sync-status-banner"
    >
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className="text-sm font-medium" data-testid="text-sync-status">
          {getStatusText()}
        </span>
      </div>
      
      {syncStatus === 'error' && onRetrySync && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onRetrySync}
          className="text-xs"
          data-testid="button-retry-sync"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}