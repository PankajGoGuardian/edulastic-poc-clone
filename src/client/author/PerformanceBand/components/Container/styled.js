import styled from 'styled-components'
import { Input, List, Col, Row } from 'antd'
import {
  themeColor,
  white,
  lightGreySecondary,
  sectionBorder,
  lightGrey3,
  title,
} from '@edulastic/colors'

export const ModalInput = styled(Input)`
  background: ${lightGreySecondary};
  border-color: ${sectionBorder};
  border-radius: 2px;
  height: 40px;
  margin-top: 10px;
`

export const ListItemStyled = styled(List.Item)`
  display: block;
  background-color: #fff;
  border: 0;
  padding: 0;
`

export const RowStyled = styled(Row)`
  background: ${white};
`

export const StyledProfileRow = styled(Row)`
  display: block;
  padding: 0px 20px;
  background-color: ${lightGrey3};
  margin-bottom: 7px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 4px;
  h3 {
    font-weight: bold;
    font-size: 12px;
    color: ${title};
    margin: 0px;
  }
  input {
    font-weight: 500;
    font-size: 15px;
    margin: 0px;
  }
`

export const StyledProfileCol = styled(Col)`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-content: center;
  & > i.anticon {
    color: ${themeColor};
    height: 15px;
    width: 15px;
    margin-left: 20px;
  }
`

export const StyledList = styled(List)`
  margin-top: 10px;
  .ant-list-item {
    border: 0;
  }
`
