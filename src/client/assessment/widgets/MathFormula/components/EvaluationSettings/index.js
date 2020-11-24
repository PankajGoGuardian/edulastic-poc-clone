import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { EduButton, FlexContainer } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'
import CustomDrawer from './components/CustomDrawer'
import CompareOption from './components/CompareOption'
import MathEquivalentOptions from './MathEquivalent'
import LiterallyEquivalent from './LiterallyEquivalent'
import FormatRule from './FormatRule'
import EnabledSettings from './EnabledSettings'
import LabelWithHelper from './components/LabelWithHelper'
import { Container, SettingBody } from './styled'

const { methods } = mathConstants

const EvaluationSettings = ({
  method,
  onChangeMethod,
  changeOptions,
  options,
  useTemplate,
  allowNumericOnly,
  allowedVariables,
  onChangeAllowedOptions,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const showSettingDrawer = () => {
    setIsVisible(true)
  }

  const hidSettingDrawer = () => {
    setIsVisible(false)
  }

  const OptionsComponent = useMemo(() => {
    switch (method) {
      case methods.EQUIV_SYMBOLIC:
        return MathEquivalentOptions
      case methods.EQUIV_LITERAL:
        return LiterallyEquivalent
      case methods.EQUIV_SYNTAX:
        return FormatRule
      default:
        return () => <span />
    }
  }, [method])

  return (
    <Container>
      <FlexContainer width="fit-content" alignItems="center">
        <LabelWithHelper
          large
          optionKey="evaluationSettings"
          label="Evaluation Settings"
        />
        <EduButton height="28px" ml="20px" onClick={showSettingDrawer}>
          Change
        </EduButton>
      </FlexContainer>
      <CustomDrawer visible={isVisible} onClose={hidSettingDrawer}>
        <SettingBody>
          <CompareOption method={method} onChange={onChangeMethod} />
          <OptionsComponent
            method={method}
            onChangeOption={changeOptions}
            onChange={onChangeMethod}
            options={options}
            useTemplate={useTemplate}
            allowNumericOnly={allowNumericOnly}
            allowedVariables={allowedVariables}
            onChangeAllowedOptions={onChangeAllowedOptions}
          />
        </SettingBody>
      </CustomDrawer>
      <EnabledSettings
        options={options}
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

export default EvaluationSettings
