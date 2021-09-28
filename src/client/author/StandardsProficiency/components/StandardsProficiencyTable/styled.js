import styled from 'styled-components'
import { Input } from 'antd'
import { lightGrey9, title } from '@edulastic/colors'
import { StyledTable } from '../../../../common/styled'
import { ThemeButton } from '../../../src/components/common/ThemeButton'

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 20px;
`

export const BandStyledTable = styled(StyledTable)`
  .ant-table-row {
    &: hover {
      a {
        opacity: 100;
      }
    }
  }
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

export const TopDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const InfoDiv = styled.div`
  display: column;
`

export const StyledH3 = styled.h3`
  font-size: 15px;
  color: ${title};
  font-weight: bold;
  margin-bottom: 0px;
`

export const StyledDescription = styled.p`
  font-size: 12px;
  color: ${lightGrey9};
`

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
  padding: 25px 0px 15px;
`

export const StyledUl = styled.ul`
  padding-left: 17px;
  margin-top: 10px;
  li {
    padding-top: 2px;
    font-size: 12px;
    color: ${lightGrey9};
  }
`

export const InputOption = styled.div`
  margin-top: ${({ margin }) => margin || '0px'};
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
