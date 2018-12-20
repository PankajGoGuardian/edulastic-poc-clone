import { Router } from 'express';
import { successHandler } from '../utils/responseHandler';

const router = Router();


/**
 * @swagger
 * /skill-report/{classId}:
 *   get:
 *     tags:
 *       - skill-report
 *     summary: Fetch skill-report of the current student of the given class
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: classId
 *          in: path
 *          example:
 *            class: 5c12636639a4e7124639d893
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/:classId', async (req, res) => {
  try {
    const result = {
      curriculum: {
        id: 'curriculumOneId',
        curriculumName: 'Common Core Math 3',
        subject: 'Math',
        domains: [
          {
            id: 'tloOneId',
            curriculumId: 'curriculumOneId',
            level: 'TLO',
            identifier: 'CA.MA.K-3.SFMP',
            description: 'Standards for Mathematical Practice',
            standards: [{
              id: 'eloOneId',
              curriculumId: 'curriculumOneId',
              level: 'ELO',
              identifier: 'MP.1',
              description: 'Make sense of problems and persevere in solving them.',
              tloIdentifier: 'CA.MA.K-3.SFMP',
              tloDescription: 'Standards for Mathematical Practice'
            },
            {
              id: 'eloTwoId',
              curriculumId: 'curriculumOneId',
              level: 'ELO',
              identifier: 'MP.2',
              description: 'Reason abstractly and quantitatively.',
              tloIdentifier: 'CA.MA.K-3.SFMP',
              tloDescription: 'Standards for Mathematical Practice'
            }]
          },
          {
            id: 'tloTwoId',
            curriculumId: 'curriculumOneId',
            level: 'TLO',
            identifier: 'CA.MA.K-3.OAAT',
            description: 'Operations and Algebraic Thinking',
            standards: [
              {
                id: 'eloThreeId',
                curriculumId: 'curriculumOneId',
                level: 'ELO',
                identifier: 'CA.MA.K.OAAT.A',
                description: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.',
                tloIdentifier: 'CA.MA.K-3.OAAT',
                tloDescription: 'Operations and Algebraic Thinking'
              },
              {
                id: 'eloFourId',
                curriculumId: 'curriculumOneId',
                level: 'ELO',
                identifier: 'CA.MA.1.OAAT.A',
                description: 'Represent and solve problems involving addition and subtraction.',
                tloIdentifier: 'CA.MA.K-3.OAAT',
                tloDescription: 'Operations and Algebraic Thinking'
              }
            ]
          }
        ]
      },
      reportData: {
        tloOneId: {
          totalQuestions: 30,
          score: 10,
          maxScore: 30,
          hints: 26
        },
        tloTwoId: {
          totalQuestions: 10,
          score: 2,
          maxScore: 10,
          hints: 10
        },
        eloOneId: {
          score: 5,
          maxScore: 10
        },
        eloTwoId: {
          score: 5,
          maxScore: 20
        },
        eloThreeId: {
          score: 1,
          maxScore: 5
        },
        eloFOurId: {
          score: 1,
          maxScore: 5
        }
      }
    };
    successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});


export default router;
