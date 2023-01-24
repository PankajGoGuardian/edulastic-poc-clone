import React from 'react'
import { filter, map, round, sumBy } from 'lodash'
import PropTypes from 'prop-types'
import { Col, Row, Tooltip } from 'antd'
import { percentage } from '@edulastic/constants/reportUtils/common'
import { CustomStyledCell } from '../common/styled'
import { StyledCard } from '../../../../common/styled'

const PreVsPostMatrix = ({
  matrixData,
  selectedPerformanceBand,
  preTestName,
  postTestName,
  onCellClick,
}) => {
  const totalStudentCount = sumBy(matrixData, (m) =>
    parseInt(m.totalStudentCount, 10)
  )
  const matrixDataWithBandInfo = map(selectedPerformanceBand, (pb) => {
    const prePbData = filter(
      matrixData,
      (m) => parseInt(m.preBandScore, 10) === pb.threshold
    )
    const postPbData = filter(
      matrixData,
      (m) => parseInt(m.postBandScore, 10) === pb.threshold
    )
    return {
      color: pb.color,
      preStudentsPercentange: percentage(
        sumBy(prePbData, (d) => parseInt(d.totalStudentCount, 10)),
        totalStudentCount,
        true
      ),
      postStudentsPercentage: percentage(
        sumBy(postPbData, (d) => parseInt(d.totalStudentCount, 10)),
        totalStudentCount,
        true
      ),
      name: pb.name,
    }
  })
  const cellSpan = parseInt(24 / (selectedPerformanceBand?.length + 3), 10)
  return (
    <StyledCard style={{ margin: '50px 0px' }}>
      <Row>
        <Col span={3 * cellSpan}>
          <CustomStyledCell justify="center" height="100px" font="bold">
            Performance Level
          </CustomStyledCell>
        </Col>
        <Col span={24 - 3 * cellSpan}>
          <Row justify="center">
            <CustomStyledCell justify="center" font={600}>
              Post: {postTestName}
            </CustomStyledCell>
          </Row>
          <Row>
            {map(selectedPerformanceBand, (pb) => (
              <Col span={parseInt(24 / selectedPerformanceBand?.length, 10)}>
                <Tooltip title={pb.name}>
                  <CustomStyledCell justify="center" font={600}>
                    {pb.name}
                  </CustomStyledCell>
                </Tooltip>
              </Col>
            ))}
          </Row>
          <Row>
            {map(matrixDataWithBandInfo, (m) => (
              <Col span={parseInt(24 / selectedPerformanceBand?.length, 10)}>
                <CustomStyledCell
                  justify="center"
                  color={m.color}
                  width="100%"
                  font="bold"
                >
                  {`${m.postStudentsPercentage}% (${
                    m.postStudentsPercentage - m.preStudentsPercentange
                  }%)`}
                </CustomStyledCell>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={cellSpan}>
          <CustomStyledCell
            justify="center"
            height={`${33 * selectedPerformanceBand?.length}px`}
            font={600}
          >
            Pre: {preTestName}
          </CustomStyledCell>
        </Col>
        <Col span={cellSpan}>
          {map(selectedPerformanceBand, (pb) => {
            return (
              <Row>
                <Tooltip title={pb.name}>
                  <CustomStyledCell justify="center" font={600}>
                    {pb.name}
                  </CustomStyledCell>
                </Tooltip>
              </Row>
            )
          })}
        </Col>
        <Col span={cellSpan}>
          {map(matrixDataWithBandInfo, (m) => (
            <Row>
              <CustomStyledCell
                justify="center"
                color={m.color}
                width="100%"
                font="bold"
              >
                {`${m.preStudentsPercentange}%`}
              </CustomStyledCell>
            </Row>
          ))}
        </Col>
        {map(selectedPerformanceBand, (pb) => {
          return (
            <Col
              span={parseInt(
                (24 - 3 * cellSpan) / selectedPerformanceBand?.length,
                10
              )}
            >
              {map(selectedPerformanceBand, (pb1) => {
                const value =
                  filter(
                    matrixData,
                    (m) =>
                      parseInt(m.preBandScore, 10) == pb1.threshold &&
                      parseInt(m.postBandScore, 10) == pb.threshold
                  )[0]?.totalStudentCount || 0
                return (
                  <Row>
                    <CustomStyledCell
                      justify="center"
                      onClick={onCellClick(pb1.threshold, pb.threshold)}
                      style={{ cursor: 'pointer' }}
                    >
                      {`${round(
                        percentage(value, totalStudentCount),
                        2
                      )}% (${value})`}
                    </CustomStyledCell>
                  </Row>
                )
              })}
            </Col>
          )
        })}
      </Row>
    </StyledCard>
  )
}

PreVsPostMatrix.propTypes = {
  matrixData: PropTypes.array.isRequired,
}

export default PreVsPostMatrix
