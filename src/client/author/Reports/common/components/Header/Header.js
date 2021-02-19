import React, { Fragment } from 'react'
import { Dropdown, Menu, Col, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'
import { themeColor, smallDesktopWidth, tabletWidth } from '@edulastic/colors'
import { EduButton, MainHeader, withWindowSizes } from '@edulastic/common'
import { IconBarChart, IconMoreVertical } from '@edulastic/icons'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import HeaderNavigation from './HeaderNavigation'

const CustomizedHeaderWrapper = ({
  windowWidth,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  navigationItems = [],
  activeNavigationKey = '',
  hideSideMenu,
  isCliUser,
  showCustomReport,
  showSharedReport,
  title,
  isSharedReport,
  t,
}) => {
  const _onShareClickCB = () => {
    onShareClickCB()
  }

  const _onPrintClickCB = () => {
    onPrintClickCB()
  }

  const _onDownloadCSVClickCB = () => {
    onDownloadCSVClickCB()
  }

  const isSmallDesktop =
    windowWidth >= parseInt(tabletWidth, 10) &&
    windowWidth <= parseInt(smallDesktopWidth, 10)

  let filterNavigationItems = navigationItems
  if (isCliUser) {
    filterNavigationItems = navigationItems.filter(
      (item) =>
        item.key !== 'peer-performance' && item.key !== 'response-frequency'
    )
  }
  if (!showCustomReport && activeNavigationKey !== 'custom-reports') {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== 'custom-reports'
    )
  }
  if (!showSharedReport && activeNavigationKey !== 'shared-reports') {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== 'shared-reports'
    )
  }

  const availableNavItems = isSmallDesktop
    ? filterNavigationItems.filter((ite) => ite.key === activeNavigationKey)
    : filterNavigationItems.length > 1
    ? filterNavigationItems
    : []

  const ActionButtonWrapper = isSmallDesktop ? Menu : Fragment
  const ActionButton = isSmallDesktop ? Menu.Item : EduButton

  const navMenu = isSmallDesktop
    ? filterNavigationItems
        .filter((ite) => ite.key !== activeNavigationKey)
        .map((ite) => (
          <ActionButton key={ite.key}>
            <Link to={ite.location}>{ite.title}</Link>
          </ActionButton>
        ))
    : null

  const hideShareIcon =
    title === 'Engagement Summary' ||
    title === 'Activity by School' ||
    title === 'Activity by Teacher'
  const hideDownloadIcon = title === 'Engagement Summary'

  const actionRightButtons = (
    <ActionButtonWrapper>
      {navMenu}
      <FeaturesSwitch
        inputFeatures="shareReports"
        actionOnInaccessible="hidden"
      >
        {onShareClickCB && !isSharedReport && !hideShareIcon ? (
          <ActionButton
            isBlue
            isGhost
            IconBtn
            title="Share"
            onClick={_onShareClickCB}
          >
            <Icon type="share-alt" />
            {isSmallDesktop && <span>Share</span>}
          </ActionButton>
        ) : null}
      </FeaturesSwitch>
      {onPrintClickCB ? (
        <ActionButton
          isBlue
          isGhost
          IconBtn
          title="Print"
          onClick={_onPrintClickCB}
        >
          <Icon type="printer" />
          {isSmallDesktop && <span>Print</span>}
        </ActionButton>
      ) : null}
      <FeaturesSwitch
        inputFeatures="downloadReports"
        actionOnInaccessible="hidden"
      >
        {onDownloadCSVClickCB && !hideDownloadIcon ? (
          <ActionButton
            isBlue
            isGhost
            IconBtn
            title="Download CSV"
            onClick={_onDownloadCSVClickCB}
          >
            <Icon type="download" />
            {isSmallDesktop && <span>Download CSV</span>}
          </ActionButton>
        ) : null}
      </FeaturesSwitch>
      {/* {activeNavigationKey === "standard-reports" && (
        <ActionButton isBlue>
          <IconQuestionCircle />
          <span>HOW TO USE INSIGHTS</span>
        </ActionButton>
      )} */}
    </ActionButtonWrapper>
  )

  return (
    <MainHeader
      mobileHeaderHeight={activeNavigationKey !== 'standard-reports' ? 100 : ''}
      headingText={t('common.reports')}
      Icon={IconBarChart}
      hideSideMenu={hideSideMenu}
    >
      {availableNavItems.length ? (
        <HeaderNavigation
          navigationItems={availableNavItems}
          activeItemKey={activeNavigationKey}
        />
      ) : null}
      <StyledCol>
        {!isSmallDesktop && actionRightButtons}
        {isSmallDesktop && (
          <Dropdown overlay={actionRightButtons} trigger={['click']}>
            <EduButton isGhost IconBtn>
              <IconMoreVertical color={themeColor} />
            </EduButton>
          </Dropdown>
        )}
      </StyledCol>
    </MainHeader>
  )
}

export default withNamespaces('header')(
  withWindowSizes(CustomizedHeaderWrapper)
)

const StyledCol = styled(Col)`
  text-align: right;
  display: flex;
`
