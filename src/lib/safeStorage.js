export function safeGetItem(key) {
  try {
    return globalThis?.localStorage?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function safeSetItem(key, value) {
  try {
    globalThis?.localStorage?.setItem(key, value)
    return true
  } catch {
    return false
  }
}
