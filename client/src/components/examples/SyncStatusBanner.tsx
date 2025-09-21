import { useState } from 'react';
import SyncStatusBanner from '../SyncStatusBanner';

export default function SyncStatusBannerExample() {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  
  const handleRetrySync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('synced'), 2000);
    console.log('Retrying sync...');
  };

  const cycleSyncStatus = () => {
    const statuses: Array<'synced' | 'syncing' | 'error' | 'offline'> = ['synced', 'syncing', 'error', 'offline'];
    const currentIndex = statuses.indexOf(syncStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setSyncStatus(statuses[nextIndex]);
  };

  return (
    <div className="space-y-4 p-6">
      <button 
        onClick={cycleSyncStatus}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Cycle Status (Current: {syncStatus})
      </button>
      
      <SyncStatusBanner
        isOnline={syncStatus !== 'offline'}
        lastSyncTime={new Date(Date.now() - 120000)} // 2 minutes ago
        syncStatus={syncStatus}
        onRetrySync={handleRetrySync}
      />
    </div>
  );
}