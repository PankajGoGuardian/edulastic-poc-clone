import { useEffect } from 'react'
import { CONTEXTMENU_EVENT_NAME } from '../../client/assessment/constants/others'

const useContextMenuBlocker = (changeField) => {
  const contextmenuEventCallback = (event) => event.preventDefault()
  useEffect(() => {
    document.addEventListener(CONTEXTMENU_EVENT_NAME, contextmenuEventCallback)
    return () => {
      document.removeEventListener(
        CONTEXTMENU_EVENT_NAME,
        contextmenuEventCallback
      )
    }
  }, [changeField])
}

export default useContextMenuBlocker
