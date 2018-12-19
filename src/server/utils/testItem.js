/* get questionIds array from a testItem
* @params item {Object} - testItem Object
* @returns questionList {[]string} - return list of question ids
*/

export const getTestItemQuestions = (item) => {
  let widgets = [];
  let questionList = [];
  if (item.rows) {
    item.rows.forEach((row) => {
      widgets = [...widgets, ...row.widgets];
    });
    widgets.forEach((widget) => {
      questionList = [...questionList, widget.reference];
    });
  }
  return questionList;
};
