import { useEffect } from 'react'
import { SMART_FILTERS } from '@edulastic/constants/const/filters'
import produce from 'immer'
import { testCategoryTypes } from '@edulastic/constants/const/test'
import appConfig from '../../../../app-config'
import { vqConst } from '../const'

const { COMMUNITY, MY_CONTENT } = vqConst.vqTabs

const {
  videoQuizDefaultCollection: { collectionId = '' },
} = appConfig

const useTestListFilter = ({
  testSearchRequest,
  vqFilters,
  currentTab,
  isVideoQuizAndAIEnabled,
  searchString,
  history,
}) => {
  const { subject, grades, status } = vqFilters

  /** Tests Pagination starts */
  const fetchTestByFilters = ({
    append = false,
    useEmptySearchString = false,
  }) => {
    const collections =
      isVideoQuizAndAIEnabled && collectionId
        ? [collectionId, 'PUBLIC']
        : ['PUBLIC']

    const newSearch = produce(vqFilters, (draft) => {
      draft.subject = subject
      draft.grades = grades
      draft.status = status
      draft.testCategories = [testCategoryTypes.VIDEO_BASED]
      draft.collections = []
      draft.filter = SMART_FILTERS.CO_AUTHOR
      if (currentTab === COMMUNITY) {
        draft.collections = collections
        draft.filter = SMART_FILTERS.ENTIRE_LIBRARY
      }

      const _searchString = searchString?.trim() || ''
      draft.searchString =
        _searchString.length && !useEmptySearchString ? [_searchString] : []
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
