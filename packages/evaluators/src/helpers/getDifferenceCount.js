const getDifferenceCount = (answerArray, validationArray) => {
  let count = 0;

  answerArray.forEach((answer, i) => {
    if (answer !== validationArray[i]) {
      count++;
    }
  });

  return count;
};

export default getDifferenceCount;
