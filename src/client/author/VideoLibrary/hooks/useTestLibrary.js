import { useEffect } from 'react'

import { SMART_FILTERS } from '@edulastic/constants/const/filters'
import produce from 'immer'
import { test as testConstants } from '@edulastic/constants'
import { testCategoryTypes } from '@edulastic/constants/const/test'

import appConfig from '../../../../app-config'
import { vqConst } from '../const'

const { COMMUNITY, MY_CONTENT } = vqConst.vqTabs

const { PUBLISHED } = testConstants.statusConstants

const {
  videoQuizDefaultCollection: { collectionId = '' },
} = appConfig

const useTestListFilter = ({
  testSearchRequest,
  testListSearchFilters,
  currentTab,
  isVideoQuizAndAIEnabled,
  searchString,
  history,
}) => {
  const { subject, grades, status } = testListSearchFilters

  /** Tests Pagination starts */
  const fetchTestByFilters = ({ append = false }) => {
    const collections =
      isVideoQuizAndAIEnabled && collectionId ? [collectionId] : ['PUBLIC']
    const newSearch = produce(testListSearchFilters, (draft) => {
      draft.subject = subject
      draft.grades = grades
      draft.status = status
      draft.testCategories = [testCategoryTypes.VIDEO_BASED]
      draft.collections = []
      draft.filter = SMART_FILTERS.AUTHORED_BY_ME
      if (currentTab === COMMUNITY) {
        draft.collections = collections
        draft.status = PUBLISHED
        draft.filter = SMART_FILTERS.ENTIRE_LIBRARY
      }

      const _searchString = searchString?.trim() || ''
      draft.searchString = _searchString.length ? [searchString] : []
    })

    testSearchRequest({
      search: newSearch,
      sort: vqConst.sort[currentTab],
      append,
    })
  }

  useEffect(() => {
    if ([COMMUNITY, MY_CONTENT].includes(currentTab)) {
      fetchTestByFilters({
        append: false,
      })
    }
  }, [currentTab, subject, grades, status])

  /** Tests Pagination Ends */

  const handleTestSelect = (testId) => {
    history.push({
      pathname: `/author/tests/tab/review/id/${testId}`,
      state: {
        editTestFlow: true,
      },
    })
  }

  return {
    fetchTestByFilters,
    handleTestSelect,
  }
}

export default useTestListFilter
