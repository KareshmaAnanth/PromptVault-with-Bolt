// Enhanced privacy with local storage backup
const STORAGE_KEYS = {
  PROMPTS: 'promptvault_prompts',
  COLLECTIONS: 'promptvault_collections',
  USER_PREFERENCES: 'promptvault_preferences'
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return fallback
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}

export const storageKeys = STORAGE_KEYS