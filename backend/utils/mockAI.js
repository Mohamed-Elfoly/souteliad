// Mock AI — returns a random accuracy score (70-100%)
// Replace this function with real AI model call when ready
const analyzeSign = (expectedSign) => {
  const accuracy = Math.floor(Math.random() * 31) + 70; // 70-100
  const passed = accuracy >= 80;

  return {
    expectedSign,
    accuracy,
    passed,
    feedback: passed
      ? 'Great job! Your sign was recognized correctly.'
      : 'Almost there! Try adjusting your hand position and try again.',
  };
};

module.exports = { analyzeSign };
