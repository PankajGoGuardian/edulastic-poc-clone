import React from 'react'
import { Row, Col, Tooltip } from 'antd'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { IconArrowRight } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'

import {
  Image,
  OverlayText,
  IconWrapper,
  TextDiv,
  SpanLeftMargin,
  RowWrapperGrade,
  StyledRow,
} from './styled'
import cardImg from '../../../../../../assets/images/cardImg.png'

const CardImage = ({ data, history }) => {
  const { name, grades = [], studentCount, subject, thumbnail, _id } = data

  const gotoManageClass = (classId = '') => () => {
    history.push(`/author/manageClass/${classId}`)
  }

  return (
    <>
      <Image src={thumbnail || cardImg} />
      <OverlayText>
        <Row>
          <Col span={24}>
            <StyledRow>
              <Tooltip title={name} placement="bottomLeft">
                <TextDiv data-cy="name">{name}</TextDiv>
              </Tooltip>
              <IconWrapper onClick={gotoManageClass(_id)}>
                <IconArrowRight color={themeColor} width={15} height={15} />
              </IconWrapper>
            </StyledRow>
            <RowWrapperGrade>
              <TextWrapper
                color="#FFFFFF"
                rfs="12px"
                size="13px"
                fw="600"
                minTwo
              >
                {grades.length ? (
                  <>
                    <span data-cy="grades">Grades</span>{' '}
                    {grades.join(', ').replace(/O/i, ' Other ')}
                  </>
                ) : (
                  ''
                )}

                {subject ? (
                  <>
                    {grades.length ? <SpanLeftMargin>|</SpanLeftMargin> : ''}
                    <Tooltip title={subject} placement="bottomLeft">
                      <SpanLeftMargin data-cy="subject">
                        {subject}
                      </SpanLeftMargin>
                    </Tooltip>
                  </>
                ) : (
                  ''
                )}
              </TextWrapper>
            </RowWrapperGrade>
            <RowWrapperGrade>
              <TextWrapper
                data-cy="studentCount"
                color="#FFFFFF"
                rfs="11px"
                size="12px"
                fw="600"
              >
                {studentCount || 0} {studentCount > 1 ? 'Students' : 'Student'}
              </TextWrapper>
            </RowWrapperGrade>
          </Col>
        </Row>
      </OverlayText>
    </>
  )
}

const enhance = compose(withRouter)
export default enhance(CardImage)
