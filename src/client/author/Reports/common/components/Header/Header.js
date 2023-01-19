import React, { Fragment } from 'react'
import { Dropdown, Menu, Col, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'

import { themeColor, smallDesktopWidth, tabletWidth } from '@edulastic/colors'
import { EduButton, MainHeader, withWindowSizes } from '@edulastic/common'
import { IconBarChart, IconMoreVertical } from '@edulastic/icons'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import HeaderNavigation from './HeaderNavigation'

import { getIsProxiedByEAAccountSelector } from '../../../../../student/Login/ducks'

import navigation from '../../static/json/navigation.json'

const dataWarehouseReportTypes = navigation.navigation[
  'data-warehouse-reports'
].map((item) => item.key)

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
  showDataWarehouseReport,
  showSharedReport,
  title,
  isSharedReport,
  hasCsvDocs,
  updateCsvDocs,
  isProxiedByEAAccount,
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
  if (
    !showDataWarehouseReport &&
    activeNavigationKey !== 'data-warehouse-reports'
  ) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== 'data-warehouse-reports'
    )
  }
  if (isSharedReport) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== 'performance-by-rubric-criteria'
    )
  }

  const availableNavItems = isSmallDesktop
    ? filterNavigationItems.filter((ite) => ite.key === activeNavigationKey)
    : dataWarehouseReportTypes.find((r) => r === activeNavigationKey) ||
      filterNavigationItems.length > 1
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
  // todo: replace routes titles with constant values.
  const hideShareIcon =
    title === 'Engagement Summary' ||
    title === 'Activity by School' ||
    title === 'Activity by Teacher' ||
    title === 'Performance by Rubric Criteria'
  const hideDownloadIcon = title === 'Engagement Summary'

  const showCSVDocsDownloadButton = title === 'Standard Reports' && hasCsvDocs

  const actionRightButtons = (
    <ActionButtonWrapper>
      {navMenu}
      {showCSVDocsDownloadButton ? (
        <ActionButton
          isBlue
          isGhost
          disabled={isProxiedByEAAccount}
          title={
            isProxiedByEAAccount
              ? 'Bulk action disabled for EA proxy accounts.'
              : 'Download Data'
          }
          onClick={() => updateCsvDocs({ csvModalVisible: true })}
        >
          <Icon type="download" />
          Download Data
        </ActionButton>
      ) : null}
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
          disabled={isProxiedByEAAccount}
          title={
            isProxiedByEAAccount
              ? 'Bulk action disabled for EA proxy accounts.'
              : 'Print'
          }
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
            data-cy="download-csv"
            isBlue
            isGhost
            IconBtn
            disabled={isProxiedByEAAccount}
            title={
              isProxiedByEAAccount
                ? 'Bulk action disabled for EA proxy accounts.'
                : 'Download CSV'
            }
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
      headerLeftClassName="headerLeftWrapper"
      mobileHeaderHeight={activeNavigationKey !== 'standard-reports' ? 100 : ''}
      headingText={t('common.reports')}
      titleMinWidth="100px"
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

const enhance = compose(
  withWindowSizes,
  withNamespaces('header'),
  connect((state) => ({
    isProxiedByEAAccount: getIsProxiedByEAAccountSelector(state),
  }))
)
export default enhance(CustomizedHeaderWrapper)

const StyledCol = styled(Col)`
  align-self: flex-end;
  display: flex;
  padding-bottom: 5px;
  text-align: right;
`
