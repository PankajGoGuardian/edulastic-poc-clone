import React from 'react'
import { isFunction } from 'lodash'

export const renderChildren = ({ children }) => {
  if (isFunction(children)) {
    return <>{children()}</>
  }

  return <>{children || null}</>
}

export const getConditionResult = (condition) => {
  return Boolean(isFunction(condition) ? condition() : condition)
}
