import React from 'react'
import { get } from 'lodash'
import { Row, Col } from 'antd'

import { reportUtils } from '@edulastic/constants'

import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import { ColoredCell } from '../../../../../common/styled'
import { getDimensionName } from '../../utils/transformers'

const {
  compareByKeyToNameMap,
  analyseByKeyToNameMap,
  compareByKeys,
  analyseByKeys,
} = reportUtils.standardsGradebook

const StandardColumnCellTitle = ({
  data,
  compareByKey,
  analyseByKey,
  dimensionName,
  standardName,
}) => {
  return (
    <div>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {compareByKeyToNameMap[compareByKey]}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">{dimensionName}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">Standard: </Col>
        <Col className="custom-table-tooltip-value">{standardName}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {analyseByKeyToNameMap[analyseByKey]}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {get(data, analyseByKey) || 'N/A'}
        </Col>
      </Row>
    </div>
  )
}

const StandardColumnCell = ({
  data,
  record,
  t,
  standardId,
  standardName,
  compareByKey,
  analyseByKey,
  handleOnClickStandard,
}) => {
  const { dimension } = record
  const dimensionId = dimension._id
  const dimensionName = getDimensionName(dimension.name, compareByKey, t)
  let onClick = null
  const valueToRender = get(data, analyseByKey)
  if (compareByKey === compareByKeys.STUDENT && valueToRender) {
    onClick = () =>
      handleOnClickStandard({
        standardId,
        standardName,
        studentId: dimensionId,
        studentName: dimensionName,
      })
  }
  const cellColor =
    analyseByKey === analyseByKeys.MASTERY_SCORE ||
    analyseByKey === analyseByKeys.MASTERY_LEVEL
      ? get(data, 'color')
      : ''

  return (
    <CustomTableTooltip
      placement="top"
      title={
        <StandardColumnCellTitle
          data={data}
          compareByKey={compareByKey}
          analyseByKey={analyseByKey}
          dimensionName={dimensionName}
          standardName={standardName}
        />
      }
      getCellContents={() => (
        <ColoredCell bgColor={cellColor} onClick={onClick}>
          {get(data, analyseByKey) || 'N/A'}
        </ColoredCell>
      )}
    />
  )
}
export default StandardColumnCell
