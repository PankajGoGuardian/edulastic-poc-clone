import { useCallback, useEffect, useMemo, useRef } from 'react'
import { throttle } from 'lodash'

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
  vqListData,
  isLoading,
}) => {
  const loaderRefTestLibrary = useRef(null)

  const { subject, grades, status } = testListSearchFilters

  /** Tests Pagination starts */
  const fetchTestByFilters = ({ append = false }) => {
    const collections =
      isVideoQuizAndAIEnabled && collectionId ? [collectionId] : []
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

      if (typeof searchString === 'string') {
        draft.searchString = searchString.length ? [searchString] : []
      }
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
        subject,
        grades,
        status,
      })
    }
  }, [currentTab, subject, grades, status])

  const handleFetchMoreTests = useMemo(() => {
    return throttle(
      async ({ append = false }) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await fetchTestByFilters({ append })
      },
      { trailing: true }
    )
  }, [fetchTestByFilters])

  const handleIntersectOnTestList = useCallback(
    (entries) => {
      const [entry] = entries
      if (
        [COMMUNITY, MY_CONTENT].includes(currentTab) &&
        entry.isIntersecting &&
        !isLoading
      ) {
        handleFetchMoreTests({ append: true })
      }
    },
    [
      loaderRefTestLibrary,
      searchString,
      subject,
      grades,
      status,
      vqListData,
      currentTab,
    ]
  )
  useEffect(() => {
    if (!loaderRefTestLibrary?.current) return
    const testIntersectObserver = new IntersectionObserver(
      handleIntersectOnTestList,
      {
        root: null,
        threshold: 0,
      }
    )
    testIntersectObserver.observe(loaderRefTestLibrary.current)

    return () => {
      if (loaderRefTestLibrary?.current) {
        return testIntersectObserver.disconnect()
      }
    }
  }, [
    loaderRefTestLibrary,
    searchString,
    subject,
    grades,
    status,
    vqListData,
    currentTab,
  ])
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
    loaderRefTestLibrary,
    fetchTestByFilters,
    handleTestSelect,
  }
}

export default useTestListFilter
