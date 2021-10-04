import React from 'react'

const ScrollContext = React.createContext({
  getScrollElement: () => document.body,
})

export default ScrollContext
