import { useEffect, useCallback, useContext } from 'react'
import { ScrollContext } from '@edulastic/common'

const handleStickyToolbar = (editor, toolbar) => {
  const APP_HEADER = (window.innerWidth <= 1024 ? 42 : 62) + 50
  const { top: editorTop, left: editorLeft } = editor?.$box?.offset() || {}
  const editorHeight = editor?.$box?.outerHeight() || 0
  const editorRight =
    window.innerWidth - (editor?.$box?.outerWidth() || 0) - editorLeft
  const toolbarHeight = $(toolbar).find('.fr-toolbar').height()

  const sticky =
    editorTop - toolbarHeight < APP_HEADER &&
    editorTop + editorHeight > APP_HEADER

  if (sticky) {
    toolbar.style.position = 'fixed'
    toolbar.style.top = `${APP_HEADER}px`
    toolbar.style.left = `${editorLeft}px`
    toolbar.style.right = `${editorRight}px`
  } else {
    toolbar.style.position = ''
    toolbar.style.top = ''
    toolbar.style.left = ''
    toolbar.style.right = ''
  }
}
/**
 *
 * @param {string} toolbarId toolbar container id
 * @param {object} editor Froala Editor instance
 * @param {Element} toolbar ToolbarContainer
 * @returns
 */
const useStickyToolbar = (toolbarId, editor, toolbar) => {
  const { getScrollElement } = useContext(ScrollContext)

  const onScroll = useCallback(() => {
    if (editor.hasFocus) {
      handleStickyToolbar(editor, toolbar)
    }
  }, [!editor, !toolbar])

  useEffect(() => {
    if (toolbarId && editor && toolbar) {
      const scrollContainer = getScrollElement()
      scrollContainer.addEventListener('scroll', onScroll)
      editor.handleStickyToolbar = handleStickyToolbar

      return () => {
        scrollContainer.removeEventListener('scroll', onScroll)
      }
    }
  }, [toolbarId, !!editor, !!toolbar])

  return null
}

export default useStickyToolbar
