import React from 'react'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { NumberInputStyled, CheckboxLabel } from '@edulastic/common'
import { Label } from '../../../styled/WidgetOptions/Label'

const MaxResponses = ({
  t,
  max,
  min,
  value,
  onChangeOption,
  multipleResponses,
}) => {
  const handleChangeValue = (val) => {
    onChangeOption('maxResponses', val || max)
  }

  const handleCheckbox = () => {
    onChangeOption('multipleResponses', !multipleResponses)
  }

  return (
    <>
      {/* checkbox should be hideden for True or False */}
      <CheckboxLabel
        data-cy="multi"
        onChange={handleCheckbox}
        checked={multipleResponses}
      >
        {t('component.multiplechoice.multipleResponses')}
      </CheckboxLabel>
      {multipleResponses && (
        <Container>
          <NumberInputStyled
            onChange={handleChangeValue}
            value={value || max}
            min={min}
            max={max}
            width={60}
          />
          <Label mt="auto" ml="5px">
            {t('component.multiplechoice.maxResponses')}
          </Label>
        </Container>
      )}
    </>
  )
}

export default withNamespaces('assessment')(MaxResponses)

const Container = styled.div`
  display: flex;
`
