const allGradesObj = {
  K: { value: 'K', text: 'Kindergarten' },
  1: { value: '1', text: 'Grade 1' },
  2: { value: '2', text: 'Grade 2' },
  3: { value: '3', text: 'Grade 3' },
  4: { value: '4', text: 'Grade 4' },
  5: { value: '5', text: 'Grade 5' },
  6: { value: '6', text: 'Grade 6' },
  7: { value: '7', text: 'Grade 7' },
  8: { value: '8', text: 'Grade 8' },
  9: { value: '9', text: 'Grade 9' },
  10: { value: '10', text: 'Grade 10' },
  11: { value: '11', text: 'Grade 11' },
  12: { value: '12', text: 'Grade 12' },
  other: { value: 'other', text: 'Other' }
};

const allGrades = Object.values(allGradesObj);

const allSubjects = [
  { value: 'Mathematics', text: 'Mathematics' },
  { value: 'ELA', text: 'ELA' },
  { value: 'Science', text: 'Science' },
  { value: 'Social Studies', text: 'Social Studies' },
  { value: 'Other Subjects', text: 'Other Subjects' },
];

const allTags = [{ value: 'tag1', text: 'Tag1' }, { value: 'tag2', text: 'Tag2' }];

const allCollections = [
  { value: 'Private', text: 'Private' },
  { value: 'Public', text: 'Public' },
  { value: 'Edulastic Certified', text: 'Edulastic Certified' },
];

const openPolicy = [
  { value: 'Automatically on Start Date', text: 'Automatically on Start Date' },
  { value: 'Open Manually by Admin', text: 'Open Manually by Admin' },
  { value: 'Open Manually by Teacher', text: 'Open Manually by Teacher' },
];

const closePolicy = [
  { value: 'Automatically on Due Date', text: 'Automatically on Due Date' },
  { value: 'Close Manually by Admin', text: 'Close Manually by Admin' },
];

export default {
  allGradesObj,
  allGrades,
  allSubjects,
  allTags,
  allCollections,
  openPolicy,
  closePolicy,
};
