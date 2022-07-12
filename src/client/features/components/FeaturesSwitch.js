import React from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect } from 'react-router-dom'
import { isDOMElement } from '@edulastic/common'
import { getSanitizedProps } from '@edulastic/common/src/helpers'
import { getUserFeatures } from '../../student/Login/ducks'
import { getGroupList } from '../../author/src/selectors/user'
import { isFeatureAccessibleToUser as isFeatureAccessible } from '../featuresUtils'

/**
 *
 * @param {{features: {[feature:string]:boolean|Object[]} & {premiumGradeSubject:Object[]}, inputFeatures: string[] | string, operation: "AND" | "OR", gradeSubject: {grade: string[], subject: string[]}, children: JSX.Element, actionOnInaccessible: "disabled"|"hidden", redirectRoute: string}} props
 *
 * gradeSubject is optional, if omitted only features will be taken into account
 *
 * features is optional, if omitted only gradeSubject will be taken into account
 *
 */
export const FeaturesSwitch = (props) => {
  let { children, style } = props
  const { actionOnInaccessible = 'hidden', redirectRoute = '' } = props

  const isAccessible = isFeatureAccessible({
    ...props,
  })
  style = typeof style === 'function' ? style(isAccessible) : style
  children =
    typeof children === 'function' ? children({ isAccessible }) : children
  const redirect = (
    <Switch>
      <Redirect exact to={redirectRoute} />
    </Switch>
  )

  const blacklistedPropsDOMElements = ['features', 'groupList']

  const _children = React.Children.map(children, (child) => {
    const featureSwitchProps = isDOMElement(child)
      ? getSanitizedProps(props, blacklistedPropsDOMElements)
      : { ...props }
    return React.cloneElement(child, {
      ...featureSwitchProps,
      ...child.props,
      children: child.props.children,
      actionOnInaccessible,
      isAccessible,
    })
  })

  // TODO: Remove once BE is fixed
  if (isAccessible || actionOnInaccessible === 'disabled') return _children
  if (actionOnInaccessible === 'redirect') return redirect
  if (typeof actionOnInaccessible === 'function')
    return (
      <div style={style} onClick={actionOnInaccessible}>
        {_children}
      </div>
    )
  return null
}
export { isFeatureAccessible }
export default connect((state) => ({
  features: getUserFeatures(state),
  groupList: getGroupList(state),
  // @ts-ignore
}))(FeaturesSwitch)
