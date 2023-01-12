import { useEffect } from 'react'

// TODO: move this hook to packages/common/src/components/InputStyles.js
// It's better to update SelectInputStyled in InputStyles.js

/**
 * hook injects inputId as an id into antd select using jQuery for web accessibility
 *
 * @param {string} inputId id that need to be injected to the antd select component
 * @return null
 */
export const useInputSelectId = (inputId) => {
  useEffect(() => {
    if (window.$) {
      const jq = window.$
      const selectWrapper = jq(`div[data-id='${inputId}']`)
      const inputElement = selectWrapper.find('.ant-select-search__field')
      selectWrapper.removeAttr('data-id')
      inputElement.attr('id', inputId)
    }
  }, [inputId])

  return null
}
