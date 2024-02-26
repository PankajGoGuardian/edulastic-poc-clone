import styled from 'styled-components'
import { Modal } from 'antd'
import { cardTitleColor, mobileWidthMax, themeColor } from '@edulastic/colors'
import { Card, FlexContainer } from '@edulastic/common'
import { ThemeButton } from '../../../../../src/components/common/ThemeButton'

export const DocStyledModal = styled(Modal)`
  width: 100% !important;
  top: 0 !important;
  left: 0 !important;

  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-header {
    display: none;
  }
  .ant-modal-content {
    height: 100vh;
    padding-top: 20px;
    bottom: auto;
    border-radius: 0;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    & > div:not(.ant-spin) {
      & > svg {
        height: 100%;
      }
    }
  }

  .exit-btn-row {
    margin-top: -10px;
    margin-bottom: 10px;
  }
`
export const ContainerStyledModal = styled(Modal)`
  .ant-modal-header {
    display: none;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    & > div:not(.ant-spin) {
      & > svg {
        height: 100%;
      }
    }
  }
`
export const FeedbackStyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0 50px 0 50px;
  }
  .ant-modal-header {
    padding: 24px 46px;
    border: 0;
    .ant-modal-title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -1.1px;
    }
  }
  .ant-modal-footer {
    border: 0;
    padding-bottom: 30px;
  }
  .ant-modal-close {
    top: 6px;
    color: black;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .ant-alert-error {
    width: 100%;
    margin-top: 10px;
  }
`

export const AssessmentTitle = styled.span`
  color: ${themeColor};
  cursor: pointer;
`

export const ActivityModalContainer = styled.div`
  padding: 30px;
  height: 100vh;
  overflow: auto;
`

export const ActivityModalHeader = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0;
  z-index: 999;
  background: white;
  padding: 10px 40px 10px 30px;
  box-shadow: 0px 0px 3px 1px #dddddd;
`
export const ActivityHeaderLeft = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`
export const ActivityHeaderRight = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: flex-end;
  gap: 10px;
`

export const ActivityTitle = styled.div`
  margin: 50px 0 0 0;
  font-weight: bold;
  font-size: large;
`

export const TotalScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
`

export const TotalScoreWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Seperator = styled.div`
  border: solid 1px black;
  width: 50px;
`

export const ScoreTextContainer = styled.span`
  color: black;
  texttransform: capitalize;
`

export const StudentGrapContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 20px;
  padding-top: 20px;
`

export const StyledThemeButton = styled(ThemeButton)`
  color: #fff;
  width: 110px;
  margin-left: auto;
  margin-right: 20px;
`

export const GraphWrapper = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  width: 100%;
  display: flex;
`

export const StudentNameContainer = styled.span`
  font-weight: bold;
  font-size: large;
`

export const ScoreHeader = styled.div`
  font-size: ${(props) => props.fontSize || 11}px;
  margin-bottom: 5px;
  color: ${cardTitleColor};
  font-weight: 800;
`

export const StyledCard = styled(Card)`
  box-shadow: none;
  .ant-card-body {
    padding: ${(props) => props.padding || '0px'};
  }
  width: 100%;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
`

export const PaginationWrapper = styled.div`
  padding: ${(props) => (props.type === 'tile' ? '20px 0' : '24px 32px')};
  padding-right: 55px;
  text-align: right;
`
