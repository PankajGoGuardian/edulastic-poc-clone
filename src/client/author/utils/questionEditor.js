import { isEmpty } from 'lodash'
import { questionType } from '@edulastic/constants'
import { getCards } from '../PickUpQuestionType/components/QuestionType/constants'

const { MULTIPART, useLanguageFeatureQn } = questionType

const removeResponseBoxesFromStimulus = (stimulus) => {
  if (!window.$ || !stimulus || !stimulus.trim().length) return stimulus
  const jqueryEl = $('<p>').append(stimulus)
  const tagsToRemove = [
    'mathinput',
    'mathunit',
    'textinput',
    'textdropdown',
    'response',
  ]
  tagsToRemove.forEach((tagToRemove) => {
    // eslint-disable-next-line func-names
    jqueryEl.find(tagToRemove).each(function () {
      $(this).replaceWith(' ')
    })
  })
  return jqueryEl.html()
}

export const getNewQuestionTypeData = ({
  currentQuestionData,
  newQuestionType,
  isPremiumUser,
}) => {
  const allQuestionData = getCards()
  let { data: newQuestionData = {} } =
    allQuestionData.find(
      (question) => question?.data?.type === newQuestionType
    ) || {}

  const {
    id,
    stimulus = '',
    instructorStimulus,
    sampleAnswer,
    hints = [],
    metadata: { distractor_rationale_response_level: distractors = [] } = {},
    alignment,
    grades,
    subjects,
    depthOfKnowledge,
    authorDifficulty,
    bloomsTaxonomy,
    tags,
    testletQuestionId,
    testletResponseIds,
    testletAdditionalMetadata,
    rubrics,
    languageFeatures: {
      es: {
        stimulus: spanishStimulus = '',
        hints: spanishHints = [],
        instructorStimulus: spanishInstructorStimulus = '',
        sampleAnswer: spanishSampleAnswer = '',
      } = {},
    } = {},
    validation: {
      validResponse: { score: currentQuestionScore = 1 } = {},
    } = {},
  } = currentQuestionData || {}

  const languageFeaturesData = {
    languageFeatures: {
      es: {
        stimulus: removeResponseBoxesFromStimulus(spanishStimulus),
        hints: spanishHints,
        instructorStimulus: spanishInstructorStimulus,
        sampleAnswer: spanishSampleAnswer,
      },
    },
  }

  const metadata = { distractor_rationale_response_level: distractors }

  const hasLanguageFeatures =
    isPremiumUser &&
    useLanguageFeatureQn.includes(newQuestionType) &&
    (spanishStimulus ||
      spanishHints?.length ||
      spanishInstructorStimulus ||
      spanishSampleAnswer)

  if (!isEmpty(newQuestionData)) {
    newQuestionData = {
      id,
      ...newQuestionData,
      stimulus: removeResponseBoxesFromStimulus(stimulus),
      ...(instructorStimulus ? { instructorStimulus } : {}),
      ...(sampleAnswer ? { sampleAnswer } : {}),
      ...(hints?.length ? { hints } : {}),
      ...(distractors?.length ? { metadata } : {}),
      ...(alignment ? { alignment } : {}),
      ...(grades ? { grades } : {}),
      ...(subjects ? { subjects } : {}),
      ...(depthOfKnowledge ? { depthOfKnowledge } : {}),
      ...(authorDifficulty ? { authorDifficulty } : {}),
      ...(bloomsTaxonomy ? { bloomsTaxonomy } : {}),
      ...(tags ? { tags } : {}),
      ...(testletQuestionId ? { testletQuestionId } : {}),
      ...(testletResponseIds ? { testletResponseIds } : {}),
      ...(testletAdditionalMetadata ? { testletAdditionalMetadata } : {}),
      ...(hasLanguageFeatures ? languageFeaturesData : {}),
    }

    if (!isEmpty(rubrics)) {
      newQuestionData.rubrics = rubrics
      newQuestionData.validation.validResponse.score = currentQuestionScore
    }
  }

  return newQuestionData
}

export const getUpdatedItemData = ({
  currentItemData,
  newQuestionData,
  newQuestionType,
}) => {
  const updatedItemData = {
    ...currentItemData,
    rows: [
      {
        tabs: [],
        dimension: '100%',
        widgets: [
          {
            widgetType: 'question',
            type: newQuestionData.type,
            title: newQuestionData.title,
            reference: newQuestionData.id,
            tabIndex: 0,
          },
        ],
        flowLayout: false,
        content: '',
      },
    ],
    data: {
      ...newQuestionData.data,
      questions: [{ ...newQuestionData }],
    },
    multipartItem: newQuestionType === MULTIPART,
  }

  return updatedItemData
}

export const getPathAndRouterState = ({
  newQuestionType,
  testItemId,
  testId,
  isRegradeFlow,
  isTestFlow,
  history,
  match,
  i18Translate,
}) => {
  let routerState = history?.location?.state || {}
  let backButtonPath = ''
  let currentPath = ''
  const isNewTypeMultipart = newQuestionType === MULTIPART

  if (testItemId === 'new') {
    if (isTestFlow || isRegradeFlow) {
      backButtonPath = `/author/tests/${testId}/createItem/new/pickup-questiontype`
      currentPath = isNewTypeMultipart
        ? `/author/tests/${testId}/createItem/new`
        : `/author/tests/${testId}/createItem/new/questions/create/${newQuestionType}`
    } else {
      backButtonPath = `/author/items/new/pickup-questiontype`
      currentPath = isNewTypeMultipart
        ? '/author/items/new/item-detail'
        : `/author/questions/create/${newQuestionType}`
      routerState = {
        ...routerState,
        backUrl: match.url,
        backText: i18Translate('component.pickupcomponent.headertitle'),
      }
    }
  }

  if (testItemId !== 'new' && !isRegradeFlow) {
    if (isTestFlow) {
      backButtonPath = `/author/tests/${testId}/createItem/new/pickup-questiontype`
    } else {
      backButtonPath = `/author/items/new/pickup-questiontype`
    }
    currentPath = match.url
  }

  if (testItemId !== 'new' && isRegradeFlow) {
    backButtonPath = `/author/tests/${testId}/createItem/new/pickup-questiontype`
    currentPath = isNewTypeMultipart
      ? `/author/tests/${testId}/createItem/new`
      : `/author/tests/${testId}/createItem/new/questions/create/${newQuestionType}`
    routerState = {
      ...routerState,
      rowIndex: 0,
      tabIndex: 0,
    }
  }

  return { backButtonPath, currentPath, routerState }
}
