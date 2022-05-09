import React from 'react'
import { Col, Row } from 'antd'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'
import { AlignSwitchRight, Label, StyledRow } from '../SimpleOptions/styled'
import { withRefMaterial } from '../../../Shared/HOC/withRefMaterial'

const RefMaterialFile = ({
  premium,
  tootltipWidth,
  hasAttributesInTest,
  children,
  disabled,
  enableUpload,
  onChangeSwitch,
}) => {
  return (
    <SettingContainer id="reference-material">
      <DetailsTooltip
        width={tootltipWidth}
        title="Reference Material"
        content="Upload Reference materials like formula sheet, periodic table, constant value sheets etc to help students in solving the questions."
        premium={premium}
      />
      <StyledRow gutter={16} mb="15px">
        <Col span={10}>
          <Label>
            Reference Material
            <DollarPremiumSymbol premium={premium} />
          </Label>
        </Col>
        <Col span={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <AlignSwitchRight
              data-cy="reference-material-switch"
              size="small"
              disabled={!hasAttributesInTest || disabled || !premium}
              defaultChecked={false}
              checked={enableUpload}
              onChange={onChangeSwitch}
            />
          </Row>
          {children}
        </Col>
      </StyledRow>
    </SettingContainer>
  )
}

export default withRefMaterial(RefMaterialFile)
