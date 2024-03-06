import { useEffect, useRef } from 'react'
import { vqConst } from '../const'

const useVQLibraryCommon = ({
  resetVQLibrary,
  fetchVideos,
  fetchTestByFilters,
  ytNextPageToken,
  testList,
  currentTab,
  vqCount,
}) => {
  const infiniteLoaderRef = useRef(null)
  const testsCountInTestList = testList?.length

  const hasMoreTests =
    currentTab !== vqConst.vqTabs.YOUTUBE
      ? testsCountInTestList < vqCount
      : false

  useEffect(() => {
    return () => {
      resetVQLibrary()
    }
  }, [])

  /** Append YouTube videos - Youtube Pagination Starts */
  const handleIntersectYoutube = (entries) => {
    const [entry] = entries
    if (entry.isIntersecting) {
      if (currentTab !== vqConst.vqTabs.YOUTUBE) {
        if (hasMoreTests) {
          fetchTestByFilters({ append: true })
        }
      } else {
        fetchVideos({ append: true })
      }
    }
  }

  useEffect(() => {
    if (!infiniteLoaderRef?.current) return
    const observer = new IntersectionObserver(handleIntersectYoutube)
    observer.observe(infiniteLoaderRef.current)
    return () => observer.disconnect()
  }, [infiniteLoaderRef, hasMoreTests, testsCountInTestList, ytNextPageToken])
  /** Append YouTube videos - Youtube Pagination Ends */

  return {
    infiniteLoaderRef,
  }
}

export default useVQLibraryCommon
