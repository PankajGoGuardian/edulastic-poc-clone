import React from 'react'
import { FieldLabel, FlexContainer } from '@edulastic/common'
import { StyledDropDownContainer } from '../../../../common/styled'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'

/**
 * @type {React.FC<{
 *   dataCy?: string
 *   label: string
 *   labelComponent?: React.ReactElement
 *   containerProps?: React.ComponentPropsWithoutRef<typeof StyledDropDownContainer>
 * } & React.ComponentPropsWithoutRef<typeof ControlDropDown>>}
 */
const LabelledControlDropdown = (props) => {
  const {
    dataCy,
    label,
    labelComponent = label,
    containerProps = {},
    ...controlProps
  } = props
  return (
    <StyledDropDownContainer
      flex="0 0 300px"
      xs={24}
      sm={12}
      lg={6}
      data-cy={dataCy}
      data-testid={dataCy}
      {...containerProps}
    >
      <FieldLabel fs=".7rem">
        <FlexContainer alignItems="center" justifyContent="left">
          {labelComponent}
        </FlexContainer>
      </FieldLabel>
      <ControlDropDown
        prefix={label}
        showPrefixOnSelected={false}
        {...controlProps}
      />
    </StyledDropDownContainer>
  )
}

export default LabelledControlDropdown
