import styled from 'styled-components'
import { Radio, Input, Col } from 'antd'
import { title } from '@edulastic/colors'
import { StyledTable as Table } from '../../../../common/styled'
import { ThemeButton } from '../../../src/components/common/ThemeButton'

const RadioGroup = Radio.Group

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  th {
    border: none !important;
  }

  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`

export const StyledTable = styled(Table)`
  .ant-table-row {
    &: hover {
      a {
        opacity: 100;
      }
    }
  }
`

export const TopDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px 15px;
`

export const InfoDiv = styled.div`
  display: column;
`

export const StyledH3 = styled.h3`
  font-size: 16px;
  color: ${title};
  margin-bottom: 0px;
`

export const StyledDescription = styled.p``

export const StyledButton = styled.a`
  opacity: 0;
  margin-right: 20px;
  font-size: 20px;
`

export const SaveButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const SaveAlert = styled.p`
  color: #f9ac59;
  text-align: right;
  margin-right: 20px;
  line-height: 32px;
`

export const StyledAddButton = styled(ThemeButton)`
  height: 34px;
  font-size: 12px;
`

export const StyledMasterDiv = styled.div`
  padding: 25px 15px 15px;
`

export const StyledUl = styled.ul`
  padding-left: 24px;
`

export const StyledRadioGroup = styled(RadioGroup)`
  padding: 20px 0px;
  width: 100%;
  .ant-radio + span {
    font-size: 12px;
  }
`

export const InputOption = styled.div`
  margin-top: ${({ margin }) => margin || '0px'};
`

export const RadioWrap = styled(Col)`
  padding-bottom: 20px;
`

export const StyledAverageRadioDiv = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
`

export const StyledLabel = styled.label`
  margin-right: 5px;
  font-size: 12px;
`

export const StyledAverageInput = styled(Input)`
  width: 80px;
  min-width: 80px;
  margin-top: -3px;
`

export const StyledScoreDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 12px;

  .anticon-down {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
    margin-left: 5px;
    margin-right: 4px;
  }
`
