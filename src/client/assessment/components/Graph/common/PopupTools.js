import React, { useEffect, useMemo, useRef } from 'react'

import { Popup } from './styled_components'

const PopupTools = ({ children, onHide }) => {
  const popupContRef = useRef()
  const handleClickOut = useMemo(
    () => (e) => {
      if (popupContRef.current && !popupContRef.current.contains(e.target)) {
        onHide(e)
      }
    },
    []
  )

  useEffect(() => {
    document.addEventListener('click', handleClickOut)
    return () => document.removeEventListener('click', handleClickOut)
  }, [])

  return (
    <Popup ref={popupContRef} bottom>
      {children}
    </Popup>
  )
}

export default PopupTools
