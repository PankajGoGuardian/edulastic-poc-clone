const { getObjectId } = require('../../helpers/index');

const curriculums = [
  {
    id: getObjectId('curriculum1'),
    curriculum: 'CommonCore Math',
    asnIdentifier: 'S2604999',
    subject: 'Math',
    grade: 'Grade 5',
    domains: [
      {
        name: 'Operations & Algebraic Thinking',
        id: '123',
        asnIdentifier: 'S2604999',
        position: '1',
        standards: [
          {
            name: '5.OA.A.1',
            id: '234',
            asnIdentifier: 'S2604999',
            position: '1',
            'sub-standards': [
              {
                name: '5.OA.A.1',
                id: '234',
                asnIdentifier: 'S2604999',
                position: '1'
              }
            ]
          },
          {
            name: '5.OA.B.2',
            id: '456',
            asnIdentifier: 'S2604999',
            position: '2'
          }
        ]
      }
    ]
  }
];

module.exports = curriculums;
