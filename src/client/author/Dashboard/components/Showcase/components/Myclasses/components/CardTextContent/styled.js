import styled, { css } from 'styled-components'
import { Row, Col } from 'antd'

export const LeftCol = styled(Col)`
  width: ${({ width }) => width || '45px'};
  margin-right: 12px;
`

export const CenterCol = styled(Col)`
  width: calc(100% - 60px);
  display: flex;
  flex-direction: column;
`

export const Label = styled.label`
  color: #aaafb5;
  font-size: 12px;
  width: 100%;
  margin-bottom: 3px;
  text-transform: uppercase;
  font-weight: bold;
`

export const RowWrapper1 = styled(Row)`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 44px;
`

export const CardText = styled.div`
  padding: 10px 12px;
`
export const Image = styled.img`
  width: 44px;
  height: 32px;
  border-radius: 5px;
  margin: 5px;
`

const SharedTextStyle = css`
  font-weight: 600;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const AssignmentStatusText = styled.p`
  padding: 2px 0px 0px !important;
  font-weight: 300;
  font-size: 10px;
  line-height: 16px;
  color: #636363;
  ${SharedTextStyle}
`
export const AssignmentTitle = styled.p`
  font-weight: 800;
  font-size: 14px;
  line-height: 19px;
  color: #636363;
  padding: 0px !important;
  ${SharedTextStyle}
`
