import { themeColor } from '@edulastic/colors'
import { CheckboxLabel, SelectInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { performanceBandSelector } from '../../../../../AssignTest/duck'
import { StyledTable, Title } from './styled'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'

const PerformanceBands = ({
  performanceBandsData,
  setSettingsData,
  performanceBand = {},
  disabled = false,
  isFeatureAvailable = false,
  fromAssignments = false,
}) => {
  const handleProfileChange = (val) => {
    const selectedBandsData = performanceBandsData.find((o) => o._id === val)
    setSettingsData({
      _id: selectedBandsData._id,
      name: selectedBandsData.name,
    })
  }

  const selectedBandsData = performanceBandsData.find(
    (o) => o._id === performanceBand._id
  ) ||
    performanceBandsData[0] || { performanceBand: [] }
  const performanceBands = selectedBandsData.performanceBand

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      className: 'name',
      align: 'left',
      render: (text, record) => (
        <NameColumn>
          <StyledBox color={record.color} />{' '}
          <StyleTextWrapper>{text}</StyleTextWrapper>
        </NameColumn>
      ),
    },
    {
      title: 'ABOVE OR AT STANDARD',
      dataIndex: 'aboveOrAtStandard',
      width: '25%',
      key: 'aboveOrAtStandard',
      render: (value) => <CheckboxLabel disabled checked={value} />,
    },
    {
      title: 'FROM',
      dataIndex: 'from',
      width: '25%',
      key: 'from',
      render: (text) => <span>{`${text}%`}</span>,
    },
    {
      title: 'TO',
      width: '25%',
      key: 'to',
      dataIndex: 'to',
      render: (text) => <span>{`${text}%`}</span>,
    },
  ]
  return (
    <>
      <Title
        data-cy="performance-band"
        style={{ justifyContent: 'space-between', marginBottom: '10px' }}
      >
        <span>
          Performance Bands
          {!fromAssignments && (
            <DollarPremiumSymbol premium={isFeatureAvailable} />
          )}
        </span>
        <SelectInputStyled
          style={{ width: '250px' }}
          value={selectedBandsData._id}
          onChange={(val) => handleProfileChange(val)}
          disabled={disabled}
        >
          {performanceBandsData.map((bandsData) => (
            <Select.Option key={bandsData._id} value={bandsData._id}>
              {bandsData.name}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </Title>
      {performanceBands && !!performanceBands.length && (
        <StyledTable
          dataSource={performanceBands}
          columns={columns}
          pagination={false}
        />
      )}
    </>
  )
}

export default connect(
  (state) => ({
    performanceBandsData: performanceBandSelector(state),
  }),
  null
)(PerformanceBands)

const NameColumn = styled.div`
  display: flex;
`

const StyledBox = styled.span`
  width: 20px;
  height: 20px;
  background: ${(props) => props.color};
  border: 1px solid ${themeColor};
`
const StyleTextWrapper = styled.span`
  margin-left: 10px;
`
