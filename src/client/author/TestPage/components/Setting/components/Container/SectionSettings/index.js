import React from 'react'

import { Col, Row, Tabs } from 'antd'

import { EduSwitchStyled } from '@edulastic/common'
import { SettingContainer } from '../../../../../../AssignTest/components/Container/styled'
import CalculatorSettings from '../../../../../../Shared/Components/CalculatorSettings'
import DollarPremiumSymbol from '../../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import { Title, Block, Body, Description } from '../styled'

const { TabPane } = Tabs

const ShowSectionSettings = ({
  itemGroups,
  premium,
  disabled,
  isSmallSize,
  preventSectionNavigation,
  updateSectionCalc,
  updateTestData,
}) => {
  const sectionTabs = itemGroups.map((g) => {
    const id = g._id
    const values = g?.settings?.calcTypes || []
    return {
      key: id,
      label: `${g.groupName || ''}`,
      children: (
        <SettingContainer>
          <Title>
            Show Calculator <DollarPremiumSymbol premium={premium} />
          </Title>
          <Body smallSize={isSmallSize}>
            <Row>
              <Col span={8}>
                <CalculatorSettings
                  isCheckBoxGroup
                  disabled={disabled}
                  value={values}
                  onChange={updateSectionCalc('calcTypes', id)}
                />
              </Col>
            </Row>
          </Body>
        </SettingContainer>
      ),
    }
  })

  return (
    <>
      <Block id="disable-section-navigation" smallSize={isSmallSize}>
        <SettingContainer>
          <Title>
            <span>PREVENT NAVIGATION TO SUBMITTED SECTIONS</span>
            <EduSwitchStyled
              data-cy="disable-section-navigation"
              checked={preventSectionNavigation}
              disabled={disabled}
              onChange={() =>
                updateTestData('preventSectionNavigation')(
                  !preventSectionNavigation
                )
              }
            />
          </Title>
          <Body smallSize={isSmallSize}>
            <Description>
              Test can be attempted in a sequential manner. Within a section,
              you can to navigate between questions using the
              &apos;previous&apos; and &apos;next&apos; options. Once a section
              is submitted, returning to it is not allowed.
            </Description>
          </Body>
        </SettingContainer>
      </Block>

      {sectionTabs && (
        <Block id="section-settings" smallSize={isSmallSize}>
          <Tabs>
            {sectionTabs.map((item) => (
              <TabPane tab={item.label} key={item.key}>
                {item.children}
              </TabPane>
            ))}
          </Tabs>
        </Block>
      )}
    </>
  )
}

export default ShowSectionSettings
