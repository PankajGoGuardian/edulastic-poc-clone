import { push } from 'react-router-redux'
import { cloneDeep, get, isEmpty, uniq } from 'lodash'
import uuid from 'uuid/v4'
import { testItemsApi } from '@edulastic/api'

import { all, put, select, takeLatest, call } from 'redux-saga/effects'
import { captureSentryException, notification } from '@edulastic/common'
import { aiTestActions } from '.'
import { STATUS } from './constants'
import {
  getTestEntitySelector,
  setTestDataAction,
} from '../../../../TestPage/ducks'
import {
  getAlignmentDataForAiQuestions,
  getExistingQuestionContents,
  processAiGeneratedItems,
} from './helpers'

function* processAiGeneratedTestItemsSaga({
  aiGeneratedQuestions,
  testName,
  grades,
  subject,
  itemType,
  alignment,
  existingQidToRegenerate = undefined,
  assessment,
  groupIndex,
  savePreselected,
}) {
  if (!isEmpty(aiGeneratedQuestions)) {
    let existingTestItems = []
    /** Unsaved test */
    if ((assessment._id || '').length !== 24 && !existingQidToRegenerate) {
      if (savePreselected) {
        // this condition is to apply selected items from cart along with AI generated items
        existingTestItems = get(
          assessment,
          `itemGroups.${groupIndex}.items`,
          []
        )
        assessment.savePreselected = true
      }

      const aiGeneratedItems = processAiGeneratedItems(
        aiGeneratedQuestions,
        itemType,
        alignment,
        uniq([...grades]),
        [subject]
      )

      yield put(
        setTestDataAction({
          ...assessment,
          title: testName || assessment.title,
          grades: uniq([...assessment.grades, ...grades]),
          subjects: uniq([...assessment.subjects, subject]),
          itemGroups: [
            {
              type: 'STATIC',
              groupName: 'SECTION 1',
              items: [...existingTestItems, ...aiGeneratedItems],
              deliveryType: 'ALL',
              _id: uuid(),
              index: 0,
              tags: [],
            },
          ],
        })
      )
      yield put(aiTestActions.setStatus(STATUS.SUCCESS))
      yield put(push('/author/tests/create/review'))
    } else if (existingQidToRegenerate) {
      existingTestItems = get(assessment, `itemGroups.${groupIndex}.items`)
      const indexToReplace = existingTestItems
        .map(({ _id }) => _id)
        .indexOf(existingQidToRegenerate)
      const testItems = cloneDeep(existingTestItems)

      const [regeneratedItem] = processAiGeneratedItems(
        aiGeneratedQuestions,
        itemType,
        alignment,
        uniq([...grades]),
        [subject],
        existingQidToRegenerate
      )
      if (indexToReplace > -1) {
        testItems.splice(indexToReplace, 1, regeneratedItem)
      }

      assessment.itemGroups[groupIndex].items = testItems

      yield put(
        setTestDataAction({
          ...assessment,
          grades: uniq([...assessment.grades, ...grades]),
          subjects: uniq([...assessment.subjects, subject]),
        })
      )
      yield put(aiTestActions.setStatus(STATUS.SUCCESS))
    } else {
      existingTestItems = get(assessment, `itemGroups.${groupIndex}.items`)
      assessment.itemGroups[groupIndex].items = [
        ...existingTestItems,
        ...processAiGeneratedItems(
          aiGeneratedQuestions,
          itemType,
          alignment,
          uniq([...grades]),
          [subject]
        ),
      ]

      yield put(
        setTestDataAction({
          ...assessment,
          grades: uniq([...assessment.grades, ...grades]),
          subjects: uniq([...assessment.subjects, subject]),
        })
      )
      yield put(aiTestActions.setStatus(STATUS.SUCCESS))
      yield put(push(`/author/tests/tab/review/id/${assessment._id}`))
    }
  } else {
    yield put(aiTestActions.setStatus(STATUS.FAILED))
    notification({
      type: 'error',
      messageKey: 'generateAiQuestionsFailed',
    })
  }
}

function* regenerateAiTestItemsSaga({ payload }) {
  try {
    const {
      itemType = 'trueOrFalse',
      numberOfItems = 1,
      dok,
      difficulty,
      alignment = [],
      preference,
      existingQidToRegenerate,
      groupIndex,
    } = payload

    const {
      grades,
      subject,
      standardIds: commonCoreStandards,
      standardSet,
      standardDescriptions: commonCoresStandardDescriptions,
    } = getAlignmentDataForAiQuestions(alignment)

    const testEntity = yield select(getTestEntitySelector)

    const assessment = cloneDeep(testEntity)
    assessment.aiGenerated = true

    const existingQuestions = getExistingQuestionContents(assessment)

    const requestBody = {
      count: numberOfItems,
      questionType: itemType,
      ...(!isEmpty(standardSet) && { standardSet }),
      depthsOfKnowledge: dok,
      difficultLevels: difficulty,
      commonCoreStandards,
      commonCoresStandardDescriptions,
      grades,
      subject,
      ...(!isEmpty(preference) && { preference }),
      existingQuestions,
    }

    const { result } = yield call(
      testItemsApi.generateQuestionViaAI,
      requestBody
    )

    if (!isEmpty(result)) {
      const [aiGeneratedQuestion] = result
      yield* processAiGeneratedTestItemsSaga({
        aiGeneratedQuestions: [aiGeneratedQuestion],
        existingQidToRegenerate,
        grades,
        subject,
        itemType,
        alignment,
        assessment,
        groupIndex,
      })
    } else {
      notification({
        type: 'error',
        messageKey: 'generateAiQuestionsFailed',
      })
      yield put(aiTestActions.setStatus(STATUS.FAILED))
    }
  } catch (error) {
    const errMsg = error?.response?.data?.message
    if (errMsg) {
      notification({
        type: 'error',
        msg: errMsg,
      })
    } else {
      notification({
        type: 'error',
        messageKey: 'generateAiQuestionsFailed',
      })
    }
    captureSentryException(error)

    yield put(aiTestActions.setStatus(STATUS.FAILED))
  }
}

function* getAiGeneratedTestItemsSaga({ payload }) {
  try {
    /** call api with given payload to get AiGeneratedTestItems */
    const {
      testName,
      itemType,
      numberOfItems,
      dok,
      difficulty,
      alignment = [],
      preference,
      groupIndex,
      savePreselected,
      type,
      link,
    } = payload

    const {
      grades,
      subject,
      standardIds: commonCoreStandards,
      standardSet,
      standardDescriptions: commonCoresStandardDescriptions,
    } = getAlignmentDataForAiQuestions(alignment)

    const testEntity = yield select(getTestEntitySelector)

    const assessment = cloneDeep(testEntity)
    assessment.aiGenerated = true

    const existingQuestions = getExistingQuestionContents(assessment)

    const requestBody = {
      count: numberOfItems,
      questionType: itemType,
      ...(!isEmpty(standardSet) && { standardSet }),
      depthsOfKnowledge: dok,
      difficultLevels: difficulty,
      commonCoreStandards,
      grades,
      subject,
      ...(!isEmpty(preference) && { preference }),
      existingQuestions,
      commonCoresStandardDescriptions,
      type,
      link,
    }

    const { result } = yield call(
      testItemsApi.generateQuestionViaAI,
      requestBody
    )
    if (!isEmpty(result))
      yield* processAiGeneratedTestItemsSaga({
        aiGeneratedQuestions: result,
        testName,
        grades,
        subject,
        alignment,
        itemType,
        assessment,
        groupIndex,
        savePreselected,
      })
  } catch (error) {
    const errMsg = error?.response?.data?.message
    if (errMsg) {
      notification({
        type: 'error',
        msg: errMsg,
      })
    } else {
      notification({
        type: 'error',
        messageKey: 'generateAiQuestionsFailed',
      })
    }
    captureSentryException(error)

    yield put(aiTestActions.setStatus(STATUS.FAILED))
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeLatest(
      aiTestActions.getAiGeneratedTestItems,
      getAiGeneratedTestItemsSaga
    ),
    yield takeLatest(
      aiTestActions.regenerateAiTestItems,
      regenerateAiTestItemsSaga
    ),
  ])
}
