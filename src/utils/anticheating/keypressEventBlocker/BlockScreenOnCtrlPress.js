import { useEffect } from 'react'
import { appendOverlayToBody } from './KeypressEventBlockerHelper'

const BlockScreenOnCtrlPress = () => {
  useEffect(() => {
    const overlay = appendOverlayToBody()
    const handleKeyDown = (e) => {
      const isCtrlPressed = e.ctrlKey

      if (!isCtrlPressed) {
        return
      }
      overlay.style.display = 'block'
    }

    const handleCloseClick = () => {
      overlay.style.display = 'none'
    }

    const closeButton = overlay.querySelector('button')
    closeButton.addEventListener('click', handleCloseClick)

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      overlay.remove()
    }
  }, [])

  return null
}

export default BlockScreenOnCtrlPress
