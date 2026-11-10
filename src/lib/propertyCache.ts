import { Property } from '@/types';

// Global in-memory cache shared across API routes and Server Components
const globalPropertyStore = new Map<string, Property>();

export function getCachedProperty(id: string): Property | undefined {
  return globalPropertyStore.get(id);
}

export function setCachedProperty(id: string, property: Property): void {
  globalPropertyStore.set(id, property);
}

export function bulkCacheProperties(properties: Property[]): void {
  for (const p of properties) {
    if (p && p.id) {
      globalPropertyStore.set(p.id, p);
    }
  }
}

export function getAllCachedProperties(): Property[] {
  return Array.from(globalPropertyStore.values());
}
