import React from 'react'
import { Row, Col, Tooltip } from 'antd'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import { IconAssignment, IconManage } from '@edulastic/icons'
import { themeColor, white } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'

import {
  Image,
  OverlayText,
  IconWrapper,
  TextDiv,
  SpanLeftMargin,
  RowWrapperGrade,
  StyledRow,
  CircleBtn,
  MetaText,
} from './styled'
import cardImg from '../../../../../../assets/images/cardImg.png'

const CardImage = ({ data, history }) => {
  const { name, grades = [], studentCount, subject, thumbnail, _id } = data

  const gotoManageClass = (classId = '') => () => {
    history.push(`/author/manageClass/${classId}`)
  }

  const applyClassFilter = () => {
    const filter = {
      classId: _id,
      testType: '',
      termId: '',
    }
    sessionStorage.setItem('filters[Assignments]', JSON.stringify(filter))
  }

  const metaInfo = (
    <>
      {(grades || []).length ? (
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
          <SpanLeftMargin data-cy="subject">{subject}</SpanLeftMargin>
        </>
      ) : (
        ''
      )}
    </>
  )

  return (
    <>
      <Image src={thumbnail || cardImg} />
      <OverlayText>
        <Row>
          <Col span={24}>
            <StyledRow>
              <Col span={17}>
                <Tooltip title={name} placement="bottomLeft">
                  <TextDiv data-cy="name">{name}</TextDiv>
                </Tooltip>
              </Col>
              <Col span={6} offset={1}>
                <IconWrapper>
                  <CircleBtn onClick={gotoManageClass(_id)}>
                    <IconManage color={themeColor} width={13} height={13} />
                  </CircleBtn>
                  <Link to="/author/assignments" onClick={applyClassFilter}>
                    <CircleBtn
                      bg={themeColor}
                      style={{ marginLeft: '5px' }}
                      onClick={gotoManageClass(_id)}
                    >
                      <IconAssignment color={white} width={11} height={14} />
                    </CircleBtn>
                  </Link>
                </IconWrapper>
              </Col>
            </StyledRow>
            <RowWrapperGrade>
              <Tooltip title={metaInfo} placement="bottomLeft">
                <MetaText color={white} rfs="12px" size="13px" fw="600">
                  {metaInfo}
                </MetaText>
              </Tooltip>
            </RowWrapperGrade>
            <RowWrapperGrade>
              <TextWrapper
                data-cy="studentCount"
                color={white}
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
