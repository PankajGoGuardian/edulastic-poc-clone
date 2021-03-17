import styled from 'styled-components'
import { Checkbox, Modal, Select } from 'antd'
import { title, themeColor } from '@edulastic/colors'

export const StyledModal = styled(Modal)`
  .ant-modal-close-x {
    font-size: 24px;
    font-weight: 600;
    color: black;
    margin: 10px 20px;
  }

  .ant-modal-header {
    border: none;

    .ant-modal-title {
      font-size: 24px;
      font-weight: 600;
      padding: 12px 16px;
    }
  }

  .ant-modal-body {
    padding: 0px 40px;
  }

  .ant-modal-footer {
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 40px 30px 35px;
  }
`

export const Title = styled.div`
  text-transform: uppercase;
  color: ${title};
  font-size: 12px;
  font-weight: 700;
  margin: 15px 0px 5px;
  user-select: none;
`

export const StyledCheckbox = styled(Checkbox)`
  margin: 8px 0 !important;
  color: ${title};
  font-size: 12px;
  font-weight: semi-bold;
  text-transform: uppercase;
  user-select: none;
`

export const Item = styled.div`
  user-select: none;
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  /* margin: 20px 0px; */
  font-size: 20px;
  color: ${({ active }) => (active ? themeColor : title)};
  border-left: ${({ active }) => active && `4px solid ${themeColor}`};
  cursor: pointer;
`

export const Label = styled.label`
  color: ${({ active }) => (active ? themeColor : title)};
  font-weight: 600;
  text-align: left;
  font-size: 11px;
  letter-spacing: 0;
  padding-left: 25px;
  cursor: inherit;
  text-transform: uppercase;
`

export const StyledSelect = styled(Select)`
  width: 100%;
  min-height: 40px;
  margin-bottom: 5px;
  .ant-select-selection__rendered {
    line-height: 40px;
  }

  .ant-select-selection__choice {
    background-color: #b3bcc4;
  }

  .ant-select-selection--multiple > ul > li,
  .ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
    margin-top: 8px;
  }
`
