/**
 *
 * @param {any[]} assignedList
 * @param {string} testId
 *
 * @returns {any[]}
 */
export const matchAssigned = (assignedList, testId) => {
  return assignedList.filter(assigned => assigned.testId && testId && assigned.testId === testId);
};

/**
 *
 * @param {any[]} assignedList
 * @param {string[]} testIds
 *
 * @returns {number}
 */
export const getNumberOfAssigned = (assignedList = [], testIds) => {
  let count = 0;

  testIds.forEach(testId => {
    if (matchAssigned(assignedList, testId).length) {
      count += 1;
    }
  });

  return count;
};
