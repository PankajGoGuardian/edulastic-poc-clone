import { get, set } from 'lodash'
import { useCallback, useMemo } from 'react'

export const useSaveHighlights = ({
  authLanguage,
  item,
  page: pageNumber,
  widgetIndex,
  viewComponent,
  userWork,
  highlights,
  setHighlights,
  saveUserWork,
  currentLang,
}) => {
  const highlightIndex = useMemo(() => {
    return `${currentLang}_${
      item.paginated_content
        ? `${widgetIndex || 0}-${pageNumber}`
        : widgetIndex || 0
    }`
  }, [item.paginated_content, pageNumber, widgetIndex, currentLang])

  const highlightedContent = useMemo(() => {
    const isAuthorPreviewMode =
      viewComponent === 'editQuestion' ||
      viewComponent === 'authorPreviewPopup' ||
      viewComponent === 'ItemDetail'

    return isAuthorPreviewMode
      ? get(userWork, `resourceId[${highlightIndex}][${authLanguage}]`, '')
      : get(highlights, `[${highlightIndex}]`, '')
  }, [authLanguage, highlights, userWork, highlightIndex, viewComponent])

  const saveHighlights = useCallback(
    (updatedContent) => {
      if (setHighlights) {
        const newHighlights = highlights || {}
        // this is available only at student side
        setHighlights({ ...newHighlights, [highlightIndex]: updatedContent })
      } else {
        // saving the highlights at author side
        // setHighlights is not available at author side
        const newUserWork = set(
          userWork || {},
          `resourceId[${highlightIndex}][${authLanguage}]`,
          updatedContent
        )

        saveUserWork({
          [item.id]: newUserWork,
        })
      }
    },
    [authLanguage, setHighlights, highlights, highlightIndex, item.id]
  )

  return {
    highlightedContent,
    saveHighlights,
  }
}
