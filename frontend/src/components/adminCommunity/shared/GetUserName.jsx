/**
 * Safely extracts a display name from a post, comment, or user object.
 *
 * Handles all shapes the backend may return:
 *   1. Populated `userId`:  { userId: { firstName: "mariam", lastName: "mamdouh" }, ... }
 *   2. Populated `user`:    { user:   { firstName: "...",    lastName: "..."    }, ... }
 *   3. Flat user object:    { firstName: "...", lastName: "..." }
 */
export function getUserName(obj) {
  if (!obj) return 'مجهول';

  // Shape 1 & 2 — nested under `userId` or `user`
  const person = obj.userId ?? obj.user ?? null;
  if (person && typeof person === 'object') {
    const first = (person.firstName ?? '').trim();
    const last  = (person.lastName  ?? '').trim();
    const full  = `${first} ${last}`.trim();
    if (full) return full;
  }

  // Shape 2 — name fields directly on the object (user rows, etc.)
  const first = (obj.firstName ?? '').trim();
  const last  = (obj.lastName  ?? '').trim();
  const full  = `${first} ${last}`.trim();
  if (full) return full;

  return 'مجهول';
}