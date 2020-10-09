import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import HTML5Backend from 'react-dnd-html5-backend'

export const DndStateContext = React.createContext()

const initState = { actived: null }

const dndState = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_DRAG_ITEM': {
      return { ...state, actived: action.data }
    }
    case 'REMOVE_ACTIVE_DRAG_ITEM': {
      return { ...state, actived: null }
    }
    default:
      return state
  }
}

function CustomDndProvider({ children }) {
  const [state, setItem] = React.useReducer(dndState, initState)
  const dndBackend = window.isMobileDevice ? TouchBackend : HTML5Backend

  const handleClickOutDroparea = (e) => {
    if (window.$ && window.isMobileDevice) {
      const dropContainers = jQuery('*[data-dnd="edu-droparea"]').toArray()
      const isInContainer = dropContainers.some((container) =>
        container.contains(e.target)
      )

      if (!isInContainer) {
        setItem({ type: 'REMOVE_ACTIVE_DRAG_ITEM' })
      }
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutDroparea)
    return () => document.removeEventListener('click', handleClickOutDroparea)
  }, [])
  return (
    <DndProvider
      backend={dndBackend}
      options={{
        enableTouchEvents: true,
        enableMouseEvents: true,
      }}
    >
      <DndStateContext.Provider value={{ state, setItem }}>
        {children}
      </DndStateContext.Provider>
    </DndProvider>
  )
}

export default CustomDndProvider
