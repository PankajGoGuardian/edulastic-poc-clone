import {
  darkGrey2,
  greyThemeDark1,
  lightGrey8,
  tabletWidth,
} from '@edulastic/colors'
import { CustomModalStyled } from '@edulastic/common'
import styled from 'styled-components'

export const BodyContentWrapper = styled.div`
  padding: 10px;
  color: ${darkGrey2};
  h3 {
    font-size: 14px;
    margin-top: 10px;
    color: ${darkGrey2};
  }
  ul {
    margin-top: 10px;
  }
  h4 {
    margin-top: 5px;
    color: ${darkGrey2};
  }
  p {
    margin-top: 10px;
    color: ${darkGrey2} !important;
    text-align: left;
    font-size: 11px !important;
    line-height: 1.6;
  }
`

export const StickyHeader = styled.h3`
  font-size: 16px;
  padding: 5px 0px;
  width: 100%;
  background-color: #f8f8f8;
  position: sticky;
  top: 0;
`
export const EdulasticLogo = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`

export const StyledPrivacyPolicyModal = styled(CustomModalStyled)`
  top: 50px;
  .ant-modal-body {
    background-color: white;
    height: calc(100% - 170px);
    @media (max-width: 950px) {
      height: calc(100% - 210px);
    }
    @media (max-width: ${tabletWidth}) {
      height: calc(100% - 220px);
    }
    padding: 10px 24px;
    p {
      font-weight: normal !important;
    }
  }
  .ant-modal-content {
    height: calc(100vh - 100px);
  }
  .ant-modal-header {
    border: none;
    padding: 10px 24px;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: end !important;
    align-items: center;
    background-color: white;
    border: none;
    padding-bottom: 10px;
    p {
      font-weight: 600;
    }
  }
`

export const ModalTitle = styled.h6`
  color: ${greyThemeDark1};
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
`

export const ModalHeaderSubcontent = styled.p`
  width: 100%;
  color: ${greyThemeDark1};
  font-size: 14px;
  line-height: 1.5;
  font-weight: normal;
`

export const ModalTextBody = styled.div`
  text-align: left;
  font-size: 12px;
  letter-spacing: 0px;
  color: ${darkGrey2} !important;
  background: #f8f8f8;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c7c7c7 0% 0% no-repeat padding-box;
    border-radius: 33px;
    opacity: 1;
    height: 70px;
  }
`
export const CheckboxWrapper = styled.div`
  padding: 5px 10px;
  background: ${lightGrey8};
  .ant-checkbox-wrapper {
    font-weight: bold;
    .ant-checkbox .ant-checkbox-inner {
      border-color: #000000;
    }
  }
`

export const NestedOlWrapper = styled.div`
  ol {
    counter-reset: item;
  }
  li {
    display: block;
  }
  li:before {
    content: counters(item, '.') '. ';
    counter-increment: item;
  }
`
