import {
  MULTIPLE_CHOICE,
  MULTIPLE_SELECTION,
  TRUE_OR_FALSE,
} from '@edulastic/constants/const/questionType'
import { cloneDeep, pick } from 'lodash'
import { processMcqStandardQuestion } from './aiQuestionToEduQuestion/processMcqStandard'
import { processMcqTrueAndFalse } from './aiQuestionToEduQuestion/processMcqTrueAndFalse'
import { processMSQ } from './aiQuestionToEduQuestion/processMsq'

const processQuestionAndCreateItem = {
  [TRUE_OR_FALSE]: processMcqTrueAndFalse,
  [MULTIPLE_CHOICE]: processMcqStandardQuestion,
  [MULTIPLE_SELECTION]: processMSQ,
}

export const processAiGeneratedItems = (
  questions,
  questiontype,
  alignmentData,
  grades,
  subjects,
  existingQidToRegenerate
) => {
  const testItems = []

  questions.forEach((question) => {
    const itemProcessor = processQuestionAndCreateItem[questiontype]
    const item = itemProcessor(question, alignmentData, grades, subjects)
    if (existingQidToRegenerate) {
      testItems.push({ ...item, _id: existingQidToRegenerate })
    } else {
      testItems.push(item)
    }
  })

  return testItems
}

export const getAlignmentDataForAiQuestions = ([alignment], standardNames) => {
  const {
    grades,
    subject,
    standards = [],
    curriculum: standardSet = '',
  } = alignment
  let standardIds = []
  standardIds = standards.map(({ identifier }) => identifier)
  if ((standardNames || []).length) {
    standardIds = standardNames
  }
  return { grades, subject, standardIds, standardSet }
}
export const getAlignmentForEduItems = ([alignment], standardName) => {
  const { domains, standards, ...rest } = cloneDeep(alignment)
  const _domains = domains
    .filter(({ standards: sts }) =>
      sts.some(({ name }) => name === standardName)
    )
    .map((domain) => ({
      ...domain,
      standards: domain.standards.filter(({ name }) => name === standardName),
    }))

  const _standards = standards.filter(
    ({ identifier }) => identifier === standardName
  )

  return [
    {
      ...rest,
      domains: _domains,
      standards: _standards,
    },
  ]
}

export const formatStandard = (standard = {}) => {
  const formattedStandard = pick(standard, [
    '_id',
    'level',
    'grades',
    'identifier',
    'tloIdentifier',
    'tloId',
    'tloDescription',
    'eloId',
    'subEloId',
    'description',
    'curriculumId',
  ])
  return formattedStandard
}

export const getExistingQuestionContents = (assessment) => {
  const existingQuestionContent = []
  ;(assessment.itemGroups || []).forEach((itemGroup = []) => {
    const content = (itemGroup.items || [])
      .flatMap(({ data }) => data?.questions.map(({ stimulus }) => stimulus))
      .filter((x) => x)
    existingQuestionContent.push(...content)
  })
  return existingQuestionContent
}
