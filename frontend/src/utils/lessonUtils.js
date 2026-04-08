/**
 * Computes which lessons are unlocked based on quiz completion.
 * - Lesson 1 (lowest lessonOrder) is always unlocked.
 * - Lesson N unlocks only if lesson N-1 is completed (passed its quiz).
 *
 * @param {Array} lessons      - Lesson objects with { _id, lessonOrder }
 * @param {Set}   completedIds - Set of completed lesson _ids
 * @returns {Set} Set of unlocked lesson _ids
 */
export function getUnlockedLessonIds(lessons, completedIds) {
  if (!lessons.length) return new Set();
  const sorted = [...lessons].sort((a, b) => a.lessonOrder - b.lessonOrder);
  const unlocked = new Set();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      unlocked.add(sorted[i]._id);
    } else if (completedIds.has(sorted[i - 1]._id)) {
      unlocked.add(sorted[i]._id);
    }
  }
  return unlocked;
}

/**
 * Computes which levels are fully completed.
 * A level is complete when ALL its lessons are in completedIds.
 * Levels with no lessons are auto-considered complete.
 *
 * @param {Array} levels       - Level objects with { _id }
 * @param {Array} allLessons   - All lesson objects with { _id, levelId }
 * @param {Set}   completedIds - Set of completed lesson _ids
 * @returns {Set} Set of completed level _ids
 */
export function getCompletedLevelIds(levels, allLessons, completedIds) {
  const completed = new Set();
  for (const level of levels) {
    const levelLessons = allLessons.filter(
      (l) => (l.levelId?._id || l.levelId) === level._id
    );
    if (levelLessons.length === 0 || levelLessons.every((l) => completedIds.has(l._id))) {
      completed.add(level._id);
    }
  }
  return completed;
}

/**
 * Computes which levels are unlocked based on level completion.
 * - First level (lowest levelOrder) is always unlocked.
 * - Level N unlocks only if level N-1 is fully completed.
 *
 * @param {Array} levels            - Level objects with { _id, levelOrder }
 * @param {Set}   completedLevelIds - Set of completed level _ids
 * @returns {Set} Set of unlocked level _ids
 */
export function getUnlockedLevelIds(levels, completedLevelIds) {
  if (!levels.length) return new Set();
  const sorted = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
  const unlocked = new Set();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      unlocked.add(sorted[i]._id);
    } else if (completedLevelIds.has(sorted[i - 1]._id)) {
      unlocked.add(sorted[i]._id);
    }
  }
  return unlocked;
}
