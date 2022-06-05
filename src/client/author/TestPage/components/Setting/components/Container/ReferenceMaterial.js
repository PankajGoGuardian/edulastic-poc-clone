import React from 'react'
import { EduSwitchStyled } from '@edulastic/common'
import { SettingContainer } from '../../../../../AssignTest/components/Container/styled'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import { withRefMaterial } from '../../../../../Shared/HOC/withRefMaterial'
import { Body, Description, Title } from './styled'

const ReferenceMaterial = ({
  owner,
  premium,
  disabled,
  isEditable,
  isSmallSize,
  children,
  enableUpload,
  onChangeSwitch,
}) => {
  return (
    <SettingContainer>
      <Title>
        <span>
          Reference Material <DollarPremiumSymbol premium={premium} />
        </span>
        <EduSwitchStyled
          checked={enableUpload}
          disabled={!owner || !isEditable || !premium || disabled}
          data-cy="assignment-referenceDocAttributes-switch"
          onChange={onChangeSwitch}
        />
      </Title>
      <Body smallSize={isSmallSize} padding="10px 0px 0px">
        <Description>
          Upload Reference materials like formula sheet, periodic table,
          constant value sheets etc to help students in solving the questions.
        </Description>
      </Body>
      {children}
    </SettingContainer>
  )
}

export default withRefMaterial(ReferenceMaterial)
