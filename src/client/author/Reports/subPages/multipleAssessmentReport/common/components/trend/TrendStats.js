import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'

import { EduButton } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'

import { StyledCard, StyledH3 } from '../../../../../common/styled'
import TrendCard from './TrendCard'
import { trendTypes } from '../../utils/constants'
import FeaturesSwitch from '../../../../../../../features/components/FeaturesSwitch'

const TrendStats = ({
  trendCount,
  onTrendSelect,
  selectedTrend,
  renderFilters,
  heading,
  handleAddToGroupClick,
  isSharedReport,
  showTrendStats = true,
}) => {
  const trends = Object.keys(trendTypes)

  return (
    <UpperContainer>
      <Row type="flex" gutter={[5, 10]} justify="start">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          {showTrendStats && (
            <>
              <StyledH3 fontSize="16px" margin="0">
                {heading}
              </StyledH3>
            </>
          )}
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Row type="flex" gutter={[5, 10]} justify="end">
            {!!handleAddToGroupClick && !isSharedReport && (
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <FeaturesSwitch
                  inputFeatures="studentGroups"
                  actionOnInaccessible="hidden"
                >
                  <EduButton
                    style={{
                      float: 'right',
                      height: '32px',
                      padding: '0 15px 0 10px',
                      borderRadius: '2px',
                    }}
                    onClick={handleAddToGroupClick}
                  >
                    <IconPlusCircle /> Add To Student Group
                  </EduButton>
                </FeaturesSwitch>
              </Col>
            )}
            {renderFilters()}
          </Row>
        </Col>
      </Row>
      {showTrendStats && (
        <TrendContainer>
          {trends.map((trend) => (
            <Col span={8}>
              <PaddedContainer>
                <TrendCard
                  type={trend}
                  count={trendCount[trend]}
                  onClick={() => onTrendSelect(trend)}
                  isSelected={selectedTrend ? selectedTrend === trend : true}
                />
              </PaddedContainer>
            </Col>
          ))}
        </TrendContainer>
      )}
    </UpperContainer>
  )
}

TrendStats.propTypes = {
  onTrendSelect: PropTypes.func,
  selectedTrend: PropTypes.string,
  renderFilters: PropTypes.func,
  heading: PropTypes.string,
  trendCount: PropTypes.shape({
    up: PropTypes.number,
    flat: PropTypes.number,
    down: PropTypes.number,
  }),
}

TrendStats.defaultProps = {
  trendCount: {
    up: 0,
    flat: 0,
    down: 0,
  },
  selectedTrend: '',
  onTrendSelect: () => {},
  renderFilters: () => null,
  heading: '',
}

export default TrendStats

const UpperContainer = styled(StyledCard)`
  .ant-card-body {
    padding: 0px 0px 18px;
  }
`
const PaddedContainer = styled.div`
  padding: 0px 18px;
  padding-left: ${(props) => props.paddingLeft};
`

const TrendContainer = styled(Row)`
  margin-top: 15px;
  padding-top: 5px;
`
