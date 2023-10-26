export const MAX_TAG_WIDTH = 133

/**
 * Function to update tags count for filter dynamically based on no. of tests selected.
 * @param {Object} filterRef element ref
 * @param {Array} selected array of selected tests
 * @param {Function} setCount function to update max tags count for filter
 */
export function updateFilterTagsCount(filterRef, selected, setCount) {
  const renderFilters = filterRef.current
  if (renderFilters) {
    const testsFilterTagsContainer = renderFilters.querySelector(
      '.student-standards-progress-tests-filter .ant-select-selection__rendered'
    )
    const tagsContainerBox = testsFilterTagsContainer.getBoundingClientRect()
    let tagsCount = 0
    for (let i = 0; i < selected.length; i++) {
      const tagRight = tagsContainerBox.left + (i + 1) * MAX_TAG_WIDTH
      if (tagRight < tagsContainerBox.right) {
        tagsCount += 1
      } else {
        // setting to one less to account for tag margins
        setCount(tagsCount - 1)
        break
      }
    }
  }
}
