const { curriculumOneId, getObjectId } = require('../../helpers/index');

const standards = [
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    standardIdentifier: 'MP.1',
    standardDescription: 'Make sense of problems and persevere in solving them.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    standardIdentifier: 'MP.2',
    standardDescription: 'Reason abstractly and quantitatively.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    standardIdentifier: 'MP.3',
    standardDescription: 'Construct viable arguments and critique the reasoning of others.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    standardIdentifier: 'K.CC.1',
    standardDescription: 'Count to 100 by ones and by tens.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['1'],
    standardIdentifier: '1.OA.1',
    standardDescription: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['12', '11', '10', '9'],
    standardIdentifier: 'G.CO.8',
    standardDescription: 'Explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions.'
  }
];

module.exports = standards;
