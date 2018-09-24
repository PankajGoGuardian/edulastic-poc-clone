import { Router } from 'express';
import Assessment from './model';
import Questions from '../question/model';
import { errorHandler } from '../utils/responseHandler';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    let assessment = new Assessment();
    let questions = new Questions();
    let result = await assessment.get(req.params.id);
    if (!result) throw new Error('invalid assessment id');
    result = result._doc;
    let qids = result.questionsApiActivity.questions;
    let allQuestions = await questions.getQuestions(qids);
    result.questionsApiActivity.questions = allQuestions;
    res.send(result);
  } catch (e) {
    console.log('error', e);
    res.status(400).send({ message: 'invalid assessment id' });
  }
});

router.post('/:id/question', async (req, res) => {
  try {
    let { question: stimulus, type, options, answer } = req.body;
    let assessmentId = req.params.id;
    let question = new Questions();
    let assessmentModel = new Assessment();
    let qDetails = await question.add({ stimulus, type, options, answer });
    let qId = qDetails._id;
    let assessment = await assessmentModel.get(assessmentId);
    assessment = assessment._doc;
    if (!assessment) {
      return res.status(400).send('invalid assessment');
    }
    assessment.questionsApiActivity.questions.push(qId.toString());
    await assessmentModel.update(assessmentId, assessment);
    res.send('question added');
  } catch (e) {
    console.log('error', e);
    res.status(400).send({ message: 'invalid data' });
  }
});
export default router;
