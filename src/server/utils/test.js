import TestModel from '../models/test';
import TestItemModel from '../models/testItem';

export const getTotalQuestions = async (testId) => {
  const Test = new TestModel();
  const TestItems = new TestItemModel();

  const testDetails = await Test.getById(testId);
  if (!testDetails) {
    throw new Error('invalid test activity');
  }
  const testItemIds = testDetails.testItems;

  const items = await TestItems.getByIds(testItemIds);
  let questionCount = 0;

  items.forEach((item) => {
    const rowOrCols = [...item.rows, ...item.columns];
    rowOrCols.forEach((entry) => {
      const qLength = entry.widgets.length;
      console.log(JSON.stringify(entry.widgets));
      questionCount += qLength;
    });
  });
  return questionCount;
};
