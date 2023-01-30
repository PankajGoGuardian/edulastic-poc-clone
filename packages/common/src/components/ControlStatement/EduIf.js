import { isArray } from 'lodash'
import React, { Fragment } from 'react'
import { EduElse } from './EduElse'
import { EduThen } from './EduThen'
import { getConditionResult, renderChildren } from './helpers'

const SUB_COMPONENTS = [EduThen, EduElse]
const hasThenOrElse = (children) => {
  return children.some((child) => SUB_COMPONENTS.includes(child?.type))
}

/**
 *
 * @example
 * import {EduIf, EduThen, EduElse} from "@edulastic/comon"
 * // usages 1
 * <EduIf condition={value}>
 *     <EduThen>
 *         render contents when condition is true
 *     </EduThen>
 *     <EduElse>
 *        render contents when condition is false
 *     </EduElse>
 * </EduIf>
 *
 * @example
 * <EduIf condition={value}>
 *    rendering contents when the condition is true
 * </Eduif>
 *
 * @example
 * <EduIf>
 *    {
 *      () => <div> reders when condition is true</div>
 *    }
 * </EduIf>
 */
export class EduIf extends React.PureComponent {
  render() {
    const { children, condition } = this.props

    if (!children) {
      return null
    }

    const conditionResult = getConditionResult(condition)
    if (!isArray(children)) {
      return conditionResult ? <>{renderChildren({ children })}</> : null
    }

    if (!hasThenOrElse(children)) {
      return conditionResult ? (
        <>
          {children.map((child, i) => (
            <Fragment key={i}>{renderChildren({ children: child })}</Fragment>
          ))}
        </>
      ) : null
    }

    if (!children.every((child) => SUB_COMPONENTS.includes(child?.type))) {
      console.warn(
        'The <EduIf> component should contain <EduThen /> or <EduElse /> components as its children'
      )
    }

    return (
      <>
        {conditionResult
          ? children.find((c) => c?.type === EduThen)
          : children.find((c) => c?.type === EduElse)}
      </>
    )
  }
}
