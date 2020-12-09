import React, { memo } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Affix from "antd/es/affix";
import Layout from "antd/es/layout";
import Row from "antd/es/row";
import Col from "antd/es/col";
import { IconLogout } from '@edulastic/icons'

import {
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
} from '@edulastic/colors'
import { LogoCompact } from '../../../assessment/themes/common'

const SummaryHeader = ({ showConfirmationModal }) => (
  <Affix>
    <AssignmentsHeader>
      <HeaderRow>
        <HeaderCol span={24}>
          <Wrapper>
            <LogoCompact />
          </Wrapper>
          <LogoutIcon onClick={showConfirmationModal} />
        </HeaderCol>
      </HeaderRow>
    </AssignmentsHeader>
  </Affix>
)

SummaryHeader.propTypes = {
  showConfirmationModal: PropTypes.func.isRequired,
}

export default memo(SummaryHeader)

const AssignmentsHeader = styled(Layout.Header)`
  border-bottom: ${(props) =>
    props.borderBottom
      ? props.borderBottom
      : `2px solid ${props.theme.headerBorderColor}`};
  background-color: ${(props) =>
    props.theme.header.headerBgColor || themeColor};
  color: ${(props) => props.theme.header.headerTitleTextColor};
  display: flex;
  align-items: center;
  height: ${(props) => props.theme.HeaderHeight.xs}px;
  padding: 0px 40px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) => props.theme.HeaderHeight.xl}px;
  }

  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
`

const HeaderRow = styled(Row)`
  width: 100%;
`

const HeaderCol = styled(Col)`
  display: flex;
`

const LogoutIcon = styled(IconLogout)`
  fill: ${(props) => props.theme.attemptReview.logoutIconColor};
  width: 24px;
  height: 24px;
  &:hover {
    fill: ${(props) => props.theme.attemptReview.logoutIconHoverColor};
  }
`
