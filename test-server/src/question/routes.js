import { Router } from 'express';
import Question from './model';
import { evaluateQuestion } from '../utils/evaluate';

const router = Router();

router.get('/', async (req, res) => {
  res.send('questions');
});

router.post('/evaluate', async (req, res) => {
  try {
    let { qid, answer } = req.body;
    if (!qid || answer === undefined) {
      return res.send('insufficied params');
    }
    let question = new Question();
    let qdetails = await question.getQuestion(qid);
    if (!qdetails) {
      return res.status(400).send('invalid qid');
    }
    let result = evaluateQuestion(qdetails, answer);
    return res.send({ answer: result });
  } catch (e) {
    console.log('error !: ', e);
    res.status(400).send('bad request');
  }
});

export default router;
