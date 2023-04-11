import React from 'react'

// TODO explore creating babel plugin to replace these components with conditional (c?x:y) operators
const isDev = process.env.NODE_ENV !== 'production'
const evaluateCondition = (condition) => {
  if (typeof condition === 'function') return condition()
  return !!condition
}

const getMatchedCase = (children) => {
  let [defaultMatch, match] = [null, null]

  React.Children.forEach(children, (child) => {
    if (match !== null) {
      if (
        isDev &&
        React.isValidElement(child) &&
        evaluateCondition(child.props.$condition)
      ) {
        console.warn('More than one matching cases exist. Prefering only first')
      }
      return
    }

    if (defaultMatch !== null) {
      if (
        isDev &&
        React.isValidElement(child) &&
        evaluateCondition(child.props.$default)
      ) {
        console.warn('More than one $default cases exist. Prefering only first')
      }
    }

    if (React.isValidElement(child)) {
      // console.log(child);
      if (evaluateCondition(child.props.$condition)) {
        match = child
      }
      if (defaultMatch === null && evaluateCondition(child.props.$default)) {
        defaultMatch = child
      }
    } else {
      // TODO ignore? ref: https://github.com/remix-run/react-router/blob/v5/packages/react-router/modules/Switch.js
    }
  })

  match = match || defaultMatch

  if (!match) {
    if (isDev) {
      console.warn(
        'Switch must have atleast one matching case/$condition or $default'
      )
    }
    return null
  }
  const { $condition, $default, ...matchProps } = match.props
  return React.cloneElement(match, matchProps)
}

/**
 * @typedef {boolean | () => boolean} ConditionType
 * @typedef {{$condition: ConditionType} | {$default: ConditionType}} ConditionProps
 */

/**
 *
 * @param {import('react').PropsWithChildren<ConditionProps>} props
 *
 * @example
 * import { Switch } from '@edulastic/common'
 * const { Case } = Switch
 *
 * <Switch>
 *   <MyComponent
 *    $condition={isMyComponentVisible} // `$condition` or `$default` directly on component
 *    />
 *
 *   <Case
 *    $condition={isFooVisible} // use `Case` with element(s) as children
 *   >
 *     <Foo />
 *   </Case>
 *
 *   <Case
 *    $condition={isBarVisible} // use `Case` with `render` prop (Preferred)
 *    render={() => <Bar />}
 *   />
 *
 *   <NoDataFound $default /> // `$default` can be used similarly with Case also
 * </Switch>
 */
function Switch(props) {
  return getMatchedCase(props.children)
}

export default Switch
