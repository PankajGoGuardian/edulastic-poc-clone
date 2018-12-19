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
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'TLO',
    identifier: 'CA.MA.K-3.SFMP',
    description: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'TLO',
    identifier: 'CA.MA.K.CAC',
    description: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'TLO',
    identifier: 'CA.MA.K-3.OAAT',
    description: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'TLO',
    identifier: 'CA.MA.K-3.NAOIBT',
    description: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'TLO',
    identifier: 'CA.MA.K-3.MAD',
    description: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'TLO',
    identifier: 'CA.MA.K-3.G',
    description: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5',
      '4',
      '3'
    ],
    level: 'TLO',
    identifier: 'CA.MA.3-5.NAOF',
    description: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8',
      '7',
      '6'
    ],
    level: 'TLO',
    identifier: 'CA.MA.6-8.SAP',
    description: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8',
      '7',
      '6'
    ],
    level: 'TLO',
    identifier: 'CA.MA.6-8.EAE',
    description: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7',
      '6'
    ],
    level: 'TLO',
    identifier: 'CA.MA.6-7.RAPR',
    description: 'Ratios and Proportional Relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8',
      '7',
      '6'
    ],
    level: 'TLO',
    identifier: 'CA.MA.6-8.TNS',
    description: 'The Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'TLO',
    identifier: 'CA.MA.8.F',
    description: 'Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCF',
    description: 'Higher Mathematics Course — Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCSAP',
    description: 'Higher Mathematics Course — Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCC',
    description: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCNAQ',
    description: 'Higher Mathematics Course — Number and Quantity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCA',
    description: 'Higher Mathematics Course — Algebra'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCG',
    description: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'TLO',
    identifier: 'CA.MA.9-12.HMCAPPAS',
    description: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.1',
    description: 'Make sense of problems and persevere in solving them.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.2',
    description: 'Reason abstractly and quantitatively.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.3',
    description: 'Construct viable arguments and critique the reasoning of others.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.4',
    description: 'Model with mathematics.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.5',
    description: 'Use appropriate tools strategically.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.6',
    description: 'Attend to precision.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.7',
    description: 'Look for and make use of structure.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3',
      '2',
      '1',
      'K'
    ],
    level: 'ELO',
    identifier: 'MP.8',
    description: 'Look for and express regularity in repeated reasoning.',
    tloIdentifier: 'CA.MA.K-3.SFMP',
    tloDescription: 'Standards for Mathematical Practice'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.CAC.A',
    description: 'Know number names and the count sequence.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.CAC.B',
    description: 'Count to tell the number of objects.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.CAC.C',
    description: 'Compare numbers.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.OAAT.A',
    description: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.OAAT.A',
    description: 'Represent and solve problems involving addition and subtraction.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.OAAT.B',
    description: 'Understand and apply properties of operations and the relationship between addition and subtraction.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.OAAT.C',
    description: 'Add and subtract within 20.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.OAAT.D',
    description: 'Work with addition and subtraction equations.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.OAAT.A',
    description: 'Represent and solve problems involving addition and subtraction.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.OAAT.B',
    description: 'Add and subtract within 20.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.OAAT.C',
    description: 'Work with equal groups of objects to gain foundations for multiplication.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.OAAT.A',
    description: 'Represent and solve problems involving multiplication and division.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.OAAT.B',
    description: 'Understand properties of multiplication and the relationship between multiplication and division.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.OAAT.C',
    description: 'Multiply and divide within 100.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.OAAT.D',
    description: 'Solve problems involving the four operations, and identify and explain patterns in arithmetic.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.OAAT.A',
    description: 'Use the four operations with whole numbers to solve problems.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.OAAT.B',
    description: 'Gain familiarity with factors and multiples.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.OAAT.C',
    description: 'Generate and analyze patterns.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.OAAT.A',
    description: 'Write and interpret numerical expressions.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.OAAT.B',
    description: 'Analyze patterns and relationships.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.NAOIBT.A',
    description: 'Work with numbers 11—19 to gain foundations for place value.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.NAOIBT.A',
    description: 'Use place value understanding and properties of operations to add and subtract.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.NAOIBT.B',
    description: 'Extend the counting sequence.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.NAOIBT.C',
    description: 'Understand place value.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.NAOIBT.A',
    description: 'Understand place value.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.NAOIBT.B',
    description: 'Use place value understanding and properties of operations to add and subtract.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.NAOIBT.A',
    description: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.NAOIBT.A',
    description: 'Generalize place value understanding for multi-digit whole numbers.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.NAOIBT.B',
    description: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.NAOIBT.A',
    description: 'Understand the place value system.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.NAOIBT.B',
    description: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.MAD.A',
    description: 'Describe and compare measurable attributes.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.MAD.B',
    description: 'Classify objects and count the number of objects in each category.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.MAD.A',
    description: 'Measure lengths indirectly and by iterating length units.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.MAD.B',
    description: 'Tell and write time.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.MAD.C',
    description: 'Represent and interpret data.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.MAD.A',
    description: 'Relate addition and subtraction to length.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.MAD.B',
    description: 'Work with time and money.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.MAD.C',
    description: 'Represent and interpret data.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.MAD.D',
    description: 'Measure and estimate lengths in standard units.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.MAD.A',
    description: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.MAD.B',
    description: 'Represent and interpret data.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.MAD.C',
    description: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.MAD.D',
    description: 'Geometric measurement: recognize perimeter as an attribute of plane figures and distinguish between linear and area measures.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.MAD.A',
    description: 'Represent and interpret data.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.MAD.B',
    description: 'Geometric measurement: understand concepts of angle and measure angles.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.MAD.C',
    description: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.MAD.A',
    description: 'Represent and interpret data.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.MAD.B',
    description: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.MAD.C',
    description: 'Convert like measurement units within a given measurement system.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.G.A',
    description: 'Analyze, compare, create, and compose shapes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'ELO',
    identifier: 'CA.MA.K.G.B',
    description: 'Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'ELO',
    identifier: 'CA.MA.1.G.A',
    description: 'Reason with shapes and their attributes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'ELO',
    identifier: 'CA.MA.2.G.A',
    description: 'Reason with shapes and their attributes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.G.A',
    description: 'Reason with shapes and their attributes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.G.A',
    description: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.G.A',
    description: 'Graph points on the coordinate plane to solve real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.G.B',
    description: 'Classify two-dimensional figures into categories based on their properties.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.G.A',
    description: 'Solve real-world and mathematical problems involving area, surface area, and volume.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.G.A',
    description: 'Draw, construct, and describe geometrical figures and describe the relationships between them.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.G.B',
    description: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.G.A',
    description: 'Understand congruence and similarity using physical models, transparencies, or geometry software.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.G.B',
    description: 'Understand and apply the Pythagorean Theorem.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.G.C',
    description: 'Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'ELO',
    identifier: 'CA.MA.3.NAOF.A',
    description: 'Develop understanding of fractions as numbers.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.NAOF.A',
    description: 'Extend understanding of fraction equivalence and ordering.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.NAOF.B',
    description: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'ELO',
    identifier: 'CA.MA.4.NAOF.C',
    description: 'Understand decimal notation for fractions, and compare decimal fractions.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.NAOF.A',
    description: 'Use equivalent fractions as a strategy to add and subtract fractions.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'ELO',
    identifier: 'CA.MA.5.NAOF.B',
    description: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.SAP.A',
    description: 'Develop understanding of statistical variability.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.SAP.B',
    description: 'Summarize and describe distributions.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.SAP.A',
    description: 'Use random sampling to draw inferences about a population.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.SAP.B',
    description: 'Draw informal comparative inferences about two populations.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.SAP.C',
    description: 'Investigate chance processes and develop, use, and evaluate probability models.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.SAP.A',
    description: 'Investigate patterns of association in bivariate data.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.EAE.A',
    description: 'Represent and analyze quantitative relationships between dependent and independent variables.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.EAE.B',
    description: 'Apply and extend previous understandings of arithmetic to algebraic expressions.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.EAE.C',
    description: 'Reason about and solve one-variable equations and inequalities.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.EAE.A',
    description: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.EAE.B',
    description: 'Use properties of operations to generate equivalent expressions.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.EAE.A',
    description: 'Work with radicals and integer exponents.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.EAE.B',
    description: 'Understand the connections between proportional relationships, lines, and linear equations.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.EAE.C',
    description: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.RAPR.A',
    description: 'Understand ratio concepts and use ratio reasoning to solve problems.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.RAPR.A',
    description: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.TNS.A',
    description: 'Apply and extend previous understandings of multiplication and division to divide fractions by fractions.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.TNS.B',
    description: 'Compute fluently with multi-digit numbers and find common factors and multiples.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'ELO',
    identifier: 'CA.MA.6.TNS.C',
    description: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'ELO',
    identifier: 'CA.MA.7.TNS.A',
    description: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.TNS.A',
    description: 'Know that there are numbers that are not rational, and approximate them by rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.F.A',
    description: 'Define, evaluate, and compare functions.',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'ELO',
    identifier: 'CA.MA.8.F.B',
    description: 'Use functions to model relationships between quantities.',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCF.A',
    description: 'Interpreting Functions',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCF.B',
    description: 'Building Functions',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCF.C',
    description: 'Linear, Quadratic, and Exponential Models',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCF.D',
    description: 'Trigonometric Functions',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCSAP.A',
    description: 'Interpreting Categorical and Quantitative Data',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCSAP.B',
    description: 'Making Inferences and Justifying Conclusions',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCSAP.C',
    description: 'Conditional Probability and the Rules of Probability',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCSAP.D',
    description: 'Using Probability to Make Decisions',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.A',
    description: 'Students demonstrate knowledge of both the formal definition and the graphical interpretation of limit of values of functions. This knowledge includes one-sided limits, infinite limits, and limits at infinity. Students know the definition of convergence and divergence of a function as the domain variable approaches either a number or infinity:',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.B',
    description: 'Students demonstrate knowledge of both the formal definition and the graphical interpretation of continuity of a function.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.C',
    description: 'Students demonstrate an understanding and the application of the intermediate value theorem and the extreme value theorem.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.D',
    description: 'Students demonstrate an understanding of the formal definition of the derivative of a function at a point and the notion of differentiability:',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.E',
    description: 'Students know the chain rule and its proof and applications to the calculation of the derivative of a variety of composite functions.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.F',
    description: 'Students find the derivatives of parametrically defined functions and use implicit differentiation in a wide variety of problems in physics, chemistry, economics, and so forth.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.G',
    description: 'Students compute derivatives of higher orders.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.H',
    description: "Students know and can apply Rolle's Theorem, the mean value theorem, and L'Hôpital's rule.",
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.I',
    description: 'Students use differentiation to sketch, by hand, graphs of functions. They can identify maxima, minima, inflection points, and intervals in which the function is increasing and decreasing.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.J',
    description: "Students know Newton's method for approximating the zeros of a function.",
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.K',
    description: 'Students use differentiation to solve optimization (maximum-minimum problems) in a variety of pure and applied contexts.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.L',
    description: 'Students use differentiation to solve related rate problems in a variety of pure and applied contexts.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.M',
    description: 'Students know the definition of the definite integral by using Riemann sums. They use this definition to approximate integrals.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.N',
    description: 'Students apply the definition of the integral to model problems in physics, economics, and so forth, obtaining results in terms of integrals.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.O',
    description: 'Students demonstrate knowledge and proof of the fundamental theorem of calculus and use it to interpret integrals as antiderivatives.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.P',
    description: 'Students use definite integrals in problems involving area, velocity, acceleration, volume of a solid, area of a surface of revolution, length of a curve, and work.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.Q',
    description: 'Students compute, by hand, the integrals of a wide variety of functions by using techniques of integration, such as substitution, integration by parts, and trigonometric substitution. They can also combine these techniques when appropriate.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.R',
    description: 'Students know the definitions and properties of inverse trigonometric functions and the expression of these functions as indefinite integrals.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.S',
    description: 'Students compute, by hand, the integrals of rational functions by combining the techniques in standard 17.0 with the algebraic techniques of partial fractions and completing the square.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.T',
    description: 'Students compute the integrals of trigonometric functions by using the techniques noted above.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.U',
    description: "Students understand the algorithms involved in Simpson's rule and Newton's method. They use calculators or computers or both to approximate integrals numerically.",
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.V',
    description: 'Students understand improper integrals as limits of definite integrals.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.W',
    description: 'Students demonstrate an understanding of the definitions of convergence and divergence of sequences and series of real numbers. By using such tests as the comparison test, ratio test, and alternate series test, they can determine whether a series converges.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.X',
    description: 'Students understand and can compute the radius (interval) of the convergence of power series.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.Y',
    description: 'Students differentiate and integrate the terms of a power series in order to form new series from known ones.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.Z',
    description: 'Students calculate Taylor polynomials and Taylor series of basic functions, including the remainder term.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCC.NA',
    description: 'Students know the techniques of solution of selected elementary differential equations and their applications to a wide variety of situations, including growth-and-decay problems.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.A',
    description: 'The Real Number System',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.B',
    description: 'Quantities',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.C',
    description: 'The Complex Number System',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.D',
    description: 'Vector and Matrix Quantities',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCA.A',
    description: 'Seeing Structure in Expressions',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCA.B',
    description: 'Arithmetic with Polynomials and Rational Expressions',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCA.C',
    description: 'Creating Equations',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCA.D',
    description: 'Reasoning with Equations and Inequalities',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCG.A',
    description: 'Similarity, Right Triangles, and Trigonometry',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCG.B',
    description: 'Circles',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCG.C',
    description: 'Expressing Geometric Properties with Equations',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCG.D',
    description: 'Geometric Measurement and Dimension',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCG.E',
    description: 'Modeling with Geometry',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCG.F',
    description: 'Congruence',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.A',
    description: 'Students know the definitions of the mean, median, and mode of distribution of data and can compute each of them in particular situations.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.B',
    description: 'Students compute the variance and the standard deviation of a distribution of data.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.C',
    description: 'Students find the line of best fit to a given distribution of data by using least squares regression.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.D',
    description: "Students know what the correlation coefficient of two variables means and are familiar with the coefficient's properties.",
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.E',
    description: 'Students organize and describe distributions of data by using a number of different methods, including frequency tables, histograms, standard line graphs and bar graphs, stem-and-leaf displays, scatterplots, and box-and-whisker plots.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.F',
    description: 'Students are familiar with the notions of a statistic of a distribution of values, of the sampling distribution of a statistic, and of the variability of a statistic.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.G',
    description: 'Students know basic facts concerning the relation between the mean and the standard deviation of a sampling distribution and the mean and the standard deviation of the population distribution.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.H',
    description: 'Students determine confidence intervals for a simple random sample from a normal distribution of data and determine the sample size required for a desired margin of error.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.I',
    description: 'Students determine the P-value for a statistic for a simple random sample from a normal distribution.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.J',
    description: 'Students are familiar with the chi-square distribution and chi-square test and understand their uses.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.K',
    description: 'Students solve probability problems with finite sample spaces by using the rules for addition, multiplication, and complementation for probability distributions and understand the simplifications that arise with independent events.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.L',
    description: 'Students know the definition of conditional probability and use it to solve for probabilities in finite sample spaces.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.M',
    description: 'Students demonstrate an understanding of the notion of discrete random variables by using this concept to solve for the probabilities of outcomes, such as the probability of the occurrence of five or fewer heads in 14 coin tosses.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.N',
    description: 'Students understand the notion of a continuous random variable and can interpret the probability of an outcome as the area of a region under the graph of the probability density function associated with the random variable.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.O',
    description: 'Students know the definition of the mean of a discrete random variable and can determine the mean for a particular discrete random variable.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.P',
    description: 'Students know the definition of the variance of a discrete random variable and can determine the variance for a particular discrete random variable.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.Q',
    description: 'Students demonstrate an understanding of the standard distributions (normal, binomial, and exponential) and can use the distributions to solve for events in problems in which the distribution belongs to those families.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.R',
    description: 'Students determine the mean and the standard deviation of a normally distributed random variable.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'ELO',
    identifier: 'CA.MA.9-12.HMCAPPAS.S',
    description: 'Students know the central limit theorem and can use it to obtain approximations for probabilities in problems of finite sample spaces in which the probabilities are distributed binomially.',
    tloIdentifier: 'CA.MA.9-12.HMCAPPAS',
    tloDescription: 'Higher Mathematics Course — Advanced Placement Probability and Statistics'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.1',
    description: 'Count to 100 by ones and by tens.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.A',
    eloDescription: 'Know number names and the count sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.2',
    description: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.A',
    eloDescription: 'Know number names and the count sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.3',
    description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.A',
    eloDescription: 'Know number names and the count sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.4',
    description: 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.5',
    description: 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1—20, count out that many objects.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.6',
    description: 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.C',
    eloDescription: 'Compare numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.CC.7',
    description: 'Compare two numbers between 1 and 10 presented as written numerals.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.C',
    eloDescription: 'Compare numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.OA.1',
    description: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.K.OAAT.A',
    eloDescription: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.OA.2',
    description: 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.K.OAAT.A',
    eloDescription: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.OA.3',
    description: 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.K.OAAT.A',
    eloDescription: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.OA.4',
    description: 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.K.OAAT.A',
    eloDescription: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.OA.5',
    description: 'Fluently add and subtract within 5.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.K.OAAT.A',
    eloDescription: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.1',
    description: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.A',
    eloDescription: 'Represent and solve problems involving addition and subtraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.2',
    description: 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.A',
    eloDescription: 'Represent and solve problems involving addition and subtraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.3',
    description: 'Apply properties of operations as strategies to add and subtract.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.B',
    eloDescription: 'Understand and apply properties of operations and the relationship between addition and subtraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.4',
    description: 'Understand subtraction as an unknown-addend problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.B',
    eloDescription: 'Understand and apply properties of operations and the relationship between addition and subtraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.5',
    description: 'Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.C',
    eloDescription: 'Add and subtract within 20.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.6',
    description: 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10. Use strategies such as counting on; making ten (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14); decomposing a number leading to a ten (e.g., 13 - 4 = 13 - 3 - 1 = 10 - 1 = 9); using the relationship between addition and subtraction (e.g., knowing that 8 + 4 = 12, one knows 12 - 8 = 4); and creating equivalent but easier or known sums (e.g., adding 6 + 7 by creating the known equivalent 6 + 6 + 1 = 12 + 1 = 13).',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.C',
    eloDescription: 'Add and subtract within 20.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.7',
    description: 'Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.D',
    eloDescription: 'Work with addition and subtraction equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.OA.8',
    description: 'Determine the unknown whole number in an addition or subtraction equation relating three whole numbers.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.1.OAAT.D',
    eloDescription: 'Work with addition and subtraction equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.OA.1',
    description: 'Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.2.OAAT.A',
    eloDescription: 'Represent and solve problems involving addition and subtraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.OA.2',
    description: 'Fluently add and subtract within 20 using mental strategies. By end of Grade 2, know from memory all sums of two one-digit numbers.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.2.OAAT.B',
    eloDescription: 'Add and subtract within 20.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.OA.3',
    description: 'Determine whether a group of objects (up to 20) has an odd or even number of members, e.g., by pairing objects or counting them by 2s; write an equation to express an even number as a sum of two equal addends.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.2.OAAT.C',
    eloDescription: 'Work with equal groups of objects to gain foundations for multiplication.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.OA.4',
    description: 'Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.2.OAAT.C',
    eloDescription: 'Work with equal groups of objects to gain foundations for multiplication.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.1',
    description: 'Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.A',
    eloDescription: 'Represent and solve problems involving multiplication and division.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.2',
    description: 'Interpret whole-number quotients of whole numbers, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares, or as a number of shares when 56 objects are partitioned into equal shares of 8 objects each.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.A',
    eloDescription: 'Represent and solve problems involving multiplication and division.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.3',
    description: 'Use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.A',
    eloDescription: 'Represent and solve problems involving multiplication and division.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.4',
    description: 'Determine the unknown whole number in a multiplication or division equation relating three whole numbers.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.A',
    eloDescription: 'Represent and solve problems involving multiplication and division.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.5',
    description: 'Apply properties of operations as strategies to multiply and divide.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.B',
    eloDescription: 'Understand properties of multiplication and the relationship between multiplication and division.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.6',
    description: 'Understand division as an unknown-factor problem.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.B',
    eloDescription: 'Understand properties of multiplication and the relationship between multiplication and division.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.7',
    description: 'Fluently multiply and divide within 100, using strategies such as the relationship between multiplication and division (e.g., knowing that 8 × 5 = 40, one knows 40 ÷ 5 = 8) or properties of operations. By the end of Grade 3, know from memory all products of two one-digit numbers.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.C',
    eloDescription: 'Multiply and divide within 100.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.8',
    description: 'Solve two-step word problems using the four operations. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.D',
    eloDescription: 'Solve problems involving the four operations, and identify and explain patterns in arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.OA.9',
    description: 'Identify arithmetic patterns (including patterns in the addition table or multiplication table), and explain them using properties of operations.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.3.OAAT.D',
    eloDescription: 'Solve problems involving the four operations, and identify and explain patterns in arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.OA.1',
    description: 'Interpret a multiplication equation as a comparison, e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.4.OAAT.A',
    eloDescription: 'Use the four operations with whole numbers to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.OA.2',
    description: 'Multiply or divide to solve word problems involving multiplicative comparison, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem, distinguishing multiplicative comparison from additive comparison.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.4.OAAT.A',
    eloDescription: 'Use the four operations with whole numbers to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.OA.3',
    description: 'Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.4.OAAT.A',
    eloDescription: 'Use the four operations with whole numbers to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.OA.4',
    description: 'Find all factor pairs for a whole number in the range 1—100. Recognize that a whole number is a multiple of each of its factors. Determine whether a given whole number in the range 1—100 is a multiple of a given one-digit number. Determine whether a given whole number in the range 1—100 is prime or composite.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.4.OAAT.B',
    eloDescription: 'Gain familiarity with factors and multiples.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.OA.5',
    description: 'Generate a number or shape pattern that follows a given rule. Identify apparent features of the pattern that were not explicit in the rule itself.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.4.OAAT.C',
    eloDescription: 'Generate and analyze patterns.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.OA.1',
    description: 'Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.5.OAAT.A',
    eloDescription: 'Write and interpret numerical expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.OA.2',
    description: 'Write simple expressions that record calculations with numbers, and interpret numerical expressions without evaluating them.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.5.OAAT.A',
    eloDescription: 'Write and interpret numerical expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.OA.2.1',
    description: 'Express a whole number in the range 2–50 as a product of its prime factors. For example, find the prime factors of 24 and express 24 as 2 × 2 × 2 × 3.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.5.OAAT.A',
    eloDescription: 'Write and interpret numerical expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.OA.3',
    description: 'Generate two numerical patterns using two given rules. Identify apparent relationships between corresponding terms. Form ordered pairs consisting of corresponding terms from the two patterns, and graph the ordered pairs on a coordinate plane.',
    tloIdentifier: 'CA.MA.K-3.OAAT',
    tloDescription: 'Operations and Algebraic Thinking',
    eloIdentifier: 'CA.MA.5.OAAT.B',
    eloDescription: 'Analyze patterns and relationships.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.NBT.1',
    description: 'Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (e.g., 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.K.NAOIBT.A',
    eloDescription: 'Work with numbers 11—19 to gain foundations for place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.NBT.4',
    description: 'Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones; and sometimes it is necessary to compose a ten.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.A',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.NBT.5',
    description: 'Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count; explain the reasoning used.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.A',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.NBT.6',
    description: 'Subtract multiples of 10 in the range 10-90 from multiples of 10 in the range 10-90 (positive or zero differences), using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.A',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.NBT.1',
    description: 'Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.B',
    eloDescription: 'Extend the counting sequence.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.NBT.2',
    description: 'Understand that the two digits of a two-digit number represent amounts of tens and ones. Understand the following as special cases:',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.C',
    eloDescription: 'Understand place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.NBT.3',
    description: 'Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.C',
    eloDescription: 'Understand place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.1',
    description: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones. Understand the following as special cases:',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.A',
    eloDescription: 'Understand place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.2',
    description: 'Count within 1000; skip-count by 2s, 5s, 10s, and 100s.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.A',
    eloDescription: 'Understand place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.3',
    description: 'Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.A',
    eloDescription: 'Understand place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.4',
    description: 'Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using >, =, and < symbols to record the results of comparisons.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.A',
    eloDescription: 'Understand place value.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.5',
    description: 'Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.6',
    description: 'Add up to four two-digit numbers using strategies based on place value and properties of operations.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.7',
    description: 'Add and subtract within 1000, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method. Understand that in adding or subtracting three-digit numbers, one adds or subtracts hundreds and hundreds, tens and tens, ones and ones; and sometimes it is necessary to compose or decompose tens or hundreds.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.8',
    description: 'Mentally add 10 or 100 to a given number 100—900, and mentally subtract 10 or 100 from a given number 100—900.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.9',
    description: 'Explain why addition and subtraction strategies work, using place value and the properties of operations.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.NBT.7.1',
    description: 'Use estimation strategies to make reasonable estimates in problem solving.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to add and subtract.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.NBT.1',
    description: 'Use place value understanding to round whole numbers to the nearest 10 or 100.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.3.NAOIBT.A',
    eloDescription: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.NBT.2',
    description: 'Fluently add and subtract within 1000 using strategies and algorithms based on place value, properties of operations, and/or the relationship between addition and subtraction.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.3.NAOIBT.A',
    eloDescription: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.NBT.3',
    description: 'Multiply one-digit whole numbers by multiples of 10 in the range 10—90 (e.g., 9 × 80, 5 × 60) using strategies based on place value and properties of operations.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.3.NAOIBT.A',
    eloDescription: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NBT.1',
    description: 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.4.NAOIBT.A',
    eloDescription: 'Generalize place value understanding for multi-digit whole numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NBT.2',
    description: 'Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form. Compare two multi-digit numbers based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.4.NAOIBT.A',
    eloDescription: 'Generalize place value understanding for multi-digit whole numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NBT.3',
    description: 'Use place value understanding to round multi-digit whole numbers to any place.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.4.NAOIBT.A',
    eloDescription: 'Generalize place value understanding for multi-digit whole numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NBT.4',
    description: 'Fluently add and subtract multi-digit whole numbers using the standard algorithm.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.4.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NBT.5',
    description: 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers, using strategies based on place value and the properties of operations. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.4.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NBT.6',
    description: 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.4.NAOIBT.B',
    eloDescription: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.1',
    description: 'Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.A',
    eloDescription: 'Understand the place value system.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.2',
    description: 'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.A',
    eloDescription: 'Understand the place value system.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.3',
    description: 'Read, write, and compare decimals to thousandths.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.A',
    eloDescription: 'Understand the place value system.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.4',
    description: 'Use place value understanding to round decimals to any place.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.A',
    eloDescription: 'Understand the place value system.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.5',
    description: 'Fluently multiply multi-digit whole numbers using the standard algorithm.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.B',
    eloDescription: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.6',
    description: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.B',
    eloDescription: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NBT.7',
    description: 'Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.B',
    eloDescription: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.MD.1',
    description: 'Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.K.MAD.A',
    eloDescription: 'Describe and compare measurable attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.MD.2',
    description: 'Directly compare two objects with a measurable attribute in common, to see which object has "more of"/"less of" the attribute, and describe the difference.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.K.MAD.A',
    eloDescription: 'Describe and compare measurable attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.MD.3',
    description: 'Classify objects into given categories; count the numbers of objects in each category and sort the categories by count.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.K.MAD.B',
    eloDescription: 'Classify objects and count the number of objects in each category.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.MD.1',
    description: 'Order three objects by length; compare the lengths of two objects indirectly by using a third object.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.1.MAD.A',
    eloDescription: 'Measure lengths indirectly and by iterating length units.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.MD.2',
    description: 'Express the length of an object as a whole number of length units, by laying multiple copies of a shorter object (the length unit) end to end; understand that the length measurement of an object is the number of same-size length units that span it with no gaps or overlaps.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.1.MAD.A',
    eloDescription: 'Measure lengths indirectly and by iterating length units.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.MD.3',
    description: 'Tell and write time in hours and half-hours using analog and digital clocks.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.1.MAD.B',
    eloDescription: 'Tell and write time.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.MD.4',
    description: 'Organize, represent, and interpret data with up to three categories; ask and answer questions about the total number of data points, how many in each category, and how many more or less are in one category than in another.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.1.MAD.C',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.5',
    description: 'Use addition and subtraction within 100 to solve word problems involving lengths that are given in the same units, e.g., by using drawings (such as drawings of rulers) and equations with a symbol for the unknown number to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.A',
    eloDescription: 'Relate addition and subtraction to length.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.6',
    description: 'Represent whole numbers as lengths from 0 on a number line diagram with equally spaced points corresponding to the numbers 0, 1, 2, …, and represent whole-number sums and differences within 100 on a number line diagram.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.A',
    eloDescription: 'Relate addition and subtraction to length.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.7',
    description: 'Tell and write time from analog and digital clocks to the nearest five minutes, using a.m. and p.m. Know relationships of time (e.g., minutes in an hour, days in a month, weeks in a year).',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.B',
    eloDescription: 'Work with time and money.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.8',
    description: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and ¢ symbols appropriately.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.B',
    eloDescription: 'Work with time and money.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.10',
    description: 'Draw a picture graph and a bar graph (with single-unit scale) to represent a data set with up to four categories. Solve simple put-together, take-apart, and compare problems using information presented in a bar graph.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.C',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.9',
    description: 'Generate measurement data by measuring lengths of several objects to the nearest whole unit, or by making repeated measurements of the same object. Show the measurements by making a line plot, where the horizontal scale is marked off in whole-number units.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.C',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.1',
    description: 'Measure the length of an object by selecting and using appropriate tools such as rulers, yardsticks, meter sticks, and measuring tapes.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.D',
    eloDescription: 'Measure and estimate lengths in standard units.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.2',
    description: 'Measure the length of an object twice, using length units of different lengths for the two measurements; describe how the two measurements relate to the size of the unit chosen.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.D',
    eloDescription: 'Measure and estimate lengths in standard units.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.3',
    description: 'Estimate lengths using units of inches, feet, centimeters, and meters.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.D',
    eloDescription: 'Measure and estimate lengths in standard units.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.MD.4',
    description: 'Measure to determine how much longer one object is than another, expressing the length difference in terms of a standard length unit.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.2.MAD.D',
    eloDescription: 'Measure and estimate lengths in standard units.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.1',
    description: 'Tell and write time to the nearest minute and measure time intervals in minutes. Solve word problems involving addition and subtraction of time intervals in minutes, e.g., by representing the problem on a number line diagram.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.A',
    eloDescription: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.2',
    description: 'Measure and estimate liquid volumes and masses of objects using standard units of grams (g), kilograms (kg), and liters (l). Add, subtract, multiply, or divide to solve one-step word problems involving masses or volumes that are given in the same units, e.g., by using drawings (such as a beaker with a measurement scale) to represent the problem.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.A',
    eloDescription: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.3',
    description: 'Draw a scaled picture graph and a scaled bar graph to represent a data set with several categories. Solve one- and two-step "how many more" and "how many less" problems using information presented in scaled bar graphs.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.B',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.4',
    description: 'Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch. Show the data by making a line plot, where the horizontal scale is marked off in appropriate units— whole numbers, halves, or quarters.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.B',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.5',
    description: 'Recognize area as an attribute of plane figures and understand concepts of area measurement.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.6',
    description: 'Measure areas by counting unit squares (square cm, square m, square in, square ft, and improvised units).',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.7',
    description: 'Relate area to the operations of multiplication and addition.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.MD.8',
    description: 'Solve real world and mathematical problems involving perimeters of polygons, including finding the perimeter given the side lengths, finding an unknown side length, and exhibiting rectangles with the same perimeter and different areas or with the same area and different perimeters.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.D',
    eloDescription: 'Geometric measurement: recognize perimeter as an attribute of plane figures and distinguish between linear and area measures.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.4',
    description: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8). Solve problems involving addition and subtraction of fractions by using information presented in line plots.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.A',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.5',
    description: 'Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint, and understand concepts of angle measurement:',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of angle and measure angles.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.6',
    description: 'Measure angles in whole-number degrees using a protractor. Sketch angles of specified measure.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of angle and measure angles.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.7',
    description: 'Recognize angle measure as additive. When an angle is decomposed into non-overlapping parts, the angle measure of the whole is the sum of the angle measures of the parts. Solve addition and subtraction problems to find unknown angles on a diagram in real world and mathematical problems, e.g., by using an equation with a symbol for the unknown angle measure.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of angle and measure angles.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.1',
    description: 'Know relative sizes of measurement units within one system of units including km, m, cm; kg, g; lb, oz.; l, ml; hr, min, sec. Within a single system of measurement, express measurements in a larger unit in terms of a smaller unit. Record measurement equivalents in a two column table.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.C',
    eloDescription: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.2',
    description: 'Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money, including problems involving simple fractions or decimals, and problems that require expressing measurements given in a larger unit in terms of a smaller unit. Represent measurement quantities using diagrams such as number line diagrams that feature a measurement scale.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.C',
    eloDescription: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.MD.3',
    description: 'Apply the area and perimeter formulas for rectangles in real world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.C',
    eloDescription: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.MD.2',
    description: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8). Use operations on fractions for this grade to solve problems involving information presented in line plots.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.A',
    eloDescription: 'Represent and interpret data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.MD.3',
    description: 'Recognize volume as an attribute of solid figures and understand concepts of volume measurement.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.MD.4',
    description: 'Measure volumes by counting unit cubes, using cubic cm, cubic in, cubic ft, and improvised units.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.MD.5',
    description: 'Relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.MD.1',
    description: 'Convert among different-sized standard measurement units within a given measurement system (e.g., convert 5 cm to 0.05 m), and use these conversions in solving multi-step, real world problems.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.C',
    eloDescription: 'Convert like measurement units within a given measurement system.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.G.4',
    description: 'Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts (e.g., number of sides and vertices/"corners") and other attributes (e.g., having sides of equal length).',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.K.G.A',
    eloDescription: 'Analyze, compare, create, and compose shapes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.G.5',
    description: 'Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.K.G.A',
    eloDescription: 'Analyze, compare, create, and compose shapes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.G.6',
    description: 'Compose simple shapes to form larger shapes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.K.G.A',
    eloDescription: 'Analyze, compare, create, and compose shapes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.G.1',
    description: 'Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.K.G.B',
    eloDescription: 'Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.G.2',
    description: 'Correctly name shapes regardless of their orientations or overall size.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.K.G.B',
    eloDescription: 'Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_ELO',
    identifier: 'K.G.3',
    description: 'Identify shapes as two-dimensional (lying in a plane, "flat") or three-dimensional ("solid").',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.K.G.B',
    eloDescription: 'Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.G.1',
    description: 'Distinguish between defining attributes (e.g., triangles are closed and three-sided) versus non-defining attributes (e.g., color, orientation, overall size); build and draw shapes to possess defining attributes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.1.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.G.2',
    description: 'Compose two-dimensional shapes (rectangles, squares, trapezoids, triangles, half-circles, and quarter-circles) or three-dimensional shapes (cubes, right rectangular prisms, right circular cones, and right circular cylinders) to create a composite shape, and compose new shapes from the composite shape.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.1.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_ELO',
    identifier: '1.G.3',
    description: 'Partition circles and rectangles into two and four equal shares, describe the shares using the words halves, fourths, and quarters, and use the phrases half of, fourth of, and quarter of. Describe the whole as two of, or four of the shares. Understand for these examples that decomposing into more equal shares creates smaller shares.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.1.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.G.1',
    description: 'Recognize and draw shapes having specified attributes, such as a given number of angles or a given number of equal faces. Identify triangles, quadrilaterals, pentagons, hexagons, and cubes.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.2.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.G.2',
    description: 'Partition a rectangle into rows and columns of same-size squares and count to find the total number of them.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.2.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_ELO',
    identifier: '2.G.3',
    description: 'Partition circles and rectangles into two, three, or four equal shares, describe the shares using the words halves, thirds, half of, a third of, etc., and describe the whole as two halves, three thirds, four fourths. Recognize that equal shares of identical wholes need not have the same shape.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.2.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.G.1',
    description: 'Understand that shapes in different categories (e.g., rhombuses, rectangles, and others) may share attributes (e.g., having four sides), and that the shared attributes can define a larger category (e.g., quadrilaterals). Recognize rhombuses, rectangles, and squares as examples of quadrilaterals, and draw examples of quadrilaterals that do not belong to any of these subcategories.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.3.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.G.2',
    description: 'Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.3.G.A',
    eloDescription: 'Reason with shapes and their attributes.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.G.1',
    description: 'Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines. Identify these in two-dimensional figures.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.4.G.A',
    eloDescription: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.G.2',
    description: 'Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size. Recognize right triangles as a category, and identify right triangles. (Two-dimensional shapes should include special triangles, e.g., equilateral, isosceles, scalene, and special quadrilaterals, e.g., rhombus, square, rectangle, parallelogram, trapezoid.)',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.4.G.A',
    eloDescription: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.G.3',
    description: 'Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts. Identify line-symmetric figures and draw lines of symmetry.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.4.G.A',
    eloDescription: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.G.1',
    description: 'Use a pair of perpendicular number lines, called axes, to define a coordinate system, with the intersection of the lines (the origin) arranged to coincide with the 0 on each line and a given point in the plane located by using an ordered pair of numbers, called its coordinates. Understand that the first number indicates how far to travel from the origin in the direction of one axis, and the second number indicates how far to travel in the direction of the second axis, with the convention that the names of the two axes and the coordinates correspond (e.g., x-axis and x-coordinate, y-axis and y-coordinate).',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.5.G.A',
    eloDescription: 'Graph points on the coordinate plane to solve real-world and mathematical problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.G.2',
    description: 'Represent real world and mathematical problems by graphing points in the first quadrant of the coordinate plane, and interpret coordinate values of points in the context of the situation.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.5.G.A',
    eloDescription: 'Graph points on the coordinate plane to solve real-world and mathematical problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.G.3',
    description: 'Understand that attributes belonging to a category of two-dimensional figures also belong to all subcategories of that category.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.5.G.B',
    eloDescription: 'Classify two-dimensional figures into categories based on their properties.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.G.4',
    description: 'Classify two-dimensional figures in a hierarchy based on properties.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.5.G.B',
    eloDescription: 'Classify two-dimensional figures into categories based on their properties.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.G.1',
    description: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.6.G.A',
    eloDescription: 'Solve real-world and mathematical problems involving area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.G.2',
    description: 'Find the volume of a right rectangular prism with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism. Apply the formulas V = l w h and V = b h to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.6.G.A',
    eloDescription: 'Solve real-world and mathematical problems involving area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.G.3',
    description: 'Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate. Apply these techniques in the context of solving real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.6.G.A',
    eloDescription: 'Solve real-world and mathematical problems involving area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.G.4',
    description: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures. Apply these techniques in the context of solving real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.6.G.A',
    eloDescription: 'Solve real-world and mathematical problems involving area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.G.1',
    description: 'Solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing and reproducing a scale drawing at a different scale.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.7.G.A',
    eloDescription: 'Draw, construct, and describe geometrical figures and describe the relationships between them.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.G.2',
    description: 'Draw (freehand, with ruler and protractor, and with technology) geometric shapes with given conditions. Focus on constructing triangles from three measures of angles or sides, noticing when the conditions determine a unique triangle, more than one triangle, or no triangle.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.7.G.A',
    eloDescription: 'Draw, construct, and describe geometrical figures and describe the relationships between them.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.G.3',
    description: 'Describe the two-dimensional figures that result from slicing three-dimensional figures, as in plane sections of right rectangular prisms and right rectangular pyramids.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.7.G.A',
    eloDescription: 'Draw, construct, and describe geometrical figures and describe the relationships between them.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.G.4',
    description: 'Know the formulas for the area and circumference of a circle and use them to solve problems; give an informal derivation of the relationship between the circumference and area of a circle.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.7.G.B',
    eloDescription: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.G.5',
    description: 'Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.7.G.B',
    eloDescription: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.G.6',
    description: 'Solve real-world and mathematical problems involving area, volume and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.7.G.B',
    eloDescription: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.1',
    description: 'Verify experimentally the properties of rotations, reflections, and translations:',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.2',
    description: 'Understand that a two-dimensional figure is congruent to another if the second can be obtained from the first by a sequence of rotations, reflections, and translations; given two congruent figures, describe a sequence that exhibits the congruence between them.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.3',
    description: 'Describe the effect of dilations, translations, rotations, and reflections on two-dimensional figures using coordinates.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.4',
    description: 'Understand that a two-dimensional figure is similar to another if the second can be obtained from the first by a sequence of rotations, reflections, translations, and dilations; given two similar two-dimensional figures, describe a sequence that exhibits the similarity between them.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.5',
    description: 'Use informal arguments to establish facts about the angle sum and exterior angle of triangles, about the angles created when parallel lines are cut by a transversal, and the angle-angle criterion for similarity of triangles.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.6',
    description: 'Explain a proof of the Pythagorean Theorem and its converse.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.B',
    eloDescription: 'Understand and apply the Pythagorean Theorem.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.7',
    description: 'Apply the Pythagorean Theorem to determine unknown side lengths in right triangles in real-world and mathematical problems in two and three dimensions.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.B',
    eloDescription: 'Understand and apply the Pythagorean Theorem.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.8',
    description: 'Apply the Pythagorean Theorem to find the distance between two points in a coordinate system.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.B',
    eloDescription: 'Understand and apply the Pythagorean Theorem.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.G.9',
    description: 'Know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.C',
    eloDescription: 'Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.NF.1',
    description: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts; understand a fraction a/b as the quantity formed by a parts of size 1/b.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.NF.2',
    description: 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_ELO',
    identifier: '3.NF.3',
    description: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.1',
    description: 'Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) by using visual fraction models, with attention to how the number and size of the parts differ even though the two fractions themselves are the same size. Use this principle to recognize and generate equivalent fractions.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.A',
    eloDescription: 'Extend understanding of fraction equivalence and ordering.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.2',
    description: 'Compare two fractions with different numerators and different denominators, e.g., by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1/2. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.A',
    eloDescription: 'Extend understanding of fraction equivalence and ordering.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.3',
    description: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.4',
    description: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.5',
    description: 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.C',
    eloDescription: 'Understand decimal notation for fractions, and compare decimal fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.6',
    description: 'Use decimal notation for fractions with denominators 10 or 100.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.C',
    eloDescription: 'Understand decimal notation for fractions, and compare decimal fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_ELO',
    identifier: '4.NF.7',
    description: 'Compare two decimals to hundredths by reasoning about their size. Recognize that comparisons are valid only when the two decimals refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using the number line or another visual model.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.C',
    eloDescription: 'Understand decimal notation for fractions, and compare decimal fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.1',
    description: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.A',
    eloDescription: 'Use equivalent fractions as a strategy to add and subtract fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.2',
    description: 'Solve word problems involving addition and subtraction of fractions referring to the same whole, including cases of unlike denominators, e.g., by using visual fraction models or equations to represent the problem. Use benchmark fractions and number sense of fractions to estimate mentally and assess the reasonableness of answers.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.A',
    eloDescription: 'Use equivalent fractions as a strategy to add and subtract fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.3',
    description: 'Interpret a fraction as division of the numerator by the denominator (a/b = a ÷ b). Solve word problems involving division of whole numbers leading to answers in the form of fractions or mixed numbers, e.g., by using visual fraction models or equations to represent the problem.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.4',
    description: 'Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.5',
    description: 'Interpret multiplication as scaling (resizing), by:',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.6',
    description: 'Solve real world problems involving multiplication of fractions and mixed numbers, e.g., by using visual fraction models or equations to represent the problem.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_ELO',
    identifier: '5.NF.7',
    description: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.SP.1',
    description: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.A',
    eloDescription: 'Develop understanding of statistical variability.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.SP.2',
    description: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.A',
    eloDescription: 'Develop understanding of statistical variability.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.SP.3',
    description: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.A',
    eloDescription: 'Develop understanding of statistical variability.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.SP.4',
    description: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.B',
    eloDescription: 'Summarize and describe distributions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.SP.5',
    description: 'Summarize numerical data sets in relation to their context, such as by:',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.B',
    eloDescription: 'Summarize and describe distributions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.1',
    description: 'Understand that statistics can be used to gain information about a population by examining a sample of the population; generalizations about a population from a sample are valid only if the sample is representative of that population. Understand that random sampling tends to produce representative samples and support valid inferences.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.A',
    eloDescription: 'Use random sampling to draw inferences about a population.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.2',
    description: 'Use data from a random sample to draw inferences about a population with an unknown characteristic of interest. Generate multiple samples (or simulated samples) of the same size to gauge the variation in estimates or predictions.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.A',
    eloDescription: 'Use random sampling to draw inferences about a population.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.3',
    description: 'Informally assess the degree of visual overlap of two numerical data distributions with similar variabilities, measuring the difference between the centers by expressing it as a multiple of a measure of variability.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.B',
    eloDescription: 'Draw informal comparative inferences about two populations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.4',
    description: 'Use measures of center and measures of variability for numerical data from random samples to draw informal comparative inferences about two populations.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.B',
    eloDescription: 'Draw informal comparative inferences about two populations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.5',
    description: 'Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring. Larger numbers indicate greater likelihood. A probability near 0 indicates an unlikely event, a probability around 1/2 indicates an event that is neither unlikely nor likely, and a probability near 1 indicates a likely event.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.6',
    description: 'Approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency, and predict the approximate relative frequency given the probability.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.7',
    description: 'Develop a probability model and use it to find probabilities of events. Compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.SP.8',
    description: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.SP.1',
    description: 'Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities. Describe patterns such as clustering, outliers, positive or negative association, linear association, and nonlinear association.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.8.SAP.A',
    eloDescription: 'Investigate patterns of association in bivariate data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.SP.2',
    description: 'Know that straight lines are widely used to model relationships between two quantitative variables. For scatter plots that suggest a linear association, informally fit a straight line, and informally assess the model fit by judging the closeness of the data points to the line.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.8.SAP.A',
    eloDescription: 'Investigate patterns of association in bivariate data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.SP.3',
    description: 'Use the equation of a linear model to solve problems in the context of bivariate measurement data, interpreting the slope and intercept.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.8.SAP.A',
    eloDescription: 'Investigate patterns of association in bivariate data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.SP.4',
    description: 'Understand that patterns of association can also be seen in bivariate categorical data by displaying frequencies and relative frequencies in a two-way table. Construct and interpret a two-way table summarizing data on two categorical variables collected from the same subjects. Use relative frequencies calculated for rows or columns to describe possible association between the two variables.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.8.SAP.A',
    eloDescription: 'Investigate patterns of association in bivariate data.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.9',
    description: 'Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable. Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.A',
    eloDescription: 'Represent and analyze quantitative relationships between dependent and independent variables.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.1',
    description: 'Write and evaluate numerical expressions involving whole-number exponents.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.2',
    description: 'Write, read, and evaluate expressions in which letters stand for numbers.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.3',
    description: 'Apply the properties of operations to generate equivalent expressions.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.4',
    description: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.5',
    description: 'Understand solving an equation or inequality as a process of answering a question: which values from a specified set, if any, make the equation or inequality true? Use substitution to determine whether a given number in a specified set makes an equation or inequality true.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.C',
    eloDescription: 'Reason about and solve one-variable equations and inequalities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.6',
    description: 'Use variables to represent numbers and write expressions when solving a real-world or mathematical problem; understand that a variable can represent an unknown number, or, depending on the purpose at hand, any number in a specified set.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.C',
    eloDescription: 'Reason about and solve one-variable equations and inequalities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.7',
    description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.C',
    eloDescription: 'Reason about and solve one-variable equations and inequalities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.EE.8',
    description: 'Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem. Recognize that inequalities of the form x > c or x < c have infinitely many solutions; represent solutions of such inequalities on number line diagrams.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.C',
    eloDescription: 'Reason about and solve one-variable equations and inequalities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.EE.3',
    description: 'Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form (whole numbers, fractions, and decimals), using tools strategically. Apply properties of operations to calculate with numbers in any form; convert between forms as appropriate; and assess the reasonableness of answers using mental computation and estimation strategies.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.7.EAE.A',
    eloDescription: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.EE.4',
    description: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.7.EAE.A',
    eloDescription: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.EE.1',
    description: 'Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.7.EAE.B',
    eloDescription: 'Use properties of operations to generate equivalent expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.EE.2',
    description: 'Understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.7.EAE.B',
    eloDescription: 'Use properties of operations to generate equivalent expressions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.1',
    description: 'Know and apply the properties of integer exponents to generate equivalent numerical expressions.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.A',
    eloDescription: 'Work with radicals and integer exponents.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.2',
    description: 'Use square root and cube root symbols to represent solutions to equations of the form x² = p and x³ = p, where p is a positive rational number. Evaluate square roots of small perfect squares and cube roots of small perfect cubes. Know that √2 is irrational.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.A',
    eloDescription: 'Work with radicals and integer exponents.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.3',
    description: 'Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities, and to express how many times as much one is than the other.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.A',
    eloDescription: 'Work with radicals and integer exponents.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.4',
    description: 'Perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used. Use scientific notation and choose units of appropriate size for measurements of very large or very small quantities (e.g., use millimeters per year for seafloor spreading). Interpret scientific notation that has been generated by technology.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.A',
    eloDescription: 'Work with radicals and integer exponents.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.5',
    description: 'Graph proportional relationships, interpreting the unit rate as the slope of the graph. Compare two different proportional relationships represented in different ways.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.B',
    eloDescription: 'Understand the connections between proportional relationships, lines, and linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.6',
    description: 'Use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line in the coordinate plane; derive the equation y = mx for a line through the origin and the equation y = mx + b for a line intercepting the vertical axis at b.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.B',
    eloDescription: 'Understand the connections between proportional relationships, lines, and linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.7',
    description: 'Solve linear equations in one variable.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.EE.8',
    description: 'Analyze and solve pairs of simultaneous linear equations.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.RP.1',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.RP.2',
    description: 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.RP.3',
    description: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.RP.1',
    description: 'Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.RP.2',
    description: 'Recognize and represent proportional relationships between quantities.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.RP.3',
    description: 'Use proportional relationships to solve multistep ratio and percent problems.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.1',
    description: 'Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions, e.g., by using visual fraction models and equations to represent the problem.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.A',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to divide fractions by fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.2',
    description: 'Fluently divide multi-digit numbers using the standard algorithm.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.B',
    eloDescription: 'Compute fluently with multi-digit numbers and find common factors and multiples.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.3',
    description: 'Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.B',
    eloDescription: 'Compute fluently with multi-digit numbers and find common factors and multiples.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.4',
    description: 'Find the greatest common factor of two whole numbers less than or equal to 100 and the least common multiple of two whole numbers less than or equal to 12. Use the distributive property to express a sum of two whole numbers 1—100 with a common factor as a multiple of a sum of two whole numbers with no common factor.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.B',
    eloDescription: 'Compute fluently with multi-digit numbers and find common factors and multiples.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.5',
    description: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values (e.g., temperature above/below zero, elevation above/below sea level, credits/debits, positive/negative electric charge); use positive and negative numbers to represent quantities in real-world contexts, explaining the meaning of 0 in each situation.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.6',
    description: 'Understand a rational number as a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.7',
    description: 'Understand ordering and absolute value of rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_ELO',
    identifier: '6.NS.8',
    description: 'Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane. Include use of coordinates and absolute value to find distances between points with the same first coordinate or the same second coordinate.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.NS.1',
    description: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.NS.2',
    description: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_ELO',
    identifier: '7.NS.3',
    description: 'Solve real-world and mathematical problems involving the four operations with rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.NS.1',
    description: 'Know that numbers that are not rational are called irrational. Understand informally that every number has a decimal expansion; for rational numbers show that the decimal expansion repeats eventually, and convert a decimal expansion which repeats eventually into a rational number.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.8.TNS.A',
    eloDescription: 'Know that there are numbers that are not rational, and approximate them by rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.NS.2',
    description: 'Use rational approximations of irrational numbers to compare the size of irrational numbers, locate them approximately on a number line diagram, and estimate the value of expressions (e.g., π²).',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.8.TNS.A',
    eloDescription: 'Know that there are numbers that are not rational, and approximate them by rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.F.1',
    description: 'Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output.',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions',
    eloIdentifier: 'CA.MA.8.F.A',
    eloDescription: 'Define, evaluate, and compare functions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.F.2',
    description: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions',
    eloIdentifier: 'CA.MA.8.F.A',
    eloDescription: 'Define, evaluate, and compare functions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.F.3',
    description: 'Interpret the equation y = mx + b as defining a linear function, whose graph is a straight line; give examples of functions that are not linear.',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions',
    eloIdentifier: 'CA.MA.8.F.A',
    eloDescription: 'Define, evaluate, and compare functions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.F.4',
    description: 'Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values, including reading these from a table or from a graph. Interpret the rate of change and initial value of a linear function in terms of the situation it models, and in terms of its graph or a table of values.',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions',
    eloIdentifier: 'CA.MA.8.F.B',
    eloDescription: 'Use functions to model relationships between quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_ELO',
    identifier: '8.F.5',
    description: 'Describe qualitatively the functional relationship between two quantities by analyzing a graph (e.g., where the function is increasing or decreasing, linear or nonlinear). Sketch a graph that exhibits the qualitative features of a function that has been described verbally.',
    tloIdentifier: 'CA.MA.8.F',
    tloDescription: 'Functions',
    eloIdentifier: 'CA.MA.8.F.B',
    eloDescription: 'Use functions to model relationships between quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.A.1',
    description: 'Understand the concept of a function and use function notation',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.A.2',
    description: 'Interpret functions that arise in applications in terms of the context',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.A.3',
    description: 'Analyze functions using different representations',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.B.1',
    description: 'Build a function that models a relationship between two quantities',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.B.2',
    description: 'Build new functions from existing functions',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.C.1',
    description: 'Construct and compare linear, quadratic, and exponential models and solve problems',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.C.2',
    description: 'Interpret expressions for functions in terms of the situation they model',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.D.1',
    description: 'Extend the domain of trigonometric functions using the unit circle',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.D.2',
    description: 'Model periodic phenomena with trigonometric functions',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCF.D.3',
    description: 'Prove and apply trigonometric identities',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.A.1',
    description: 'Summarize, represent, and interpret data on a single count or measurement variable',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.A.2',
    description: 'Summarize, represent, and interpret data on two categorical and quantitative variables',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.A.3',
    description: 'Interpret linear models',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.B.1',
    description: 'Understand and evaluate random processes underlying statistical experiments',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.B.2',
    description: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.C.1',
    description: 'Understand independence and conditional probability and use them to interpret data',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.C.2',
    description: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.D.1',
    description: 'Calculate expected values and use them to solve problems',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCSAP.D.2',
    description: 'Use probability to evaluate outcomes of decisions',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.A.1',
    description: 'Students prove and use theorems evaluating the limits of sums, products, quotients, and composition of functions.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.A',
    eloDescription: 'Students demonstrate knowledge of both the formal definition and the graphical interpretation of limit of values of functions. This knowledge includes one-sided limits, infinite limits, and limits at infinity. Students know the definition of convergence and divergence of a function as the domain variable approaches either a number or infinity:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.A.2',
    description: 'Students use graphical calculators to verify and estimate limits.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.A',
    eloDescription: 'Students demonstrate knowledge of both the formal definition and the graphical interpretation of limit of values of functions. This knowledge includes one-sided limits, infinite limits, and limits at infinity. Students know the definition of convergence and divergence of a function as the domain variable approaches either a number or infinity:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.A.3',
    description: 'Students prove and use special limits, such as the limits of (sin(x))/x and (1-cos(x))/x as x tends to 0.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.A',
    eloDescription: 'Students demonstrate knowledge of both the formal definition and the graphical interpretation of limit of values of functions. This knowledge includes one-sided limits, infinite limits, and limits at infinity. Students know the definition of convergence and divergence of a function as the domain variable approaches either a number or infinity:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.D.1',
    description: 'Students demonstrate an understanding of the derivative of a function as the slope of the tangent line to the graph of the function.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.D',
    eloDescription: 'Students demonstrate an understanding of the formal definition of the derivative of a function at a point and the notion of differentiability:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.D.2',
    description: 'Students demonstrate an understanding of the interpretation of the derivative as an instantaneous rate of change. Students can use derivatives to solve a variety of problems from physics, chemistry, economics, and so forth that involve the rate of change of a function.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.D',
    eloDescription: 'Students demonstrate an understanding of the formal definition of the derivative of a function at a point and the notion of differentiability:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.D.3',
    description: 'Students understand the relation between differentiability and continuity.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.D',
    eloDescription: 'Students demonstrate an understanding of the formal definition of the derivative of a function at a point and the notion of differentiability:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCC.D.4',
    description: 'Students derive derivative formulas and use them to find the derivatives of algebraic, trigonometric, inverse trigonometric, exponential, and logarithmic functions.',
    tloIdentifier: 'CA.MA.9-12.HMCC',
    tloDescription: 'Higher Mathematics Course — Calculus',
    eloIdentifier: 'CA.MA.9-12.HMCC.D',
    eloDescription: 'Students demonstrate an understanding of the formal definition of the derivative of a function at a point and the notion of differentiability:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.A.1',
    description: 'Extend the properties of exponents to rational exponents.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.A',
    eloDescription: 'The Real Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.A.2',
    description: 'Use properties of rational and irrational numbers.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.A',
    eloDescription: 'The Real Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.B.1',
    description: 'Reason quantitatively and use units to solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.B',
    eloDescription: 'Quantities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.C.1',
    description: 'Perform arithmetic operations with complex numbers.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.C.2',
    description: 'Represent complex numbers and their operations on the complex plane.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.C.3',
    description: 'Use complex numbers in polynomial identities and equations.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.D.1',
    description: 'Represent and model with vector quantities.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.D.2',
    description: 'Perform operations on vectors.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCNAQ.D.3',
    description: 'Perform operations on matrices and use matrices in applications.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.A.1',
    description: 'Interpret the structure of expressions',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.A',
    eloDescription: 'Seeing Structure in Expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.A.2',
    description: 'Write expressions in equivalent forms to solve problems',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.A',
    eloDescription: 'Seeing Structure in Expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.B.1',
    description: 'Perform arithmetic operations on polynomials',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.B.2',
    description: 'Understand the relationship between zeros and factors of polynomials',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.B.3',
    description: 'Use polynomial identities to solve problems',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.B.4',
    description: 'Rewrite rational expressions',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.C.1',
    description: 'Create equations that describe numbers or relationships',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.C',
    eloDescription: 'Creating Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.D.1',
    description: 'Solve equations and inequalities in one variable',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.D.2',
    description: 'Solve systems of equations',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.D.3',
    description: 'Represent and solve equations and inequalities graphically',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCA.D.4',
    description: 'Understand solving equations as a process of reasoning and explain the reasoning',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.A.1',
    description: 'Understand similarity in terms of similarity transformations',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.A.2',
    description: 'Prove theorems involving similarity',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.A.3',
    description: 'Define trigonometric ratios and solve problems involving right triangles',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.A.4',
    description: 'Apply trigonometry to general triangles',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.B.1',
    description: 'Understand and apply theorems about circles',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.B.2',
    description: 'Find arc lengths and areas of sectors of circles',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.C.1',
    description: 'Translate between the geometric description and the equation for a conic section',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.C.2',
    description: 'Use coordinates to prove simple geometric theorems algebraically',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.D.1',
    description: 'Explain volume formulas and use them to solve problems',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.D.2',
    description: 'Visualize relationships between two-dimensional and three-dimensional objects',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.E.1',
    description: 'Apply geometric concepts in modeling situations',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.E',
    eloDescription: 'Modeling with Geometry'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.F.1',
    description: 'Prove geometric theorems',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.F.2',
    description: 'Make geometric constructions',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.F.3',
    description: 'Experiment with transformations in the plane',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_ELO',
    identifier: 'CA.MA.9-12.HMCG.F.4',
    description: 'Understand congruence in terms of rigid motions',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'K.CC.4.a',
    description: 'When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.',
    subEloIdentifier: 'K.CC.4',
    subEloDescription: 'Understand the relationship between numbers and quantities; connect counting to cardinality.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'K.CC.4.b',
    description: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.',
    subEloIdentifier: 'K.CC.4',
    subEloDescription: 'Understand the relationship between numbers and quantities; connect counting to cardinality.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      'K'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'K.CC.4.c',
    description: 'Understand that each successive number name refers to a quantity that is one larger.',
    tloIdentifier: 'CA.MA.K.CAC',
    tloDescription: 'Counting and Cardinality',
    eloIdentifier: 'CA.MA.K.CAC.B',
    eloDescription: 'Count to tell the number of objects.',
    subEloIdentifier: 'K.CC.4',
    subEloDescription: 'Understand the relationship between numbers and quantities; connect counting to cardinality.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '1.NBT.2.a',
    description: '10 can be thought of as a bundle of ten ones — called a "ten."',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.C',
    eloDescription: 'Understand place value.',
    subEloIdentifier: '1.NBT.2',
    subEloDescription: 'Understand that the two digits of a two-digit number represent amounts of tens and ones. Understand the following as special cases:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '1.NBT.2.b',
    description: 'The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.C',
    eloDescription: 'Understand place value.',
    subEloIdentifier: '1.NBT.2',
    subEloDescription: 'Understand that the two digits of a two-digit number represent amounts of tens and ones. Understand the following as special cases:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '1'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '1.NBT.2.c',
    description: 'The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.1.NAOIBT.C',
    eloDescription: 'Understand place value.',
    subEloIdentifier: '1.NBT.2',
    subEloDescription: 'Understand that the two digits of a two-digit number represent amounts of tens and ones. Understand the following as special cases:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '2.NBT.1.a',
    description: '100 can be thought of as a bundle of ten tens — called a "hundred."',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.A',
    eloDescription: 'Understand place value.',
    subEloIdentifier: '2.NBT.1',
    subEloDescription: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones. Understand the following as special cases:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '2'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '2.NBT.1.b',
    description: 'The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one, two, three, four, five, six, seven, eight, or nine hundreds (and 0 tens and 0 ones).',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.2.NAOIBT.A',
    eloDescription: 'Understand place value.',
    subEloIdentifier: '2.NBT.1',
    subEloDescription: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones. Understand the following as special cases:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NBT.3.a',
    description: 'Read and write decimals to thousandths using base-ten numerals, number names, and expanded form, e.g., 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1/10) + 9 × (1/100) + 2 × (1/1000).',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.A',
    eloDescription: 'Understand the place value system.',
    subEloIdentifier: '5.NBT.3',
    subEloDescription: 'Read, write, and compare decimals to thousandths.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NBT.3.b',
    description: 'Compare two decimals to thousandths based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.',
    tloIdentifier: 'CA.MA.K-3.NAOIBT',
    tloDescription: 'Number and Operations in Base Ten',
    eloIdentifier: 'CA.MA.5.NAOIBT.A',
    eloDescription: 'Understand the place value system.',
    subEloIdentifier: '5.NBT.3',
    subEloDescription: 'Read, write, and compare decimals to thousandths.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.MD.5.a',
    description: 'A square with side length 1 unit, called "a unit square," is said to have "one square unit" of area, and can be used to measure area.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    subEloIdentifier: '3.MD.5',
    subEloDescription: 'Recognize area as an attribute of plane figures and understand concepts of area measurement.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.MD.5.b',
    description: 'A plane figure which can be covered without gaps or overlaps by n unit squares is said to have an area of n square units.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    subEloIdentifier: '3.MD.5',
    subEloDescription: 'Recognize area as an attribute of plane figures and understand concepts of area measurement.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.MD.7.a',
    description: 'Find the area of a rectangle with whole-number side lengths by tiling it, and show that the area is the same as would be found by multiplying the side lengths.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    subEloIdentifier: '3.MD.7',
    subEloDescription: 'Relate area to the operations of multiplication and addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.MD.7.b',
    description: 'Multiply side lengths to find areas of rectangles with whole-number side lengths in the context of solving real world and mathematical problems, and represent whole-number products as rectangular areas in mathematical reasoning.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    subEloIdentifier: '3.MD.7',
    subEloDescription: 'Relate area to the operations of multiplication and addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.MD.7.c',
    description: 'Use tiling to show in a concrete case that the area of a rectangle with whole-number side lengths a and b + c is the sum of a × b and a × c. Use area models to represent the distributive property in mathematical reasoning.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    subEloIdentifier: '3.MD.7',
    subEloDescription: 'Relate area to the operations of multiplication and addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.MD.7.d',
    description: 'Recognize area as additive. Find areas of rectilinear figures by decomposing them into non-overlapping rectangles and adding the areas of the non-overlapping parts, applying this technique to solve real world problems.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.3.MAD.C',
    eloDescription: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    subEloIdentifier: '3.MD.7',
    subEloDescription: 'Relate area to the operations of multiplication and addition.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.MD.5.a',
    description: 'An angle is measured with reference to a circle with its center at the common endpoint of the rays, by considering the fraction of the circular arc between the points where the two rays intersect the circle. An angle that turns through 1/360 of a circle is called a "one-degree angle," and can be used to measure angles.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of angle and measure angles.',
    subEloIdentifier: '4.MD.5',
    subEloDescription: 'Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint, and understand concepts of angle measurement:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.MD.5.b',
    description: 'An angle that turns through n one-degree angles is said to have an angle measure of n degrees.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.4.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of angle and measure angles.',
    subEloIdentifier: '4.MD.5',
    subEloDescription: 'Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint, and understand concepts of angle measurement:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.MD.3.a',
    description: 'A cube with side length 1 unit, called a "unit cube," is said to have "one cubic unit" of volume, and can be used to measure volume.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    subEloIdentifier: '5.MD.3',
    subEloDescription: 'Recognize volume as an attribute of solid figures and understand concepts of volume measurement.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.MD.3.b',
    description: 'A solid figure which can be packed without gaps or overlaps using n unit cubes is said to have a volume of n cubic units.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    subEloIdentifier: '5.MD.3',
    subEloDescription: 'Recognize volume as an attribute of solid figures and understand concepts of volume measurement.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.MD.5.a',
    description: 'Find the volume of a right rectangular prism with whole-number side lengths by packing it with unit cubes, and show that the volume is the same as would be found by multiplying the edge lengths, equivalently by multiplying the height by the area of the base. Represent threefold whole-number products as volumes, e.g., to represent the associative property of multiplication.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    subEloIdentifier: '5.MD.5',
    subEloDescription: 'Relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.MD.5.b',
    description: 'Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with whole-number edge lengths in the context of solving real world and mathematical problems.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    subEloIdentifier: '5.MD.5',
    subEloDescription: 'Relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.MD.5.c',
    description: 'Recognize volume as additive. Find volumes of solid figures composed of two non-overlapping right rectangular prisms by adding the volumes of the non-overlapping parts, applying this technique to solve real world problems.',
    tloIdentifier: 'CA.MA.K-3.MAD',
    tloDescription: 'Measurement and Data',
    eloIdentifier: 'CA.MA.5.MAD.B',
    eloDescription: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    subEloIdentifier: '5.MD.5',
    subEloDescription: 'Relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.G.1.a',
    description: 'Lines are taken to lines, and line segments to line segments of the same length.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.',
    subEloIdentifier: '8.G.1',
    subEloDescription: 'Verify experimentally the properties of rotations, reflections, and translations:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.G.1.b',
    description: 'Angles are taken to angles of the same measure.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.',
    subEloIdentifier: '8.G.1',
    subEloDescription: 'Verify experimentally the properties of rotations, reflections, and translations:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.G.1.c',
    description: 'Parallel lines are taken to parallel lines.',
    tloIdentifier: 'CA.MA.K-3.G',
    tloDescription: 'Geometry',
    eloIdentifier: 'CA.MA.8.G.A',
    eloDescription: 'Understand congruence and similarity using physical models, transparencies, or geometry software.',
    subEloIdentifier: '8.G.1',
    subEloDescription: 'Verify experimentally the properties of rotations, reflections, and translations:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.NF.2.a',
    description: 'Represent a fraction 1/b on a number line diagram by defining the interval from 0 to 1 as the whole and partitioning it into b equal parts. Recognize that each part has size 1/b and that the endpoint of the part based at 0 locates the number 1/b on the number line.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.',
    subEloIdentifier: '3.NF.2',
    subEloDescription: 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.NF.2.b',
    description: 'Represent a fraction a/b on a number line diagram by marking off a lengths 1/b from 0. Recognize that the resulting interval has size a/b and that its endpoint locates the number a/b on the number line.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.',
    subEloIdentifier: '3.NF.2',
    subEloDescription: 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.NF.3.a',
    description: 'Understand two fractions as equivalent (equal) if they are the same size, or the same point on a number line.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.',
    subEloIdentifier: '3.NF.3',
    subEloDescription: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.NF.3.b',
    description: 'Recognize and generate simple equivalent fractions, e.g., 1/2 = 2/4, 4/6 = 2/3). Explain why the fractions are equivalent, e.g., by using a visual fraction model.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.',
    subEloIdentifier: '3.NF.3',
    subEloDescription: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.NF.3.c',
    description: 'Express whole numbers as fractions, and recognize fractions that are equivalent to whole numbers.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.',
    subEloIdentifier: '3.NF.3',
    subEloDescription: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '3'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '3.NF.3.d',
    description: 'Compare two fractions with the same numerator or the same denominator by reasoning about their size. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.3.NAOF.A',
    eloDescription: 'Develop understanding of fractions as numbers.',
    subEloIdentifier: '3.NF.3',
    subEloDescription: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.3.a',
    description: 'Understand addition and subtraction of fractions as joining and separating parts referring to the same whole.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.3',
    subEloDescription: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.3.b',
    description: 'Decompose a fraction into a sum of fractions with the same denominator in more than one way, recording each decomposition by an equation. Justify decompositions, e.g., by using a visual fraction model.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.3',
    subEloDescription: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.3.c',
    description: 'Add and subtract mixed numbers with like denominators, e.g., by replacing each mixed number with an equivalent fraction, and/or by using properties of operations and the relationship between addition and subtraction.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.3',
    subEloDescription: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.3.d',
    description: 'Solve word problems involving addition and subtraction of fractions referring to the same whole and having like denominators, e.g., by using visual fraction models and equations to represent the problem.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.3',
    subEloDescription: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.4.a',
    description: 'Understand a fraction a/b as a multiple of 1/b.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.4',
    subEloDescription: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.4.b',
    description: 'Understand a multiple of a/b as a multiple of 1/b, and use this understanding to multiply a fraction by a whole number.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.4',
    subEloDescription: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '4'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '4.NF.4.c',
    description: 'Solve word problems involving multiplication of a fraction by a whole number, e.g., by using visual fraction models and equations to represent the problem.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.4.NAOF.B',
    eloDescription: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    subEloIdentifier: '4.NF.4',
    subEloDescription: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.4.a',
    description: 'Interpret the product (a/b) × q as a parts of a partition of q into b equal parts; equivalently, as the result of a sequence of operations a × q ÷ b.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.4',
    subEloDescription: 'Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.4.b',
    description: 'Find the area of a rectangle with fractional side lengths by tiling it with unit squares of the appropriate unit fraction side lengths, and show that the area is the same as would be found by multiplying the side lengths. Multiply fractional side lengths to find areas of rectangles, and represent fraction products as rectangular areas.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.4',
    subEloDescription: 'Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.5.a',
    description: 'Comparing the size of a product to the size of one factor on the basis of the size of the other factor, without performing the indicated multiplication.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.5',
    subEloDescription: 'Interpret multiplication as scaling (resizing), by:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.5.b',
    description: 'Explaining why multiplying a given number by a fraction greater than 1 results in a product greater than the given number (recognizing multiplication by whole numbers greater than 1 as a familiar case); explaining why multiplying a given number by a fraction less than 1 results in a product smaller than the given number; and relating the principle of fraction equivalence a/b = (n×a)/(n×b) to the effect of multiplying a/b by 1.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.5',
    subEloDescription: 'Interpret multiplication as scaling (resizing), by:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.7.a',
    description: 'Interpret division of a unit fraction by a non-zero whole number, and compute such quotients.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.7',
    subEloDescription: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.7.b',
    description: 'Interpret division of a whole number by a unit fraction, and compute such quotients.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.7',
    subEloDescription: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '5'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '5.NF.7.c',
    description: 'Solve real world problems involving division of unit fractions by non-zero whole numbers and division of whole numbers by unit fractions, e.g., by using visual fraction models and equations to represent the problem.',
    tloIdentifier: 'CA.MA.3-5.NAOF',
    tloDescription: 'Number and Operations—Fractions',
    eloIdentifier: 'CA.MA.5.NAOF.B',
    eloDescription: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    subEloIdentifier: '5.NF.7',
    subEloDescription: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.SP.5.a',
    description: 'Reporting the number of observations.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.B',
    eloDescription: 'Summarize and describe distributions.',
    subEloIdentifier: '6.SP.5',
    subEloDescription: 'Summarize numerical data sets in relation to their context, such as by:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.SP.5.b',
    description: 'Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.B',
    eloDescription: 'Summarize and describe distributions.',
    subEloIdentifier: '6.SP.5',
    subEloDescription: 'Summarize numerical data sets in relation to their context, such as by:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.SP.5.c',
    description: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.B',
    eloDescription: 'Summarize and describe distributions.',
    subEloIdentifier: '6.SP.5',
    subEloDescription: 'Summarize numerical data sets in relation to their context, such as by:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.SP.5.d',
    description: 'Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.6.SAP.B',
    eloDescription: 'Summarize and describe distributions.',
    subEloIdentifier: '6.SP.5',
    subEloDescription: 'Summarize numerical data sets in relation to their context, such as by:'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.SP.7.a',
    description: 'Develop a uniform probability model by assigning equal probability to all outcomes, and use the model to determine probabilities of events.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.',
    subEloIdentifier: '7.SP.7',
    subEloDescription: 'Develop a probability model and use it to find probabilities of events. Compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.SP.7.b',
    description: 'Develop a probability model (which may not be uniform) by observing frequencies in data generated from a chance process.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.',
    subEloIdentifier: '7.SP.7',
    subEloDescription: 'Develop a probability model and use it to find probabilities of events. Compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.SP.8.a',
    description: 'Understand that, just as with simple events, the probability of a compound event is the fraction of outcomes in the sample space for which the compound event occurs.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.',
    subEloIdentifier: '7.SP.8',
    subEloDescription: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.SP.8.b',
    description: 'Represent sample spaces for compound events using methods such as organized lists, tables and tree diagrams. For an event described in everyday language (e.g., "rolling double sixes"), identify the outcomes in the sample space which compose the event.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.',
    subEloIdentifier: '7.SP.8',
    subEloDescription: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.SP.8.c',
    description: 'Design and use a simulation to generate frequencies for compound events.',
    tloIdentifier: 'CA.MA.6-8.SAP',
    tloDescription: 'Statistics and Probability',
    eloIdentifier: 'CA.MA.7.SAP.C',
    eloDescription: 'Investigate chance processes and develop, use, and evaluate probability models.',
    subEloIdentifier: '7.SP.8',
    subEloDescription: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.EE.2.a',
    description: 'Write expressions that record operations with numbers and with letters standing for numbers.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.',
    subEloIdentifier: '6.EE.2',
    subEloDescription: 'Write, read, and evaluate expressions in which letters stand for numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.EE.2.b',
    description: 'Identify parts of an expression using mathematical terms (sum, term, product, factor, quotient, coefficient); view one or more parts of an expression as a single entity.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.',
    subEloIdentifier: '6.EE.2',
    subEloDescription: 'Write, read, and evaluate expressions in which letters stand for numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.EE.2.c',
    description: 'Evaluate expressions at specific values of their variables. Include expressions that arise from formulas used in real-world problems. Perform arithmetic operations, including those involving whole-number exponents, in the conventional order when there are no parentheses to specify a particular order (Order of Operations).',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.6.EAE.B',
    eloDescription: 'Apply and extend previous understandings of arithmetic to algebraic expressions.',
    subEloIdentifier: '6.EE.2',
    subEloDescription: 'Write, read, and evaluate expressions in which letters stand for numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.EE.4.a',
    description: 'Solve word problems leading to equations of the form px + q = r and p(x + q) = r, where p, q, and r are specific rational numbers. Solve equations of these forms fluently. Compare an algebraic solution to an arithmetic solution, identifying the sequence of the operations used in each approach.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.7.EAE.A',
    eloDescription: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations.',
    subEloIdentifier: '7.EE.4',
    subEloDescription: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.EE.4.b',
    description: 'Solve word problems leading to inequalities of the form px + q > r or px + q < r, where p, q, and r are specific rational numbers. Graph the solution set of the inequality and interpret it in the context of the problem.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.7.EAE.A',
    eloDescription: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations.',
    subEloIdentifier: '7.EE.4',
    subEloDescription: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.EE.7.a',
    description: 'Give examples of linear equations in one variable with one solution, infinitely many solutions, or no solutions. Show which of these possibilities is the case by successively transforming the given equation into simpler forms, until an equivalent equation of the form x = a, a = a, or a = b results (where a and b are different numbers).',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    subEloIdentifier: '8.EE.7',
    subEloDescription: 'Solve linear equations in one variable.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.EE.7.b',
    description: 'Solve linear equations with rational number coefficients, including equations whose solutions require expanding expressions using the distributive property and collecting like terms.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    subEloIdentifier: '8.EE.7',
    subEloDescription: 'Solve linear equations in one variable.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.EE.8.a',
    description: 'Understand that solutions to a system of two linear equations in two variables correspond to points of intersection of their graphs, because points of intersection satisfy both equations simultaneously.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    subEloIdentifier: '8.EE.8',
    subEloDescription: 'Analyze and solve pairs of simultaneous linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.EE.8.b',
    description: 'Solve systems of two linear equations in two variables algebraically, and estimate solutions by graphing the equations. Solve simple cases by inspection.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    subEloIdentifier: '8.EE.8',
    subEloDescription: 'Analyze and solve pairs of simultaneous linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '8'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '8.EE.8.c',
    description: 'Solve real-world and mathematical problems leading to two linear equations in two variables.',
    tloIdentifier: 'CA.MA.6-8.EAE',
    tloDescription: 'Expressions and Equations',
    eloIdentifier: 'CA.MA.8.EAE.C',
    eloDescription: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    subEloIdentifier: '8.EE.8',
    subEloDescription: 'Analyze and solve pairs of simultaneous linear equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.RP.3.a',
    description: 'Make tables of equivalent ratios relating quantities with whole number measurements, find missing values in the tables, and plot the pairs of values on the coordinate plane. Use tables to compare ratios.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.',
    subEloIdentifier: '6.RP.3',
    subEloDescription: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.RP.3.b',
    description: 'Solve unit rate problems including those involving unit pricing and constant speed.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.',
    subEloIdentifier: '6.RP.3',
    subEloDescription: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.RP.3.c',
    description: 'Find a percent of a quantity as a rate per 100 (e.g., 30% of a quantity means 30/100 times the quantity); solve problems involving finding the whole, given a part and the percent.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.',
    subEloIdentifier: '6.RP.3',
    subEloDescription: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.RP.3.d',
    description: 'Use ratio reasoning to convert measurement units; manipulate and transform units appropriately when multiplying or dividing quantities.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.6.RAPR.A',
    eloDescription: 'Understand ratio concepts and use ratio reasoning to solve problems.',
    subEloIdentifier: '6.RP.3',
    subEloDescription: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.RP.2.a',
    description: 'Decide whether two quantities are in a proportional relationship, e.g., by testing for equivalent ratios in a table or graphing on a coordinate plane and observing whether the graph is a straight line through the origin.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
    subEloIdentifier: '7.RP.2',
    subEloDescription: 'Recognize and represent proportional relationships between quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.RP.2.c',
    description: 'Represent proportional relationships by equations.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
    subEloIdentifier: '7.RP.2',
    subEloDescription: 'Recognize and represent proportional relationships between quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.RP.2.d',
    description: 'Explain what a point (x, y) on the graph of a proportional relationship means in terms of the situation, with special attention to the points (0, 0) and (1, r) where r is the unit rate.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
    subEloIdentifier: '7.RP.2',
    subEloDescription: 'Recognize and represent proportional relationships between quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.RP.2.b',
    description: 'Identify the constant of proportionality (unit rate) in tables, graphs, equations, diagrams, and verbal descriptions of proportional relationships.',
    tloIdentifier: 'CA.MA.6-7.RAPR',
    tloDescription: 'Ratios and Proportional Relationships',
    eloIdentifier: 'CA.MA.7.RAPR.A',
    eloDescription: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
    subEloIdentifier: '7.RP.2',
    subEloDescription: 'Recognize and represent proportional relationships between quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.6.a',
    description: 'Recognize opposite signs of numbers as indicating locations on opposite sides of 0 on the number line; recognize that the opposite of the opposite of a number is the number itself, e.g., -(-3) = 3, and that 0 is its own opposite.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.6',
    subEloDescription: 'Understand a rational number as a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.6.b',
    description: 'Understand signs of numbers in ordered pairs as indicating locations in quadrants of the coordinate plane; recognize that when two ordered pairs differ only by signs, the locations of the points are related by reflections across one or both axes.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.6',
    subEloDescription: 'Understand a rational number as a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.6.c',
    description: 'Find and position integers and other rational numbers on a horizontal or vertical number line diagram; find and position pairs of integers and other rational numbers on a coordinate plane.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.6',
    subEloDescription: 'Understand a rational number as a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.7.a',
    description: 'Interpret statements of inequality as statements about the relative position of two numbers on a number line diagram.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.7',
    subEloDescription: 'Understand ordering and absolute value of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.7.b',
    description: 'Write, interpret, and explain statements of order for rational numbers in real-world contexts.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.7',
    subEloDescription: 'Understand ordering and absolute value of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.7.c',
    description: 'Understand the absolute value of a rational number as its distance from 0 on the number line; interpret absolute value as magnitude for a positive or negative quantity in a real-world situation.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.7',
    subEloDescription: 'Understand ordering and absolute value of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '6'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '6.NS.7.d',
    description: 'Distinguish comparisons of absolute value from statements about order.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.6.TNS.C',
    eloDescription: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    subEloIdentifier: '6.NS.7',
    subEloDescription: 'Understand ordering and absolute value of rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.1.a',
    description: 'Describe situations in which opposite quantities combine to make 0.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.1',
    subEloDescription: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.1.b',
    description: 'Understand p + q as the number located a distance |q| from p, in the positive or negative direction depending on whether q is positive or negative. Show that a number and its opposite have a sum of 0 (are additive inverses). Interpret sums of rational numbers by describing real-world contexts.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.1',
    subEloDescription: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.1.c',
    description: 'Understand subtraction of rational numbers as adding the additive inverse, p - q = p + (-q). Show that the distance between two rational numbers on the number line is the absolute value of their difference, and apply this principle in real-world contexts.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.1',
    subEloDescription: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.1.d',
    description: 'Apply properties of operations as strategies to add and subtract rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.1',
    subEloDescription: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.2.a',
    description: 'Understand that multiplication is extended from fractions to rational numbers by requiring that operations continue to satisfy the properties of operations, particularly the distributive property, leading to products such as (-1)(-1) = 1 and the rules for multiplying signed numbers. Interpret products of rational numbers by describing real-world contexts.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.2',
    subEloDescription: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.2.b',
    description: 'Understand that integers can be divided, provided that the divisor is not zero, and every quotient of integers (with non-zero divisor) is a rational number. If p and q are integers, then -(p/q) = (-p)/q = p/(-q). Interpret quotients of rational numbers by describing real-world contexts.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.2',
    subEloDescription: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.2.c',
    description: 'Apply properties of operations as strategies to multiply and divide rational numbers.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.2',
    subEloDescription: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '7'
    ],
    level: 'SUB_SUB_ELO',
    identifier: '7.NS.2.d',
    description: 'Convert a rational number to a decimal using long division; know that the decimal form of a rational number terminates in 0s or eventually repeats.',
    tloIdentifier: 'CA.MA.6-8.TNS',
    tloDescription: 'The Number System',
    eloIdentifier: 'CA.MA.7.TNS.A',
    eloDescription: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    subEloIdentifier: '7.NS.2',
    subEloDescription: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.1',
    description: 'Understand that a function from one set (called the domain) to another set (called the range) assigns to each element of the domain exactly one element of the range. If f is a function and x is an element of its domain, then f(x) denotes the output of f corresponding to the input x. The graph of f is the graph of the equation y = f(x).',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.1',
    subEloDescription: 'Understand the concept of a function and use function notation'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.2',
    description: 'Use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.1',
    subEloDescription: 'Understand the concept of a function and use function notation'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.3',
    description: 'Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.1',
    subEloDescription: 'Understand the concept of a function and use function notation'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.4',
    description: 'For a function that models a relationship between two quantities, interpret key features of graphs and tables in terms of the quantities, and sketch graphs showing key features given a verbal description of the relationship.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.2',
    subEloDescription: 'Interpret functions that arise in applications in terms of the context'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.5',
    description: 'Relate the domain of a function to its graph and, where applicable, to the quantitative relationship it describes.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.2',
    subEloDescription: 'Interpret functions that arise in applications in terms of the context'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.6',
    description: 'Calculate and interpret the average rate of change of a function (presented symbolically or as a table) over a specified interval. Estimate the rate of change from a graph.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.2',
    subEloDescription: 'Interpret functions that arise in applications in terms of the context'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.7',
    description: 'Graph functions expressed symbolically and show key features of the graph, by hand in simple cases and using technology for more complicated cases.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.3',
    subEloDescription: 'Analyze functions using different representations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.9',
    description: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.3',
    subEloDescription: 'Analyze functions using different representations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.8',
    description: 'Write a function defined by an expression in different but equivalent forms to reveal and explain different properties of the function.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.3',
    subEloDescription: 'Analyze functions using different representations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.10',
    description: '(+) Demonstrate an understanding of functions and equations defined parametrically and graph them.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.3',
    subEloDescription: 'Analyze functions using different representations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.IF.11',
    description: '(+) Graph polar coordinates and curves. Convert between polar and rectangular coordinate systems.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.A',
    eloDescription: 'Interpreting Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.A.3',
    subEloDescription: 'Analyze functions using different representations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.BF.1',
    description: 'Write a function that describes a relationship between two quantities',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.B.1',
    subEloDescription: 'Build a function that models a relationship between two quantities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.BF.2',
    description: 'Write arithmetic and geometric sequences both recursively and with an explicit formula, use them to model situations, and translate between the two forms.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.B.1',
    subEloDescription: 'Build a function that models a relationship between two quantities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.BF.3',
    description: 'Identify the effect on the graph of replacing f(x) by f(x) + k, k f(x), f(kx), and f(x + k) for specific values of k (both positive and negative); find the value of k given the graphs. Experiment with cases and illustrate an explanation of the effects on the graph using technology. Include recognizing even and odd functions from their graphs and algebraic expressions for them.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.B.2',
    subEloDescription: 'Build new functions from existing functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.BF.4',
    description: 'Find inverse functions.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.B.2',
    subEloDescription: 'Build new functions from existing functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.BF.5',
    description: '(+) Understand the inverse relationship between exponents and logarithms and use this relationship to solve problems involving logarithms and exponents.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.B',
    eloDescription: 'Building Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.B.2',
    subEloDescription: 'Build new functions from existing functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.1',
    description: 'Distinguish between situations that can be modeled with linear functions and with exponential functions.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.2',
    description: 'Construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs (include reading these from a table).',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.3',
    description: 'Observe using graphs and tables that a quantity increasing exponentially eventually exceeds a quantity increasing linearly, quadratically, or (more generally) as a polynomial function.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.4',
    description: 'For exponential models, express as a logarithm the solution to ab<sup>ct</sup> = d where a, c, and d are numbers and the base b is 2, 10, or e; evaluate the logarithm using technology.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.4.1',
    description: 'Prove simple laws of logarithms.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.4.2',
    description: 'Use the definition of logarithms to translate between logarithms in any base.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.4.3',
    description: 'Understand and use the properties of logarithms to simplify logarithmic numeric expressions and to identify their approximate values.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.1',
    subEloDescription: 'Construct and compare linear, quadratic, and exponential models and solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.5',
    description: 'Interpret the parameters in a linear or exponential function in terms of a context.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.2',
    subEloDescription: 'Interpret expressions for functions in terms of the situation they model'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.LE.6',
    description: 'Apply quadratic functions to physical problems, such as the motion of an object under the force of gravity.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.C',
    eloDescription: 'Linear, Quadratic, and Exponential Models',
    subEloIdentifier: 'CA.MA.9-12.HMCF.C.2',
    subEloDescription: 'Interpret expressions for functions in terms of the situation they model'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.1',
    description: 'Understand radian measure of an angle as the length of the arc on the unit circle subtended by the angle.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.1',
    subEloDescription: 'Extend the domain of trigonometric functions using the unit circle'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.2',
    description: 'Explain how the unit circle in the coordinate plane enables the extension of trigonometric functions to all real numbers, interpreted as radian measures of angles traversed counterclockwise around the unit circle.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.1',
    subEloDescription: 'Extend the domain of trigonometric functions using the unit circle'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.2.1',
    description: 'Graph all 6 basic trigonometric functions.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.1',
    subEloDescription: 'Extend the domain of trigonometric functions using the unit circle'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.3',
    description: '(+) Use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4 and π/6, and use the unit circle to express the values of sine, cosine, and tangent for π-x, π+x, and 2π-x in terms of their values for x, where x is any real number.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.1',
    subEloDescription: 'Extend the domain of trigonometric functions using the unit circle'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.4',
    description: '(+) Use the unit circle to explain symmetry (odd and even) and periodicity of trigonometric functions.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.1',
    subEloDescription: 'Extend the domain of trigonometric functions using the unit circle'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.5',
    description: 'Choose trigonometric functions to model periodic phenomena with specified amplitude, frequency, and midline.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.2',
    subEloDescription: 'Model periodic phenomena with trigonometric functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.6',
    description: '(+) Understand that restricting a trigonometric function to a domain on which it is always increasing or always decreasing allows its inverse to be constructed.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.2',
    subEloDescription: 'Model periodic phenomena with trigonometric functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.7',
    description: '(+) Use inverse functions to solve trigonometric equations that arise in modeling contexts; evaluate the solutions using technology, and interpret them in terms of the context.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.2',
    subEloDescription: 'Model periodic phenomena with trigonometric functions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.8',
    description: 'Prove the Pythagorean identity sin²(θ) + cos²(θ) = 1 and use it to find sin(θ), cos(θ), or tan(θ) given sin(θ), cos(θ), or tan(θ) and the quadrant of the angle.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.3',
    subEloDescription: 'Prove and apply trigonometric identities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.10',
    description: '(+) Prove the half angle and double angle identities for sine and cosine and use them to solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.3',
    subEloDescription: 'Prove and apply trigonometric identities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'F.TF.9',
    description: '(+) Prove the addition and subtraction formulas for sine, cosine, and tangent and use them to solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCF',
    tloDescription: 'Higher Mathematics Course — Functions',
    eloIdentifier: 'CA.MA.9-12.HMCF.D',
    eloDescription: 'Trigonometric Functions',
    subEloIdentifier: 'CA.MA.9-12.HMCF.D.3',
    subEloDescription: 'Prove and apply trigonometric identities'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.1',
    description: 'Represent data with plots on the real number line (dot plots, histograms, and box plots).',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.1',
    subEloDescription: 'Summarize, represent, and interpret data on a single count or measurement variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.2',
    description: 'Use statistics appropriate to the shape of the data distribution to compare center (median, mean) and spread (interquartile range, standard deviation) of two or more different data sets.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.1',
    subEloDescription: 'Summarize, represent, and interpret data on a single count or measurement variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.3',
    description: 'Interpret differences in shape, center, and spread in the context of the data sets, accounting for possible effects of extreme data points (outliers).',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.1',
    subEloDescription: 'Summarize, represent, and interpret data on a single count or measurement variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.4',
    description: 'Use the mean and standard deviation of a data set to fit it to a normal distribution and to estimate population percentages. Recognize that there are data sets for which such a procedure is not appropriate. Use calculators, spreadsheets, and tables to estimate areas under the normal curve.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.1',
    subEloDescription: 'Summarize, represent, and interpret data on a single count or measurement variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.5',
    description: 'Summarize categorical data for two categories in two-way frequency tables. Interpret relative frequencies in the context of the data (including joint, marginal, and conditional relative frequencies). Recognize possible associations and trends in the data.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.2',
    subEloDescription: 'Summarize, represent, and interpret data on two categorical and quantitative variables'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.6',
    description: 'Represent data on two quantitative variables on a scatter plot, and describe how the variables are related.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.2',
    subEloDescription: 'Summarize, represent, and interpret data on two categorical and quantitative variables'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.7',
    description: 'Interpret the slope (rate of change) and the intercept (constant term) of a linear model in the context of the data.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.3',
    subEloDescription: 'Interpret linear models'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.8',
    description: 'Compute (using technology) and interpret the correlation coefficient of a linear fit.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.3',
    subEloDescription: 'Interpret linear models'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.ID.9',
    description: 'Distinguish between correlation and causation.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.A',
    eloDescription: 'Interpreting Categorical and Quantitative Data',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.A.3',
    subEloDescription: 'Interpret linear models'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.IC.1',
    description: 'Understand statistics as a process for making inferences about population parameters based on a random sample from that population.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.B.1',
    subEloDescription: 'Understand and evaluate random processes underlying statistical experiments'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.IC.2',
    description: 'Decide if a specified model is consistent with results from a given data-generating process, e.g., using simulation.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.B.1',
    subEloDescription: 'Understand and evaluate random processes underlying statistical experiments'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.IC.3',
    description: 'Recognize the purposes of and differences among sample surveys, experiments, and observational studies; explain how randomization relates to each.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.B.2',
    subEloDescription: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.IC.4',
    description: 'Use data from a sample survey to estimate a population mean or proportion; develop a margin of error through the use of simulation models for random sampling.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.B.2',
    subEloDescription: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.IC.5',
    description: 'Use data from a randomized experiment to compare two treatments; use simulations to decide if differences between parameters are significant.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.B.2',
    subEloDescription: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.IC.6',
    description: 'Evaluate reports based on data.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.B',
    eloDescription: 'Making Inferences and Justifying Conclusions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.B.2',
    subEloDescription: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.1',
    description: 'Describe events as subsets of a sample space (the set of outcomes) using characteristics (or categories) of the outcomes, or as unions, intersections, or complements of other events ("or," "and," "not").',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.1',
    subEloDescription: 'Understand independence and conditional probability and use them to interpret data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.2',
    description: 'Understand that two events A and B are independent if the probability of A and B occurring together is the product of their probabilities, and use this characterization to determine if they are independent.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.1',
    subEloDescription: 'Understand independence and conditional probability and use them to interpret data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.3',
    description: 'Understand the conditional probability of A given B as P(A and B)/P(B), and interpret independence of A and B as saying that the conditional probability of A given B is the same as the probability of A, and the conditional probability of B given A is the same as the probability of B.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.1',
    subEloDescription: 'Understand independence and conditional probability and use them to interpret data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.4',
    description: 'Construct and interpret two-way frequency tables of data when two categories are associated with each object being classified. Use the two-way table as a sample space to decide if events are independent and to approximate conditional probabilities.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.1',
    subEloDescription: 'Understand independence and conditional probability and use them to interpret data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.5',
    description: 'Recognize and explain the concepts of conditional probability and independence in everyday language and everyday situations.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.1',
    subEloDescription: 'Understand independence and conditional probability and use them to interpret data'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.6',
    description: "Find the conditional probability of A given B as the fraction of B's outcomes that also belong to A, and interpret the answer in terms of the model.",
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.2',
    subEloDescription: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.7',
    description: 'Apply the Addition Rule, P(A or B) = P(A) + P(B) - P(A and B), and interpret the answer in terms of the model.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.2',
    subEloDescription: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.8',
    description: '(+) Apply the general Multiplication Rule in a uniform probability model, P(A and B) = P(A)P(B|A) = P(B)P(A|B), and interpret the answer in terms of the model.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.2',
    subEloDescription: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.CP.9',
    description: '(+) Use permutations and combinations to compute probabilities of compound events and solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.C',
    eloDescription: 'Conditional Probability and the Rules of Probability',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.C.2',
    subEloDescription: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.1',
    description: '(+) Define a random variable for a quantity of interest by assigning a numerical value to each event in a sample space; graph the corresponding probability distribution using the same graphical displays as for data distributions.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.1',
    subEloDescription: 'Calculate expected values and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.2',
    description: '(+) Calculate the expected value of a random variable; interpret it as the mean of the probability distribution.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.1',
    subEloDescription: 'Calculate expected values and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.3',
    description: '(+) Develop a probability distribution for a random variable defined for a sample space in which theoretical probabilities can be calculated; find the expected value.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.1',
    subEloDescription: 'Calculate expected values and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.4',
    description: '(+) Develop a probability distribution for a random variable defined for a sample space in which probabilities are assigned empirically; find the expected value.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.1',
    subEloDescription: 'Calculate expected values and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.5',
    description: '(+) Weigh the possible outcomes of a decision by assigning probabilities to payoff values and finding expected values.',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.2',
    subEloDescription: 'Use probability to evaluate outcomes of decisions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.6',
    description: '(+) Use probabilities to make fair decisions (e.g., drawing by lots, using a random number generator).',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.2',
    subEloDescription: 'Use probability to evaluate outcomes of decisions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'S.MD.7',
    description: '(+) Analyze decisions and strategies using probability concepts (e.g., product testing, medical testing, pulling a hockey goalie at the end of a game).',
    tloIdentifier: 'CA.MA.9-12.HMCSAP',
    tloDescription: 'Higher Mathematics Course — Statistics and Probability',
    eloIdentifier: 'CA.MA.9-12.HMCSAP.D',
    eloDescription: 'Using Probability to Make Decisions',
    subEloIdentifier: 'CA.MA.9-12.HMCSAP.D.2',
    subEloDescription: 'Use probability to evaluate outcomes of decisions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.RN.1',
    description: 'Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values, allowing for a notation for radicals in terms of rational exponents.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.A',
    eloDescription: 'The Real Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.A.1',
    subEloDescription: 'Extend the properties of exponents to rational exponents.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.RN.2',
    description: 'Rewrite expressions involving radicals and rational exponents using the properties of exponents.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.A',
    eloDescription: 'The Real Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.A.1',
    subEloDescription: 'Extend the properties of exponents to rational exponents.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.RN.3',
    description: 'Explain why the sum or product of two rational numbers is rational; that the sum of a rational number and an irrational number is irrational; and that the product of a nonzero rational number and an irrational number is irrational.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.A',
    eloDescription: 'The Real Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.A.2',
    subEloDescription: 'Use properties of rational and irrational numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.Q.1',
    description: 'Use units as a way to understand problems and to guide the solution of multi-step problems; choose and interpret units consistently in formulas; choose and interpret the scale and the origin in graphs and data displays.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.B',
    eloDescription: 'Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.B.1',
    subEloDescription: 'Reason quantitatively and use units to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.Q.2',
    description: 'Define appropriate quantities for the purpose of descriptive modeling.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.B',
    eloDescription: 'Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.B.1',
    subEloDescription: 'Reason quantitatively and use units to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.Q.3',
    description: 'Choose a level of accuracy appropriate to limitations on measurement when reporting quantities.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.B',
    eloDescription: 'Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.B.1',
    subEloDescription: 'Reason quantitatively and use units to solve problems.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.1',
    description: 'Know there is a complex number i such that i² = -1, and every complex number has the form a + bi with a and b real.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.1',
    subEloDescription: 'Perform arithmetic operations with complex numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.2',
    description: 'Use the relation i² = -1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.1',
    subEloDescription: 'Perform arithmetic operations with complex numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.3',
    description: '(+) Find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.1',
    subEloDescription: 'Perform arithmetic operations with complex numbers.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.4',
    description: '(+) Represent complex numbers on the complex plane in rectangular and polar form (including real and imaginary numbers), and explain why the rectangular and polar forms of a given complex number represent the same number.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.2',
    subEloDescription: 'Represent complex numbers and their operations on the complex plane.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.5',
    description: '(+) Represent addition, subtraction, multiplication, and conjugation of complex numbers geometrically on the complex plane; use properties of this representation for computation.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.2',
    subEloDescription: 'Represent complex numbers and their operations on the complex plane.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.6',
    description: '(+) Calculate the distance between numbers in the complex plane as the modulus of the difference, and the midpoint of a segment as the average of the numbers at its endpoints.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.2',
    subEloDescription: 'Represent complex numbers and their operations on the complex plane.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.7',
    description: 'Solve quadratic equations with real coefficients that have complex solutions.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.3',
    subEloDescription: 'Use complex numbers in polynomial identities and equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.8',
    description: '(+) Extend polynomial identities to the complex numbers.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.3',
    subEloDescription: 'Use complex numbers in polynomial identities and equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.CN.9',
    description: '(+) Know the Fundamental Theorem of Algebra; show that it is true for quadratic polynomials.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.C',
    eloDescription: 'The Complex Number System',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.C.3',
    subEloDescription: 'Use complex numbers in polynomial identities and equations.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.1',
    description: '(+) Recognize vector quantities as having both magnitude and direction. Represent vector quantities by directed line segments, and use appropriate symbols for vectors and their magnitudes (e.g., v, |v|, ||v||, v).',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.1',
    subEloDescription: 'Represent and model with vector quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.2',
    description: '(+) Find the components of a vector by subtracting the coordinates of an initial point from the coordinates of a terminal point.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.1',
    subEloDescription: 'Represent and model with vector quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.3',
    description: '(+) Solve problems involving velocity and other quantities that can be represented by vectors.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.1',
    subEloDescription: 'Represent and model with vector quantities.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.4',
    description: '(+) Add and subtract vectors.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.2',
    subEloDescription: 'Perform operations on vectors.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.5',
    description: '(+) Multiply a vector by a scalar.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.2',
    subEloDescription: 'Perform operations on vectors.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.10',
    description: '(+) Understand that the zero and identity matrices play a role in matrix addition and multiplication similar to the role of 0 and 1 in the real numbers. The determinant of a square matrix is nonzero if and only if the matrix has a multiplicative inverse.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.11',
    description: '(+) Multiply a vector (regarded as a matrix with one column) by a matrix of suitable dimensions to produce another vector. Work with matrices as transformations of vectors.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.12',
    description: '(+) Work with 2 × 2 matrices as transformations of the plane, and interpret the absolute value of the determinant in terms of area.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.6',
    description: '(+) Use matrices to represent and manipulate data, e.g., to represent payoffs or incidence relationships in a network.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.7',
    description: '(+) Multiply matrices by scalars to produce new matrices, e.g., as when all of the payoffs in a game are doubled.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.8',
    description: '(+) Add, subtract, and multiply matrices of appropriate dimensions.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'N.VM.9',
    description: '(+) Understand that, unlike multiplication of numbers, matrix multiplication for square matrices is not a commutative operation, but still satisfies the associative and distributive properties.',
    tloIdentifier: 'CA.MA.9-12.HMCNAQ',
    tloDescription: 'Higher Mathematics Course — Number and Quantity',
    eloIdentifier: 'CA.MA.9-12.HMCNAQ.D',
    eloDescription: 'Vector and Matrix Quantities',
    subEloIdentifier: 'CA.MA.9-12.HMCNAQ.D.3',
    subEloDescription: 'Perform operations on matrices and use matrices in applications.'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.SSE.1',
    description: 'Interpret expressions that represent a quantity in terms of its context',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.A',
    eloDescription: 'Seeing Structure in Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.A.1',
    subEloDescription: 'Interpret the structure of expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.SSE.2',
    description: 'Use the structure of an expression to identify ways to rewrite it.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.A',
    eloDescription: 'Seeing Structure in Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.A.1',
    subEloDescription: 'Interpret the structure of expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.SSE.3',
    description: 'Choose and produce an equivalent form of an expression to reveal and explain properties of the quantity represented by the expression.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.A',
    eloDescription: 'Seeing Structure in Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.A.2',
    subEloDescription: 'Write expressions in equivalent forms to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.SSE.4',
    description: 'Derive the formula for the sum of a finite geometric series (when the common ratio is not 1), and use the formula to solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.A',
    eloDescription: 'Seeing Structure in Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.A.2',
    subEloDescription: 'Write expressions in equivalent forms to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.1',
    description: 'Understand that polynomials form a system analogous to the integers, namely, they are closed under the operations of addition, subtraction, and multiplication; add, subtract, and multiply polynomials.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.1',
    subEloDescription: 'Perform arithmetic operations on polynomials'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.3',
    description: 'Identify zeros of polynomials when suitable factorizations are available, and use the zeros to construct a rough graph of the function defined by the polynomial.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.2',
    subEloDescription: 'Understand the relationship between zeros and factors of polynomials'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.2',
    description: 'Know and apply the Remainder Theorem: For a polynomial p(x) and a number a, the remainder on division by x - a is p(a), so p(a) = 0 if and only if (x - a) is a factor of p(x).',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.2',
    subEloDescription: 'Understand the relationship between zeros and factors of polynomials'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.5',
    description: "(+) Know and apply the Binomial Theorem for the expansion of (x + y)<sup>n</sup> in powers of x and y for a positive integer n, where x and y are any numbers, with coefficients determined for example by Pascal's Triangle.",
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.3',
    subEloDescription: 'Use polynomial identities to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.4',
    description: 'Prove polynomial identities and use them to describe numerical relationships.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.3',
    subEloDescription: 'Use polynomial identities to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.6',
    description: 'Rewrite simple rational expressions in different forms; write <sup>a(x </sup>/<sub>b(x)</sub> in the form q(x) + <sup>r(x)</sup>/<sub>b(x)</sub>, where a(x), b(x), q(x), and r(x) are polynomials with the degree of r(x) less than the degree of b(x), using inspection, long division, or, for the more complicated examples, a computer algebra system.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.4',
    subEloDescription: 'Rewrite rational expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.APR.7',
    description: '(+) Understand that rational expressions form a system analogous to the rational numbers, closed under addition, subtraction, multiplication, and division by a nonzero rational expression; add, subtract, multiply, and divide rational expressions.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.B',
    eloDescription: 'Arithmetic with Polynomials and Rational Expressions',
    subEloIdentifier: 'CA.MA.9-12.HMCA.B.4',
    subEloDescription: 'Rewrite rational expressions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.CED.1',
    description: 'Create equations and inequalities in one variable including ones with absolute value and use them to solve problems. Include equations arising from linear and quadratic functions, and simple rational and exponential functions.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.C',
    eloDescription: 'Creating Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCA.C.1',
    subEloDescription: 'Create equations that describe numbers or relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.CED.2',
    description: 'Create equations in two or more variables to represent relationships between quantities; graph equations on coordinate axes with labels and scales.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.C',
    eloDescription: 'Creating Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCA.C.1',
    subEloDescription: 'Create equations that describe numbers or relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.CED.3',
    description: 'Represent constraints by equations or inequalities, and by systems of equations and/or inequalities, and interpret solutions as viable or nonviable options in a modeling context.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.C',
    eloDescription: 'Creating Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCA.C.1',
    subEloDescription: 'Create equations that describe numbers or relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.CED.4',
    description: 'Rearrange formulas to highlight a quantity of interest, using the same reasoning as in solving equations.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.C',
    eloDescription: 'Creating Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCA.C.1',
    subEloDescription: 'Create equations that describe numbers or relationships'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.3',
    description: 'Solve linear equations and inequalities in one variable, including equations with coefficients represented by letters.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.1',
    subEloDescription: 'Solve equations and inequalities in one variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.4',
    description: 'Solve quadratic equations in one variable.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.1',
    subEloDescription: 'Solve equations and inequalities in one variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.3.1',
    description: 'Solve one-variable equations and inequalities involving absolute value, graphing the solutions and interpreting them in context.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.1',
    subEloDescription: 'Solve equations and inequalities in one variable'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.5',
    description: 'Prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.2',
    subEloDescription: 'Solve systems of equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.6',
    description: 'Solve systems of linear equations exactly and approximately (e.g., with graphs), focusing on pairs of linear equations in two variables.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.2',
    subEloDescription: 'Solve systems of equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.7',
    description: 'Solve a simple system consisting of a linear equation and a quadratic equation in two variables algebraically and graphically.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.2',
    subEloDescription: 'Solve systems of equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.8',
    description: '(+) Represent a system of linear equations as a single matrix equation in a vector variable.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.2',
    subEloDescription: 'Solve systems of equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.9',
    description: '(+) Find the inverse of a matrix if it exists and use it to solve systems of linear equations (using technology for matrices of dimension 3 × 3 or greater).',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.2',
    subEloDescription: 'Solve systems of equations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.10',
    description: 'Understand that the graph of an equation in two variables is the set of all its solutions plotted in the coordinate plane, often forming a curve (which could be a line).',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.3',
    subEloDescription: 'Represent and solve equations and inequalities graphically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.11',
    description: 'Explain why the x-coordinates of the points where the graphs of the equations y = f(x) and y = g(x) intersect are the solutions of the equation f(x) = g(x); find the solutions approximately, e.g., using technology to graph the functions, make tables of values, or find successive approximations. Include cases where f(x) and/or g(x) are linear, polynomial, rational, absolute value, exponential, and logarithmic functions.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.3',
    subEloDescription: 'Represent and solve equations and inequalities graphically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.12',
    description: 'Graph the solutions to a linear inequality in two variables as a half-plane (excluding the boundary in the case of a strict inequality), and graph the solution set to a system of linear inequalities in two variables as the intersection of the corresponding half-planes.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.3',
    subEloDescription: 'Represent and solve equations and inequalities graphically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.1',
    description: 'Explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step, starting from the assumption that the original equation has a solution. Construct a viable argument to justify a solution method.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.4',
    subEloDescription: 'Understand solving equations as a process of reasoning and explain the reasoning'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'A.REI.2',
    description: 'Solve simple rational and radical equations in one variable, and give examples showing how extraneous solutions may arise.',
    tloIdentifier: 'CA.MA.9-12.HMCA',
    tloDescription: 'Higher Mathematics Course — Algebra',
    eloIdentifier: 'CA.MA.9-12.HMCA.D',
    eloDescription: 'Reasoning with Equations and Inequalities',
    subEloIdentifier: 'CA.MA.9-12.HMCA.D.4',
    subEloDescription: 'Understand solving equations as a process of reasoning and explain the reasoning'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.1',
    description: 'Verify experimentally the properties of dilations given by a center and a scale factor:',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.1',
    subEloDescription: 'Understand similarity in terms of similarity transformations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.2',
    description: 'Given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar; explain using similarity transformations the meaning of similarity for triangles as the equality of all corresponding pairs of angles and the proportionality of all corresponding pairs of sides.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.1',
    subEloDescription: 'Understand similarity in terms of similarity transformations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.3',
    description: 'Use the properties of similarity transformations to establish the AA criterion for two triangles to be similar.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.1',
    subEloDescription: 'Understand similarity in terms of similarity transformations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.4',
    description: 'Prove theorems about triangles.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.2',
    subEloDescription: 'Prove theorems involving similarity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.5',
    description: 'Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.2',
    subEloDescription: 'Prove theorems involving similarity'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.6',
    description: 'Understand that by similarity, side ratios in right triangles are properties of the angles in the triangle, leading to definitions of trigonometric ratios for acute angles.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.3',
    subEloDescription: 'Define trigonometric ratios and solve problems involving right triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.7',
    description: 'Explain and use the relationship between the sine and cosine of complementary angles.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.3',
    subEloDescription: 'Define trigonometric ratios and solve problems involving right triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.8',
    description: 'Use trigonometric ratios and the Pythagorean Theorem to solve right triangles in applied problems.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.3',
    subEloDescription: 'Define trigonometric ratios and solve problems involving right triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.8.1',
    description: 'Derive and use the trigonometric ratios for special right triangles (30°, 60°, 90°and 45°, 45°, 90°)',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.3',
    subEloDescription: 'Define trigonometric ratios and solve problems involving right triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.10',
    description: '(+) Prove the Laws of Sines and Cosines and use them to solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.4',
    subEloDescription: 'Apply trigonometry to general triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.11',
    description: '(+) Understand and apply the Law of Sines and the Law of Cosines to find unknown measurements in right and non-right triangles (e.g., surveying problems, resultant forces).',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.4',
    subEloDescription: 'Apply trigonometry to general triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.SRT.9',
    description: '(+) Derive the formula A = 1/2 ab sin(C) for the area of a triangle by drawing an auxiliary line from a vertex perpendicular to the opposite side.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.A',
    eloDescription: 'Similarity, Right Triangles, and Trigonometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.A.4',
    subEloDescription: 'Apply trigonometry to general triangles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.C.1',
    description: 'Prove that all circles are similar.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles',
    subEloIdentifier: 'CA.MA.9-12.HMCG.B.1',
    subEloDescription: 'Understand and apply theorems about circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.C.2',
    description: 'Identify and describe relationships among inscribed angles, radii, and chords.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles',
    subEloIdentifier: 'CA.MA.9-12.HMCG.B.1',
    subEloDescription: 'Understand and apply theorems about circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.C.3',
    description: 'Construct the inscribed and circumscribed circles of a triangle, and prove properties of angles for a quadrilateral inscribed in a circle.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles',
    subEloIdentifier: 'CA.MA.9-12.HMCG.B.1',
    subEloDescription: 'Understand and apply theorems about circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.C.4',
    description: '(+) Construct a tangent line from a point outside a given circle to the circle.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles',
    subEloIdentifier: 'CA.MA.9-12.HMCG.B.1',
    subEloDescription: 'Understand and apply theorems about circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.C.5',
    description: 'Derive using similarity the fact that the length of the arc intercepted by an angle is proportional to the radius, and define the radian measure of the angle as the constant of proportionality; derive the formula for the area of a sector. Convert between degrees and radians.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.B',
    eloDescription: 'Circles',
    subEloIdentifier: 'CA.MA.9-12.HMCG.B.2',
    subEloDescription: 'Find arc lengths and areas of sectors of circles'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.2',
    description: 'Derive the equation of a parabola given a focus and directrix.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.1',
    subEloDescription: 'Translate between the geometric description and the equation for a conic section'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.1',
    description: 'Derive the equation of a circle of given center and radius using the Pythagorean Theorem; complete the square to find the center and radius of a circle given by an equation.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.1',
    subEloDescription: 'Translate between the geometric description and the equation for a conic section'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.3',
    description: '(+) Derive the equations of ellipses and hyperbolas given the foci, using the fact that the sum or difference of distances from the foci is constant.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.1',
    subEloDescription: 'Translate between the geometric description and the equation for a conic section'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.3.1',
    description: 'Given a quadratic equation of the form ax² + by² + cx + dy + e = 0, use the method for completing the square to put the equation into standard form; identify whether the graph of the equation is a circle, ellipse, parabola, or hyperbola and graph the equation.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.1',
    subEloDescription: 'Translate between the geometric description and the equation for a conic section'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.4',
    description: 'Use coordinates to prove simple geometric theorems algebraically.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.2',
    subEloDescription: 'Use coordinates to prove simple geometric theorems algebraically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.5',
    description: 'Prove the slope criteria for parallel and perpendicular lines and use them to solve geometric problems (e.g., find the equation of a line parallel or perpendicular to a given line that passes through a given point).',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.2',
    subEloDescription: 'Use coordinates to prove simple geometric theorems algebraically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.6',
    description: 'Find the point on a directed line segment between two given points that partitions the segment in a given ratio.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.2',
    subEloDescription: 'Use coordinates to prove simple geometric theorems algebraically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GPE.7',
    description: 'Use coordinates to compute perimeters of polygons and areas of triangles and rectangles, e.g., using the distance formula.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.C',
    eloDescription: 'Expressing Geometric Properties with Equations',
    subEloIdentifier: 'CA.MA.9-12.HMCG.C.2',
    subEloDescription: 'Use coordinates to prove simple geometric theorems algebraically'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GMD.1',
    description: 'Give an informal argument for the formulas for the circumference of a circle, area of a circle, volume of a cylinder, pyramid, and cone.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension',
    subEloIdentifier: 'CA.MA.9-12.HMCG.D.1',
    subEloDescription: 'Explain volume formulas and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GMD.3',
    description: 'Use volume formulas for cylinders, pyramids, cones, and spheres to solve problems.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension',
    subEloIdentifier: 'CA.MA.9-12.HMCG.D.1',
    subEloDescription: 'Explain volume formulas and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GMD.2',
    description: "(+) Give an informal argument using Cavalieri's principle for the formulas for the volume of a sphere and other solid figures.",
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension',
    subEloIdentifier: 'CA.MA.9-12.HMCG.D.1',
    subEloDescription: 'Explain volume formulas and use them to solve problems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GMD.4',
    description: 'Identify the shapes of two-dimensional cross-sections of three-dimensional objects, and identify three-dimensional objects generated by rotations of two-dimensional objects.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension',
    subEloIdentifier: 'CA.MA.9-12.HMCG.D.2',
    subEloDescription: 'Visualize relationships between two-dimensional and three-dimensional objects'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GMD.5',
    description: 'Know that the effect of a scale factor k greater than zero on length, area, and volume is to multiply each by k, k², and k³, respectively; determine length, area and volume measures using scale factors.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension',
    subEloIdentifier: 'CA.MA.9-12.HMCG.D.2',
    subEloDescription: 'Visualize relationships between two-dimensional and three-dimensional objects'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.GMD.6',
    description: 'Verify experimentally that in a triangle, angles opposite longer sides are larger, sides opposite larger angles are longer, and the sum of any two side lengths is greater than the remaining side length; apply these relationships to solve real-world and mathematical problems.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.D',
    eloDescription: 'Geometric Measurement and Dimension',
    subEloIdentifier: 'CA.MA.9-12.HMCG.D.2',
    subEloDescription: 'Visualize relationships between two-dimensional and three-dimensional objects'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.MG.1',
    description: 'Use geometric shapes, their measures, and their properties to describe objects (e.g., modeling a tree trunk or a human torso as a cylinder).',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.E',
    eloDescription: 'Modeling with Geometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.E.1',
    subEloDescription: 'Apply geometric concepts in modeling situations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.MG.3',
    description: 'Apply geometric methods to solve design problems (e.g., designing an object or structure to satisfy physical constraints or minimize cost; working with typographic grid systems based on ratios).',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.E',
    eloDescription: 'Modeling with Geometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.E.1',
    subEloDescription: 'Apply geometric concepts in modeling situations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.MG.2',
    description: 'Apply concepts of density based on area and volume in modeling situations (e.g., persons per square mile, BTUs per cubic foot).',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.E',
    eloDescription: 'Modeling with Geometry',
    subEloIdentifier: 'CA.MA.9-12.HMCG.E.1',
    subEloDescription: 'Apply geometric concepts in modeling situations'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.10',
    description: 'Prove theorems about triangles.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.1',
    subEloDescription: 'Prove geometric theorems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.11',
    description: 'Prove theorems about parallelograms.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.1',
    subEloDescription: 'Prove geometric theorems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.9',
    description: 'Prove theorems about lines and angles.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.1',
    subEloDescription: 'Prove geometric theorems'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.12',
    description: 'Make formal geometric constructions with a variety of tools and methods (compass and straightedge, string, reflective devices, paper folding, dynamic geometric software, etc.). Copying a segment; copying an angle; bisecting a segment; bisecting an angle; constructing perpendicular lines, including the perpendicular bisector of a line segment; and constructing a line parallel to a given line through a point not on the line.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.2',
    subEloDescription: 'Make geometric constructions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.13',
    description: 'Construct an equilateral triangle, a square, and a regular hexagon inscribed in a circle.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.2',
    subEloDescription: 'Make geometric constructions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.1',
    description: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.3',
    subEloDescription: 'Experiment with transformations in the plane'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.2',
    description: 'Represent transformations in the plane using, e.g., transparencies and geometry software; describe transformations as functions that take points in the plane as inputs and give other points as outputs. Compare transformations that preserve distance and angle to those that do not (e.g., translation versus horizontal stretch).',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.3',
    subEloDescription: 'Experiment with transformations in the plane'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.3',
    description: 'Given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.3',
    subEloDescription: 'Experiment with transformations in the plane'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.4',
    description: 'Develop definitions of rotations, reflections, and translations in terms of angles, circles, perpendicular lines, parallel lines, and line segments.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.3',
    subEloDescription: 'Experiment with transformations in the plane'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.5',
    description: 'Given a geometric figure and a rotation, reflection, or translation, draw the transformed figure using, e.g., graph paper, tracing paper, or geometry software. Specify a sequence of transformations that will carry a given figure onto another.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.3',
    subEloDescription: 'Experiment with transformations in the plane'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.6',
    description: 'Use geometric descriptions of rigid motions to transform figures and to predict the effect of a given rigid motion on a given figure; given two figures, use the definition of congruence in terms of rigid motions to decide if they are congruent.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.4',
    subEloDescription: 'Understand congruence in terms of rigid motions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.7',
    description: 'Use the definition of congruence in terms of rigid motions to show that two triangles are congruent if and only if corresponding pairs of sides and corresponding pairs of angles are congruent.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.4',
    subEloDescription: 'Understand congruence in terms of rigid motions'
  },
  {
    id: getObjectId(),
    curriculumId: curriculumOneId,
    grades: [
      '12',
      '11',
      '10',
      '9'
    ],
    level: 'SUB_SUB_ELO',
    identifier: 'G.CO.8',
    description: 'Explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions.',
    tloIdentifier: 'CA.MA.9-12.HMCG',
    tloDescription: 'Higher Mathematics Course — Geometry',
    eloIdentifier: 'CA.MA.9-12.HMCG.F',
    eloDescription: 'Congruence',
    subEloIdentifier: 'CA.MA.9-12.HMCG.F.4',
    subEloDescription: 'Understand congruence in terms of rigid motions'
  }
];

module.exports = standards;
