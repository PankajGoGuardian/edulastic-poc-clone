import { push } from 'react-router-redux'
import { all, put, select, takeLatest } from 'redux-saga/effects'
import { aiTestActions } from '.'
import { STATUS } from './constants'
import {
  clearCreatedItemsAction,
  clearTestDataAction,
  getTestEntitySelector,
  setDefaultTestDataAction,
  setTestDataAction,
} from '../../../../TestPage/ducks'
import { processAiGeneratedItems } from './helpers'

function* getAiGeneratedTestItemsSaga({ payload }) {
  try {
    const { testName, grades, subjects } = payload
    yield put(aiTestActions.setTestDetails(payload))
    /** call api with given payload to get AiGeneratedTestItems */
    const aiGeneratedItems = [
      // {
      //   name: 'Is chewing an important step in food digestion?',
      //   displayAtSecond: 17,
      //   correctAnswer: true,
      //   coreStandard: [' 7.RP.A.1'],
      //   depthOfKnowledge: 'Skill/Concept',
      //   difficulty: 'easy',
      //   type: 'TF',
      // },
      {
        name: 'How is poop made?',
        displayAtSecond: 6,
        correctAnswerIndex: 3,
        coreStandard: [' 7.RP.A.1'],
        depthOfKnowledge: 'Skill/Concept',
        difficulty: 'easy',
        options: [
          {
            name: 'By eating food',
            value: 1,
          },
          {
            name: 'By drinking water',
            value: 2,
          },
          {
            name: 'Through the digestive system',
            value: 3,
          },
          {
            name: 'By breathing air',
            value: 4,
          },
        ],
        type: 'MCQ',
      },
      // {
      //   name: 'What is the first step of food processing called?',
      //   displayAtSecond: 33,
      //   correctAnswersIndex: [1, 2],
      //   coreStandard: [' 7.RP.A.1'],
      //   depthOfKnowledge: 'Skill/Concept',
      //   difficulty: 'easy',
      //   options: [
      //     {
      //       name: 'Ingestion',
      //     },
      //     {
      //       name: 'Absorption',
      //     },
      //     {
      //       name: 'Elimination',
      //     },
      //     {
      //       name: 'Digestion',
      //     },
      //   ],
      //   type: 'MSQ',
      // },
    ]
    yield put(aiTestActions.setAiGeneratedTestItems())
    yield put(setDefaultTestDataAction)
    const assessment = yield select(getTestEntitySelector)
    yield put(clearTestDataAction())
    yield put(clearCreatedItemsAction())
    yield put(push('/author/tests/create/review'))
    yield put(
      setTestDataAction({
        ...assessment,
        title: testName,
        grades,
        subjects,
        itemGroups: [
          {
            type: 'STATIC',
            groupName: 'SECTION 1',
            items: processAiGeneratedItems(aiGeneratedItems),
            deliveryType: 'ALL',
            _id: Date.now(),
            index: 0,
            tags: [],
          },
        ],
      })
    )

    yield put(aiTestActions.setStatus, STATUS.SUCCESS)
  } catch (error) {
    console.log(error)
  }
}

export default function* watcherSaga() {
  yield all([
    takeLatest(
      aiTestActions.getAiGeneratedTestItems,
      getAiGeneratedTestItemsSaga
    ),
  ])
}
