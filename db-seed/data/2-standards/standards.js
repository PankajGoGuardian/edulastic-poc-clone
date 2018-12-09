const { curriculumOneId, getObjectId } = require('../../helpers/index');

// Standards hierarchy:
// TLO - Domain (highest level)
// ELO - Cluster
// SUB_ELO - Standard
// SUB_SUB_ELO - Component (lowest level)

const standards = [
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    level: 'TLO',
    identifier: '##-CA.MA.K-3.SFMP',
    description: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    level: 'ELO',
    identifier: 'MP.1',
    description: 'Make sense of problems and persevere in solving them.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    level: 'ELO',
    identifier: 'MP.2',
    description: 'Reason abstractly and quantitatively.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['3', '2', '1', 'K'],
    level: 'ELO',
    identifier: 'MP.3',
    description: 'Construct viable arguments and critique the reasoning of others.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'TLO',
    identifier: '##-CA.MA.K.CAC',
    description: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'ELO',
    identifier: '##-CA.MA.K.CAC.A',
    description: 'Know number names and the count sequence.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_ELO',
    identifier: 'K.CC.1',
    description: 'Count to 100 by ones and by tens.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.A',
    eloDescription: 'Know number names and the count sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_ELO',
    identifier: 'K.CC.2',
    description: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.A',
    eloDescription: 'Know number names and the count sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_ELO',
    identifier: 'K.CC.3',
    description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.A',
    eloDescription: 'Know number names and the count sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'ELO',
    identifier: '##-CA.MA.K.CAC.B',
    description: 'Count to tell the number of objects.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_ELO',
    identifier: 'K.CC.4',
    description: 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_SUB_ELO',
    identifier: 'K.CC.4.a',
    description: 'When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.',
    subEloIdentifier: 'K.CC.4',
    subEloDescription: 'Understand the relationship between numbers and quantities; connect counting to cardinality.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_SUB_ELO',
    identifier: 'K.CC.4.b',
    description: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.',
    subEloIdentifier: 'K.CC.4',
    subEloDescription: 'Understand the relationship between numbers and quantities; connect counting to cardinality.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_SUB_ELO',
    identifier: 'K.CC.4.c',
    description: 'Understand that each successive number name refers to a quantity that is one larger.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.',
    subEloIdentifier: 'K.CC.4',
    subEloDescription: 'Understand the relationship between numbers and quantities; connect counting to cardinality.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: ['K'],
    level: 'SUB_ELO',
    identifier: 'K.CC.5',
    description: 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1—20, count out that many objects.',
    tloIdentifier: '##-CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: '##-CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.'
  },
];

module.exports = standards;
