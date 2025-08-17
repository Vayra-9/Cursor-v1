interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  collection: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

interface SyncResult {
  success: boolean;
  syncedItems: number;
  errors: string[];
}

class OfflineSyncManager {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'VayraOfflineDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'offlineQueue';
  private isOnline = navigator.onLine;

  constructor() {
    this.initDatabase();
    this.setupEventListeners();
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('collection', 'collection', { unique: false });
        }
      };
    });
  }

  private setupEventListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onConnectionRestored();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onConnectionLost();
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          this.onSyncComplete(event.data.data);
        }
      });
    }
  }

  // Queue an action for offline processing
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const offlineAction: OfflineAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(offlineAction);

      request.onsuccess = () => {
        console.log('Action queued for offline processing:', offlineAction.id);
        resolve(offlineAction.id);
      };

      request.onerror = () => {
        console.error('Failed to queue action:', request.error);
        reject(request.error);
      };
    });
  }

  // Get all queued actions
  async getQueuedActions(): Promise<OfflineAction[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to get queued actions:', request.error);
        reject(request.error);
      };
    });
  }

  // Remove an action from the queue
  async removeAction(actionId: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(actionId);

      request.onsuccess = () => {
        console.log('Action removed from queue:', actionId);
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to remove action:', request.error);
        reject(request.error);
      };
    });
  }

  // Update retry count for an action
  async updateRetryCount(actionId: string, retryCount: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(actionId);

      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.retryCount = retryCount;
          const updateRequest = store.put(action);
          
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Action not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Process queued actions when online
  async processQueuedActions(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedItems: 0,
      errors: []
    };

    try {
      const actions = await this.getQueuedActions();
      
      if (actions.length === 0) {
        console.log('No offline actions to process');
        return result;
      }

      console.log(`Processing ${actions.length} offline actions`);

      for (const action of actions) {
        try {
          await this.processAction(action);
          await this.removeAction(action.id);
          result.syncedItems++;
        } catch (error) {
          console.error('Failed to process action:', action.id, error);
          result.errors.push(`Action ${action.id}: ${error}`);
          
          // Increment retry count
          const newRetryCount = action.retryCount + 1;
          if (newRetryCount < 3) {
            await this.updateRetryCount(action.id, newRetryCount);
          } else {
            // Remove action after max retries
            await this.removeAction(action.id);
            result.errors.push(`Action ${action.id}: Max retries exceeded`);
          }
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
      }

    } catch (error) {
      console.error('Error processing queued actions:', error);
      result.success = false;
      result.errors.push(`General error: ${error}`);
    }

    return result;
  }

  // Process a single action
  private async processAction(action: OfflineAction): Promise<void> {
    // This would make the actual API call based on the action type
    // For now, we'll simulate the API call
    
    console.log('Processing action:', action);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random failures for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated API failure');
    }

    // In a real implementation, you would:
    // 1. Make the actual API call based on action.type and action.collection
    // 2. Handle the response
    // 3. Update local state if needed
    
    switch (action.type) {
      case 'CREATE':
        // await api.create(action.collection, action.data);
        break;
      case 'UPDATE':
        // await api.update(action.collection, action.data.id, action.data);
        break;
      case 'DELETE':
        // await api.delete(action.collection, action.data.id);
        break;
    }
  }

  // Check if we're online
  isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Get queue size
  async getQueueSize(): Promise<number> {
    const actions = await this.getQueuedActions();
    return actions.length;
  }

  // Clear all queued actions
  async clearQueue(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Offline queue cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to clear queue:', request.error);
        reject(request.error);
      };
    });
  }

  // Trigger background sync
  async triggerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      const syncMgr = (registration as any).sync;
      if (syncMgr && typeof syncMgr.register === 'function') {
        await syncMgr.register('background-sync');
        console.log('Background sync registered');
      } else {
        console.log('Background sync not supported, processing immediately');
        await this.processQueuedActions();
      }
    } else {
      console.log('Background sync not supported, processing immediately');
      await this.processQueuedActions();
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private onConnectionRestored(): void {
    console.log('Connection restored, processing offline actions');
    this.triggerBackgroundSync();
  }

  private onConnectionLost(): void {
    console.log('Connection lost, actions will be queued');
  }

  private onSyncComplete(data: { syncedItems: number }): void {
    console.log(`Sync completed: ${data.syncedItems} items synced`);
    // You could emit a custom event here to notify the UI
    window.dispatchEvent(new CustomEvent('offlineSyncComplete', { 
      detail: { syncedItems: data.syncedItems } 
    }));
  }
}

// Create singleton instance
export const offlineSync = new OfflineSyncManager();

// Export types for use in components
export type { OfflineAction, SyncResult };

// Export utility functions
export const queueOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) => {
  return offlineSync.queueAction(action);
};

export const getOfflineQueueSize = () => {
  return offlineSync.getQueueSize();
};

export const isOnline = () => {
  return offlineSync.isOnlineStatus();
};

export const triggerSync = () => {
  return offlineSync.triggerBackgroundSync();
};
