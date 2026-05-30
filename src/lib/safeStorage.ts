export function safeGetItem(key: string): string | null {
  try {
    return globalThis?.localStorage?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    globalThis?.localStorage?.setItem(key, value)
    return true
  } catch {
    return false
  }
}
