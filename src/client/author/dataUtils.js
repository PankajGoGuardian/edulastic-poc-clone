import React from 'react'
import { get, keyBy, uniqBy, uniq, memoize, omit } from 'lodash'
import { questionType as questionTypes } from '@edulastic/constants'
import { nonPremiumCollections } from '@edulastic/constants/const/collections'
import { PEAR_ASSESSMENT_CERTIFIED_NAME } from '@edulastic/constants/const/common'
import { SMART_FILTERS } from '@edulastic/constants/const/filters'
import { UserIcon } from './ItemList/components/Item/styled'
import { EdulasticVerified } from './TestList/components/ListItem/styled'

const { PASSAGE } = questionTypes

export const hasUserGotAccessToPremiumItem = (
  itemCollections = [],
  orgCollections = [],
  returnFlag = true
) => {
  const itemCollectionsMap = keyBy(itemCollections, (o) => o._id)
  if (returnFlag) {
    return !!orgCollections.find((o) => itemCollectionsMap[o._id])
  }
  return orgCollections.find((o) => itemCollectionsMap[o._id])
}

export const getAuthorCollectionMap = (isBottom, width, height) => ({
  edulastic_certified: {
    icon: <EdulasticVerified bottom={isBottom} width={width} height={height} />,
    displayName: PEAR_ASSESSMENT_CERTIFIED_NAME,
  },
  engage_ny: {
    icon: <EdulasticVerified bottom={isBottom} width={width} height={height} />,
    displayName: PEAR_ASSESSMENT_CERTIFIED_NAME,
  },
  [PEAR_ASSESSMENT_CERTIFIED_NAME]: {
    icon: <EdulasticVerified bottom={isBottom} width={width} height={height} />,
    displayName: PEAR_ASSESSMENT_CERTIFIED_NAME,
  },
  Great_Minds_DATA: { icon: <UserIcon />, displayName: 'Eureka Math' },
  PROGRESS_DATA: { icon: <UserIcon />, displayName: 'PROGRESS Bank' },
})

export const getTestAuthorName = (item, orgCollections) => {
  const { createdBy = {}, collections = [], authors = [] } = item

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(
      collections,
      orgCollections,
      false
    )
    if (collectionItem) {
      return collectionItem.name
    }
  }
  if (createdBy._id) {
    const author = authors.find((_item) => _item._id === createdBy._id) || {}
    return author.name || authors[0].name
  }
  return authors.length && authors[0].name
}

export const getTestItemAuthorName = (item, orgCollections) => {
  const { owner = '', collections = [], authors = [] } = item

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(
      collections,
      orgCollections,
      false
    )
    if (collectionItem) {
      return collectionItem.name
    }
  }
  if (owner) {
    const author = authors.find((_item) => _item._id === owner) || {}
    return author.name || authors?.[0]?.name || 'Anonymous'
  }
  return (authors.length && authors?.[0]?.name) || 'Anonymous'
}

export const getTestItemAuthorIcon = (item, orgCollections) => {
  const { collections = [] } = item

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(
      collections,
      orgCollections,
      false
    )
    const collectionMap = getAuthorCollectionMap(true, 15, 15)
    if (collectionItem && collectionMap[collectionItem.name]) {
      return collectionMap[collectionItem.name].icon
    }
  }

  return <UserIcon data-cy="user" />
}

export const getPlaylistAuthorName = (item) => {
  const {
    _source: { createdBy },
  } = item
  if (createdBy) {
    return `${createdBy.name}`
  }
  const {
    _source: { sharedBy },
  } = item
  if (sharedBy && sharedBy[0]) {
    return `${sharedBy[0].name}`
  }
  return ``
}

const getTitleFromQuestionType = memoize((questionType) =>
  questionTypes.selectsData.find((data) => data.value === questionType)
)

export const getQuestionType = (item) => {
  const questions = get(item, ['data', 'questions'], [])
  const resources = get(item, ['data', 'resources'], [])
  const hasPassage =
    resources.some((_item) => _item.type === PASSAGE) || item.passageId
  /**
   * Trying to find the question title from questionType (used in q-type search dropdown)
   * https://snapwiz.atlassian.net/browse/EV-17163
   * */
  const _questionTypeTitle = getTitleFromQuestionType(questions[0]?.type)?.text
  const questionTitle = _questionTypeTitle || questions[0]?.title || ''

  if (hasPassage) {
    // All questions that are linked to passage should show type as passage and question type attached to passage
    return questions.length > 1
      ? [PASSAGE.toUpperCase(), 'MULTIPART']
      : questionTitle
      ? [PASSAGE.toUpperCase(), questionTitle]
      : [PASSAGE.toUpperCase()]
  }
  if (questions.length > 1 || resources.length) {
    return ['MULTIPART']
  }
  return questionTitle ? [questionTitle] : []
}

/**
 * @param summary is the summary object from test
 * @param interestestedCurriculums is the user interested curriculums
 * @param curriculumId is the current filter used
 */

export const getInterestedStandards = (
  summary,
  alignment = [],
  interestedCurriculums = []
) => {
  let interestedStandards
  const allStandards = summary?.standards || []

  if (!allStandards?.length) return []
  const authorStandards = allStandards.filter(
    (item) => !item.isEquivalentStandard && item.curriculumId
  )
  const curriculumIds = interestedCurriculums.map(({ _id }) => _id)

  // pick standards matching with interested curriculums
  interestedStandards = authorStandards.filter((standard) =>
    curriculumIds.includes(standard.curriculumId)
  )

  // If authored standards don't match, pick from multi standard mapping
  if (!interestedStandards.length && alignment.length) {
    const equivalentStandards = uniqBy(
      alignment
        .filter(({ isEquivalentStandard }) => !!isEquivalentStandard)
        .flatMap(({ domains }) =>
          domains.flatMap(({ curriculumId, standards }) =>
            standards.map(({ name: identifier, key: id }) => ({
              identifier,
              id,
              curriculumId,
            }))
          )
        ),
      'identifier'
    )
    const standardData = Object.values(
      authorStandards.reduce((acc, item) => {
        const standard = acc[item.curriculumId]
        if (standard) {
          standard.totalPoints += item.totalPoints
          standard.totalQuestions += item.totalQuestions
        } else {
          acc[item.curriculumId] = { ...item }
        }
        return acc
      }, {})
    )

    standardData.forEach((standard) => {
      const equivStandards = equivalentStandards.filter((eqSt) =>
        curriculumIds.includes(eqSt.curriculumId)
      )
      if (equivStandards.length) {
        for (const eqSt of equivStandards) {
          interestedStandards.push({
            ...standard,
            identifier: eqSt.identifier,
          })
        }
      }
    })
  }
  // if equivalent standards are not available
  if (!(interestedStandards.length || alignment.length)) {
    interestedStandards = authorStandards
  }

  return interestedStandards
}

export const flattenPlaylistStandards = (modules = []) => {
  const standardz =
    modules
      ?.flatMap((m) => m?.data?.flatMap((d) => d?.standardIdentifiers))
      ?.filter((item) => !!item) || []
  return uniq(standardz)
}

export const setDefaultInterests = (newInterest) => {
  const sessionGlobals =
    JSON.parse(sessionStorage.getItem('filters[globalSessionFilters]')) || {}
  // For all subject change reset curriculumIds
  const resetCurriculumId = Object.keys(newInterest).includes('subject')
    ? { curriculumId: '' }
    : {}
  sessionStorage.setItem(
    'filters[globalSessionFilters]',
    JSON.stringify({ ...sessionGlobals, ...newInterest, ...resetCurriculumId })
  )
}

export const getDefaultCurriculum = (
  interestedCurriculums = [],
  interestedSubjects = [],
  userRole
) => {
  const subjectInterestedCurriculums = (
    interestedCurriculums || []
  ).filter((curr) => interestedSubjects.includes(curr.subject))
  if (subjectInterestedCurriculums) {
    const userSubjectInterestedCurriculums = subjectInterestedCurriculums.find(
      (curr) => curr.orgType === userRole
    )
    if (userSubjectInterestedCurriculums) {
      return userSubjectInterestedCurriculums._id
    }
    return 'interested'
  }
  return ''
}

export const getDefaultInterests = () =>
  JSON.parse(sessionStorage.getItem('filters[globalSessionFilters]')) || {}

export const sortTestItemQuestions = (testItems) => {
  const sortedTestItems = testItems.map((item) => {
    if (!(item.data && item.data.questions)) {
      return item
    }
    // sort questions based on widegets
    const questions = keyBy(get(item, 'data.questions', []), 'id')
    const widgets = (item.rows || []).reduce(
      (acc, curr) => [...acc, ...(curr.widgets || [])],
      []
    )
    return {
      ...item,
      data: {
        ...item.data,
        questions: widgets
          .map((widget) => questions[widget.reference])
          .filter((q) => !!q),
      },
    }
  })

  return sortedTestItems
}

// Show premium label on items/tests/playlists
export const showPremiumLabelOnContent = (
  itemCollections = [],
  orgCollections = []
) => {
  // TODO: if collection ids are constant then replace with ids instead of looping on orgCollections
  const premiumCollectionIds = orgCollections
    .filter(
      (c) =>
        ![PEAR_ASSESSMENT_CERTIFIED_NAME.toLowerCase(), 'engage ny'].includes(
          c.name.toLowerCase()
        )
    )
    .map((x) => x._id)
  return itemCollections.some((c) => premiumCollectionIds.includes(c._id))
}

/**
 * Checks if the item is premium content or not.
 * Any item which has collections excluding pear assessment certified and engage ny
 * is premium content
 * @param {Array<Object>} _collections
 * @returns {Boolean} isPremium
 */
export const isPremiumContent = (_collections = []) => {
  const hasPremiumCollection = _collections.some(
    ({ type }) => type === 'premium'
  )
  const nonPremiumIds = Object.keys(nonPremiumCollections)
  const isPremium = (collection) => !nonPremiumIds.includes(collection._id)
  const result = _collections.filter(isPremium)
  return result.length > 0 && hasPremiumCollection
}

/**
 * Checks if the provided object or any of its nested objects have non-empty values.
 * @param {object} obj - The object to check.
 * @returns {boolean} - Returns true if any field in the object has a non-empty value, otherwise returns false.
 */
const hasValue = (obj) =>
  Object.values(obj).some((val) =>
    val && typeof val === 'object' ? hasValue(val) : val
  )

/**
 * Generates a message indicating the absence of data based on the provided filters, item type, and default message.
 * @param {object} filters - The filters applied to the data.
 * @param {string} itemType - The type of item for which the message is generated.
 * @param {string} defaultMsg - The default message to be used if no data is found.
 * @returns {string} - Returns a message indicating the absence of data.
 */
export const getNoDataTextForFilter = (filters, itemType, defaultMsg) => {
  const isEntireLibrary = filters.filter === SMART_FILTERS.ENTIRE_LIBRARY
  const hasOtherFilter =
    hasValue(omit(filters, ['filter', 'searchString'])) || !isEntireLibrary

  const isCategoryFilter = isEntireLibrary || filters?.searchString?.length > 0

  if (hasOtherFilter || !isCategoryFilter) {
    return `No ${itemType} matches applied filters. Please re-check filters applied on the left.`
  }
  return defaultMsg || `No ${itemType} available for the search criteria`
}
