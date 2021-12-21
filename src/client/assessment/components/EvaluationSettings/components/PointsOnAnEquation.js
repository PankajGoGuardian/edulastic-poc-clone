import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import {
  FlexContainer,
  CheckboxLabel,
  TextInputStyled,
  MathInput,
  FieldLabel,
  EduButton,
} from '@edulastic/common'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { HeadingLabel } from './InlineCheckOptions'
import LabelWithHelper from './LabelWithHelper'
import { validations } from '../../../utils/inputsValidations'

const PointsOnAnEquation = ({
  t,
  optionKey,
  options,
  onChange,
  hasGraphElements,
}) => {
  const [isAllowed, setIsAllowed] = useState(false)
  const [localLatex, setLocalLatex] = useState('')
  const [showSpecialOpts, setShowSpecialOpts] = useState(false)

  const onChangeCheckbox = (e) => {
    if (e.target.checked && hasGraphElements) {
      Modal.confirm({
        title: 'Warning',
        content: t('component.graphing.pointsOnEquConfirm'),
        zIndex: 1500,
        centered: true,
        okText: 'Confirm',
        onOk() {
          setIsAllowed(e.target.checked)
          onChange('showConnect', true, true)
        },
      })
    } else if (e.target.checked) {
      setIsAllowed(e.target.checked)
      onChange('showConnect', true)
    } else {
      setIsAllowed(e.target.checked)
      onChange('pointsOnAnEquation', null)
    }
  }

  const onChangeInput = (e) => {
    let valid = true
    if (validations[optionKey]) {
      valid = validations[optionKey](e.target.value)
    }
    if (valid) {
      onChange('points', e.target.value)
    }
  }

  const onChangeMath = (latex) => {
    setLocalLatex(latex)
  }

  const handleBlurMath = () => {
    onChange('latex', localLatex)
  }

  const toggleShowSpecialOpts = () => {
    setShowSpecialOpts(!showSpecialOpts)
  }

  useEffect(() => {
    if (options.points || options.latex) {
      setIsAllowed(true)
    }
    setLocalLatex(options.latex)
  }, [options])

  const hasSpecialOpts = optionKey === 'graphPointsOnAnEquation2'

  return (
    <div>
      <HeadingLabel isGraph>
        <LabelWithHelper optionKey={optionKey} />
      </HeadingLabel>
      <FlexContainer
        marginBottom="20px"
        justifyContent="flex-start"
        alignItems="flex-start"
        flexDirection="column"
      >
        <FlexContainer alignItems="center">
          <CheckboxLabel
            data-cy="pointsOnEquation"
            onChange={onChangeCheckbox}
            checked={isAllowed}
            labelPadding="0px 6px 0px 12px"
          >
            <span>student needs to identify</span>
          </CheckboxLabel>
          <TextInputStyled
            data-cy="numberOfPoints"
            size="large"
            width="50px"
            margin="0px 6px 0px 0px"
            padding="0px 4px"
            type="number"
            min={1}
            value={options.points}
            disabled={!isAllowed}
            onChange={onChangeInput}
          />
          <FieldLabel marginBottom="0px" mr="6px">
            unique points on an equation
          </FieldLabel>
          <MathInput
            value={localLatex}
            style={{ width: '140px', marginLeft: '14px' }}
            symbols={['all']}
            maxWidth="140px"
            paddingRight="8px"
            onInput={onChangeMath}
            onBlur={handleBlurMath}
            hideKeypad={false}
            resetMath
            disabled={!isAllowed}
            showResponse={false}
          />
        </FlexContainer>
      </FlexContainer>
      {hasSpecialOpts && (
        <SpecialOptContainer>
          <EduButton
            isGhost
            ml="0px"
            height="28px"
            onClick={toggleShowSpecialOpts}
            data-cy="pointsOnAnEquationSpecial"
          >
            {showSpecialOpts ? 'Hide Special Options' : 'Show Special Options'}
          </EduButton>
          {showSpecialOpts && (
            <SpecialOpts>
              <FieldLabel mr="6px">points on an equation</FieldLabel>
              <SpecialOptRow>
                <FieldLabel marginBottom="0px">Axis crossing X Axis</FieldLabel>
                <TextInputStyled type="number" />
                <FieldLabel marginBottom="0px">Y Axis</FieldLabel>
                <TextInputStyled type="number" />
              </SpecialOptRow>
              <SpecialOptRow>
                <FieldLabel marginBottom="0px">Global Minima</FieldLabel>
                <TextInputStyled type="number" />
                <FieldLabel marginBottom="0px">Max</FieldLabel>
                <TextInputStyled type="number" />
              </SpecialOptRow>
              <SpecialOptRow>
                <FieldLabel marginBottom="0px">Local Minima</FieldLabel>
                <TextInputStyled type="number" />
                <FieldLabel marginBottom="0px">Max</FieldLabel>
                <TextInputStyled type="number" />
              </SpecialOptRow>
              <SpecialOptRow>
                <FieldLabel marginBottom="0px">
                  Symmetric Points About X
                </FieldLabel>
                <TextInputStyled type="number" />
                <FieldLabel marginBottom="0px">Y Axis</FieldLabel>
                <TextInputStyled type="number" />
              </SpecialOptRow>
            </SpecialOpts>
          )}
        </SpecialOptContainer>
      )}
    </div>
  )
}

export default withNamespaces('assessment')(PointsOnAnEquation)

const SpecialOptContainer = styled.div`
  margin-top: 32px;
`

const SpecialOpts = styled.div`
  margin-top: 28px;
  display: grid;
  grid-gap: 12px;
`

const SpecialOptRow = styled.div`
  display: grid;
  grid-gap: 12px;
  align-items: center;
  grid-template-columns: 160px 120px 40px 120px;
`
