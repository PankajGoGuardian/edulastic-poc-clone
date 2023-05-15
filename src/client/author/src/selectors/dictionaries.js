import { createSelector } from 'reselect'
import { keyBy, isEmpty, forEach, uniqBy } from 'lodash'
import selectData from '../../TestPage/components/common/selectsData'
import {
  getInterestedCurriculumsSelector,
  getShowAllCurriculumsSelector,
} from './user'

const { defaultStandards } = selectData
export const stateSelector = (state) => state.dictionaries
export const curriculumsSelector = createSelector(
  stateSelector,
  (state) => state.curriculums
)
export const getCurriculumsListSelector = createSelector(
  curriculumsSelector,
  (state) => state.curriculums
)

export const curriculumsByIdSelector = createSelector(
  getCurriculumsListSelector,
  (state) => keyBy(state, '_id')
)

export const getFormattedCurriculums = (
  interestedCurriculums = [],
  allCurriculums,
  props,
  showAllStandards = true
) => {
  let { subject } = props
  if (isEmpty(subject)) {
    return []
  }
  subject =
    typeof subject === 'string'
      ? [subject.toLowerCase()]
      : subject.map((e) => e.toLowerCase())
  const defaultStandard = []
  const interestedCurriculumsForUser = []
  const otherCurriculumsForUser = []
  const defaultCurriculumsMap = {}
  forEach(defaultStandards, (val, key) => {
    if (subject.includes(key.toLowerCase())) {
      defaultCurriculumsMap[val] = key
    }
  })
  const interestedCurriculumsMap = interestedCurriculums.reduce((map, o) => {
    if (subject.includes(o.subject.toLowerCase())) {
      map[o.name] = o
    }
    return map
  }, {})
  ;[...allCurriculums]
    .sort((a, b) =>
      a.curriculum.toUpperCase() > b.curriculum.toUpperCase() ? 1 : -1
    )
    .forEach((el) => {
      const formattedData = {
        value: el._id,
        text: el.name || el.curriculum,
        disabled: el.disabled || false,
      }
      if (
        !isEmpty(interestedCurriculumsMap) &&
        interestedCurriculumsMap[el.curriculum]
      ) {
        interestedCurriculumsForUser.push(formattedData)
      } else if (
        isEmpty(interestedCurriculumsMap) &&
        defaultCurriculumsMap[el.curriculum]
      ) {
        defaultStandard.push(formattedData)
      } else if (subject.includes(el.subject.toLowerCase())) {
        otherCurriculumsForUser.push(formattedData)
      }
    })

  // if DA check show all standards then showAllStandards will be true for all teachers in that disctrict
  return showAllStandards
    ? !isEmpty(interestedCurriculumsForUser) || !isEmpty(defaultStandard)
      ? [
          ...defaultStandard,
          ...interestedCurriculumsForUser,
          { value: '------', text: '--------------------', disabled: true },
          ...otherCurriculumsForUser,
        ]
      : [...defaultStandard, ...otherCurriculumsForUser]
    : interestedCurriculumsForUser.length
    ? interestedCurriculumsForUser
    : defaultStandard
}

export const getFormattedCurriculumsSelector = (state, props) => {
  const showAllStandards = getShowAllCurriculumsSelector(state)
  const interestedCurriculums = getInterestedCurriculumsSelector(state)
  const allCurriculums = getCurriculumsListSelector(state)
  return getFormattedCurriculums(
    interestedCurriculums,
    allCurriculums,
    props,
    showAllStandards
  )
}

export const getDictionariesAlignmentsSelector = createSelector(
  stateSelector,
  (state) => state.alignments
)
export const standardsSelector = createSelector(stateSelector, (state) => {
  const standardsWithId = state.standards.data.map((el) => ({
    _id: el.id,
    ...el,
  }))
  const elo = standardsWithId.filter((item) => item.level === 'ELO')
  const tlo = uniqBy(
    standardsWithId.map((item) => ({
      identifier: item.tloIdentifier,
      description: item.tloDescription,
      position: item.position,
      _id: item.tloId,
    })),
    '_id'
  )
  return {
    ...state.standards,
    elo,
    tlo,
  }
})

export const getStandardsListSelector = createSelector(
  standardsSelector,
  (state) => {
    const elo = state.elo.sort((a, b) => a.position - b.position)
    const tlo = state.tlo.sort((a, b) => a.position - b.position)
    return { elo, tlo }
  }
)

export const getStandardsEloSelector = createSelector(
  stateSelector,
  (state) => {
    const standardsWithId = state.standards.eloData.map((el) => ({
      _id: el.id,
      ...el,
    }))
    const elo = standardsWithId
      .filter((item) => item.level === 'ELO')
      ?.sort((a, b) => a.position - b.position)
    return elo || []
  }
)

export const getStandardsTloSelector = createSelector(
  stateSelector,
  (state) => {
    const { tloData } = state.standards
    const tlo = uniqBy(
      tloData.map((item) => ({
        ...item,
        _id: item.id,
      })),
      '_id'
    )?.sort((a, b) => a.position - b.position)
    return tlo || []
  }
)

export const getRecentStandardsListSelector = createSelector(
  stateSelector,
  (state) => state.recentStandardsList || []
)

export const getRecentCollectionsListSelector = createSelector(
  stateSelector,
  (state) => state.recentCollectionsList || []
)
