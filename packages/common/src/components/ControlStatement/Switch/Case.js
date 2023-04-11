import React from 'react'

/**
 * @typedef {import('./Switch').ConditionType} ConditionType
 * @typedef {import('./Switch').ConditionProps} ConditionProps
 */

/**
 * @typedef {{render?: () => React.ReactElement} & ConditionProps} Props
 */

/**
 * @param {React.PropsWithChildren<Props>} props
 */
function Case(props) {
  const { render, children } = props
  const childrenCount = React.Children.count(children)
  const isDev = process.env.NODE_ENV !== 'production'
  if (childrenCount && render && isDev) {
    console.warn(
      'Case must be used with either render(preferred) or children, but not both.'
    )
  }
  if (!render && !childrenCount && isDev) {
    console.warn('Case must have either render(preferred) or children.')
  }
  if (render) {
    return render()
  }
  if (childrenCount) {
    return children
  }
  return null
}

export default Case
