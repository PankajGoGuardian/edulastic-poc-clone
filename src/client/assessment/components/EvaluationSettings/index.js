import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { EduButton, FlexContainer, notification } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'
import CustomDrawer from './components/CustomDrawer'
import CompareOption from './components/CompareOption'
import MathEquivalentOptions from './MathEquivalent'
import LiterallyEquivalent from './LiterallyEquivalent'
import GraphEvaluationSettings from './GraphEvaluationSettings'
import FormatRule from './FormatRule'
import EnabledSettings from './EnabledSettings'
import LabelWithHelper from './components/LabelWithHelper'
import { Container, SettingBody } from './styled'

const { methods, GRAPH_EVALUATION_SETTING } = mathConstants

const hasMutuallyExclusiveOptions = (opts = {}) => {
  let flag = false
  let warningMsg = ''

  if (opts.isExpanded && opts.isFactorised) {
    flag = true
    warningMsg = 'Expanded and Factored cannot be combined together'
  } else if (opts.isMixedFraction && opts.isImproperFraction) {
    flag = true
    warningMsg =
      'Mixed Fraction and Improper fraction cannot be combined together'
  } else if (opts.isParallel && opts.isPerpendicular) {
    flag = true
    warningMsg =
      '"Is parallel" and "Is perpendicular" cannot be combined together'
  }

  return [flag, warningMsg]
}

const EvaluationSettings = ({
  method,
  onChangeMethod,
  changeOptions,
  options,
  extraOptions,
  useTemplate,
  allowNumericOnly,
  allowedVariables,
  onChangeAllowedOptions,
  hidePointOnEquation,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const showSettingDrawer = () => {
    setIsVisible(true)
  }

  const hidSettingDrawer = () => {
    setIsVisible(false)
  }

  const handleChangeOptions = (prop, val) => {
    const newOptions = {
      ...options,
      [prop]: val,
    }
    const [error, errorMsg] = hasMutuallyExclusiveOptions(newOptions)
    if (error) {
      notification({ type: 'warn', msg: errorMsg })
      return false
    }
    changeOptions(prop, val)
  }

  const OptionsComponent = useMemo(() => {
    switch (method) {
      case methods.EQUIV_SYMBOLIC:
        return MathEquivalentOptions
      case methods.EQUIV_LITERAL:
        return LiterallyEquivalent
      case methods.EQUIV_SYNTAX:
        return FormatRule
      case GRAPH_EVALUATION_SETTING:
        return GraphEvaluationSettings
      default:
        return () => <span />
    }
  }, [method])

  const isFromGraph = GRAPH_EVALUATION_SETTING === method

  const optsToRender = {
    ...options,
    ...(extraOptions || {}),
  }

  return (
    <Container>
      <FlexContainer width="fit-content" alignItems="center">
        <LabelWithHelper
          large
          optionKey={
            isFromGraph ? 'graphEvaluationSettings' : 'evaluationSettings'
          }
          label="Evaluation Settings"
        />
        <EduButton height="28px" ml="20px" onClick={showSettingDrawer}>
          Change
        </EduButton>
      </FlexContainer>
      <CustomDrawer visible={isVisible} onClose={hidSettingDrawer}>
        <SettingBody>
          {!isFromGraph && (
            <CompareOption method={method} onChange={onChangeMethod} />
          )}
          <OptionsComponent
            method={method}
            onChangeOption={handleChangeOptions}
            onChangeRadio={onChangeMethod}
            options={optsToRender}
            useTemplate={useTemplate}
            allowNumericOnly={allowNumericOnly}
            allowedVariables={allowedVariables}
            onChangeAllowedOptions={onChangeAllowedOptions}
            hidePointOnEquation={hidePointOnEquation}
          />
        </SettingBody>
      </CustomDrawer>
      <EnabledSettings
        options={optsToRender}
        method={method}
        useTemplate={useTemplate}
        allowNumericOnly={allowNumericOnly}
        allowedVariables={allowedVariables}
      />
    </Container>
  )
}

EvaluationSettings.propTypes = {
  method: PropTypes.string.isRequired,
  onChangeMethod: PropTypes.func,
  changeOptions: PropTypes.func,
}

EvaluationSettings.defaultProps = {
  onChangeMethod: () => null,
  changeOptions: () => null,
}

EvaluationSettings.EnabledSettings = EnabledSettings

export default EvaluationSettings
