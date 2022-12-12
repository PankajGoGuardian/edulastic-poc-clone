import styled from 'styled-components'
import { Input, Row, Icon, Col, Button, Modal } from 'antd'
import {
  themeColor,
  lightGrey3,
  white,
  boxShadowDefault,
  lightGrey4,
  fadedBlack,
  black,
} from '@edulastic/colors'

const { TextArea } = Input
const Search = Input.Search

export const StyledSearch = styled(Search)`
  width: 100;
  margin-top: 1rem;
  margin-bottom: 1rem;
  .ant-btn-primary {
    color: ${white};
    background: ${themeColor};
    border-color: transparent;
  }
`

/** @type {typeof TextArea} */
export const StyledTextArea = styled(TextArea)`
  margin-top: 10px;
  min-height: 120px !important;
  background-color: ${lightGrey3};
  border-radius: 5px;
  &:focus::placeholder {
    color: transparent;
  }
`

export const PlaceHolderText = styled.p`
  color: #bfbfbf;
  position: absolute;
  margin-top: 22px;
  margin-left: 14px;
  font-size: 14px;
  line-height: 21px;
  pointer-events: none;
  user-select: none;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  z-index: 1;
`

export const SelUserKindDiv = styled(Row)`
  font-weight: 550;
  margin-top: 20px;
  display: flex;
  align-items: center;
`
export const ItemDiv = styled.div`
  padding: 0.5rem;
  border-radius: 4px;
  color: black;
  text-align: center;
  margin: 0.2rem;
  border: 1px solid lightgrey;
`

export const Text = styled.h3`
  font-size: 14px;
  color: darkgray;
  font-weight: 600;
  font-family: 'Open Sans';
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemText = styled(Text)`
  color: ${black};
`

export const IconWrapper = styled(Icon)`
  color: green;
  font-size: 20px;
`

export const ColWrapper = styled(Col)`
  border: 0.3px solid lightgrey;
  text-align: center;
  height: 200px;
`

export const ActionButton = styled(Button)`
  background: ${themeColor};
  border-color: ${themeColor};
  &:hover,
  &:focus {
    background: ${themeColor};
    border-color: ${themeColor};
  }
`

export const StyledModal = styled(Modal)`
  min-width: 600px;
  padding: 0px;
  .ant-modal-body {
    background: ${lightGrey3};
    box-shadow: ${boxShadowDefault};
    border-radius: 5px;
  }
`

export const ModalCloseIconWrapper = styled(Col)`
  padding: 0.5rem 1.2rem;
  cursor: pointer;
`
export const SearchViewContainer = styled.div`
  background: ${white};
  padding: 2rem;
  text-align: start;
  min-height: 200px;
  font-weight: 550;
`

export const AddBulkStudentsViewContainer = styled.div`
  background: ${white};
  padding: 1.5rem 0rem 0rem;
`

export const SearchTabButton = styled(Button)`
  width: 100%;
  border-radius: 2px;
  border: none;
  height: 40px;
  text-transform: uppercase;
  font-weight: 550;
  background: ${(props) => (props.searchViewVisible ? themeColor : lightGrey4)};
  color: ${(props) => (props.searchViewVisible ? white : fadedBlack)};

  &:hover,
  &:focus,
  &:active {
    background: ${(props) =>
      props.searchViewVisible ? themeColor : lightGrey4};
    color: ${(props) => (props.searchViewVisible ? white : fadedBlack)};
  }
`

export const AddMultipleStudentsTabButton = styled(SearchTabButton)`
  background: ${(props) => (props.searchViewVisible ? lightGrey4 : themeColor)};
  color: ${(props) => (props.searchViewVisible ? fadedBlack : white)};
  &:hover,
  &:focus,
  &:active {
    background: ${(props) =>
      props.searchViewVisible ? lightGrey4 : themeColor};
    color: ${(props) => (props.searchViewVisible ? fadedBlack : white)};
  }
`

export const ButtonsContainer = styled(Row)`
  display: flex;
  justify-content: center;
  padding-top: 1rem;
`

export const CancelButton = styled(Button)`
  width: 100%;
  border-radius: 2px;
  background: transparent;
  color: ${themeColor};
  border: 1px solid ${themeColor};
  height: 40px;
  text-transform: uppercase;
`

export const OkButton = styled(Button)`
  width: 100%;
  border-radius: 2px;
  background: ${themeColor};
  color: ${white};
  border: none;
  height: 40px;
  text-transform: uppercase;
`

export const AddBulkUserPrimaryTextContainer = styled(Col)`
  font-weight: 550;
  width: 80%;
`

export const IconSwap = styled(Icon)`
  padding: 1rem;
  color: ${themeColor};
`
