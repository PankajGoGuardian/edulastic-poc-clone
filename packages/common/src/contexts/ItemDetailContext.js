import React from 'react'

export const DEFAULT = 'default'
export const COMPACT = 'compact'

const ItemDetailContext = React.createContext({
  layoutType: DEFAULT,
})

export default ItemDetailContext
