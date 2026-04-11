import { supabase } from './supabase'

/**
 * Resolves a photo_url field to a displayable image URL.
 * Handles three cases:
 * - Full URL (legacy) — return as-is
 * - Storage path — build Supabase public URL
 * - Null/empty — return null
 */
export function getAvatarUrl(photoUrl) {
  if (!photoUrl) return null

  // Already a full URL (legacy entries or external URLs)
  if (photoUrl.startsWith('http')) {
    return photoUrl
  }

  // It's a storage path — build the public URL
  const { data } = supabase.storage.from('avatars').getPublicUrl(photoUrl)
  return data?.publicUrl || null
}
