import styled from 'styled-components'
import { Modal } from 'antd'
import { white, mainBgColor, title, themeColor } from '@edulastic/colors'

export const ModalWrapper = styled(Modal)`
  top: 0px;
  padding: 0;
  overflow: hidden;
  z-index: 1002;
  .ant-modal-content {
    background: ${mainBgColor};
    .ant-modal-close-icon {
      color: ${white};
    }
    .ant-modal-body {
      padding: 0px;
      min-height: 100px;
      text-align: center;
      main {
        padding: 20px 40px;
        height: calc(100vh - 62px);
        & > section {
          padding: 0px;
        }
      }
    }
  }
`

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 10px;
`

export const SubHeader = styled.div`
  display: flex;
  padding: 30px 20px 0 30px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`

export const BreadCrumb = styled.div`
  color: ${title};
  text-transform: uppercase;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-left: auto;
  width: 400px;
`
export const ActionBtn = styled.button`
  display: flex;
  align-items: space-evenly;
  color: ${themeColor};
  background: ${white};
  text-transform: uppercase;
  text-align: right;
  padding: 10px;
  min-height: 20px;
  border: 1px solid ${themeColor};
  outline: none;
  font: 12px Open Sans;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;

  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};

  svg {
    margin-right: 15px;
  }

  &:active,
  &:hover {
    color: ${white};
    background: ${themeColor};

    svg {
      fill: ${white} !important;
    }
  }
`
