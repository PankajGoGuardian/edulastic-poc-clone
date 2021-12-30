import styled from 'styled-components'
import { TextField, EduButton } from '@edulastic/common'
import { white, title, greyScoreCardTitleColor } from '@edulastic/colors'
import { Select, Row as AntdRow, Col as AntdCol } from 'antd'

export const ColumnLabel = styled.div`
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.smallFontSize};
  font-weight: 600;
  text-align: ${({ align }) => align || 'center'};
  color: ${greyScoreCardTitleColor};
`

export const RowLabel = styled.div`
  font-weight: 600;
  text-transform: ${({ textTransform }) => textTransform || 'uppercase'};
  font-size: ${({ theme }) => theme.smallFontSize};
  display: flex;
  height: ${({ height }) => height || 32}px;
  align-items: center;
  color: ${title};
`

export const FormatedSelect = styled(Select)`
  width: 100%;
`

export const StyledTextField = styled(TextField)`
  padding: 5px 10px;
  width: 100%;
  height: 32px;
  margin-bottom: 0px;
  margin-right: 0px;
`

export const Row = styled(AntdRow)`
  margin-bottom: ${({ noIndent }) => (noIndent ? null : '8px')};
  padding: ${({ noIndent }) => (noIndent ? null : '5px 10px')};
  display: flex;
  align-items: center;
`

export const Col = styled(AntdCol)`
  text-align: ${({ align }) => align || 'center'};
`

export const ColoredRow = styled(Row)`
  background: ${white};
`

export const AddPointBtn = styled(EduButton)`
  margin-top: 16px;
`
