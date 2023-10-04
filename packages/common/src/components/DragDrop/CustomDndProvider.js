import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import HTML5Backend from 'react-dnd-html5-backend'
import KeyboardBackend, {
  isKeyboardDragTrigger,
} from 'react-dnd-accessible-backend'
import {
  createTransition,
  MouseTransition,
  TouchTransition,
  MultiBackend,
} from 'react-dnd-multi-backend'

export const DndStateContext = React.createContext()

const initState = {
  actived: null,
  previewDimensions: [],
}

const dndState = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_DRAG_ITEM': {
      return { ...state, actived: action.data }
    }
    case 'REMOVE_ACTIVE_DRAG_ITEM': {
      return { ...state, actived: null, previewDimensions: [] }
    }
    case 'SET_DROP_AREA_SIZE': {
      return {
        ...state,
        previewDimensions: [...state.previewDimensions, action.data],
      }
    }
    default:
      return state
  }
}

const KeyboardTransition = createTransition('keydown', (event) => {
  if (!isKeyboardDragTrigger(event)) return false
  event.preventDefault()
  return true
})

function CustomDndProvider({ children }) {
  const [state, setItem] = React.useReducer(dndState, initState)
  // const dndBackend = window.isMobileDevice ? TouchBackend : HTML5Backend

  const DND_OPTIONS = {
    backends: [
      {
        id: 'html5',
        backend: HTML5Backend,
        transition: MouseTransition,
      },
      {
        id: 'keyboard',
        backend: KeyboardBackend,
        context: { window, document },
        preview: true,
        transition: KeyboardTransition,
      },
    ],
  }
  if (window.isMobileDevice) {
    DND_OPTIONS.backends.push({
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    })
  }

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
      backend={MultiBackend}
      options={{
        enableTouchEvents: true,
        enableMouseEvents: true,
        ...DND_OPTIONS,
      }}
    >
      <DndStateContext.Provider value={{ state, setItem }}>
        {children}
      </DndStateContext.Provider>
    </DndProvider>
  )
}

export default CustomDndProvider
