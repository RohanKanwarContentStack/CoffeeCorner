/**
 * CoffeeCorner profile avatars (emoji-based for simplicity).
 */
export const AVATARS = [
  { id: 'avatar_1', name: 'Avatar 1', emoji: '☕' },
  { id: 'avatar_2', name: 'Avatar 2', emoji: '🥐' },
  { id: 'avatar_3', name: 'Avatar 3', emoji: '🍩' },
  { id: 'avatar_4', name: 'Avatar 4', emoji: '🧁' },
  { id: 'avatar_5', name: 'Avatar 5', emoji: '🍪' },
  { id: 'avatar_6', name: 'Avatar 6', emoji: '🥤' },
  { id: 'avatar_7', name: 'Avatar 7', emoji: '🫖' },
];

export const DEFAULT_AVATAR = AVATARS[0];

export const getAvatarById = (id) =>
  AVATARS.find((a) => a.id === id) || DEFAULT_AVATAR;
