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
import { reportNavType } from '@edulastic/constants/const/report'
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
  if (isSharedReport) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== 'performance-by-rubric-criteria'
    )
  }

  const availableNavItems = isSmallDesktop
    ? filterNavigationItems.filter((ite) => ite.key === activeNavigationKey)
    : // TODO remove bottom checks and use only `filterNavigationItems` as not required & approach is misleading/wrong.
    dataWarehouseReportTypes.find((r) => r === activeNavigationKey) ||
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
  const {
    ENGAGEMENT_SUMMARY,
    ACTIVITY_BY_SCHOOL,
    ACTIVITY_BY_TEACHER,
    PERFORMANCE_BY_RUBRICS_CRITERIA,
    PRE_VS_POST,
    DW_ATTENDANCE_SUMMARY_REPORT,
    DW_DASHBOARD_REPORT,
    DW_EARLY_WARNING_REPORT,
    DW_GOALS_AND_INTERVENTIONS_REPORT,
  } = reportNavType

  const reportTypes = navigation.locToData

  const ReportsWithHiddenShareIcon = [
    reportTypes[ENGAGEMENT_SUMMARY].title,
    reportTypes[ACTIVITY_BY_SCHOOL].title,
    reportTypes[ACTIVITY_BY_TEACHER].title,
    reportTypes[PERFORMANCE_BY_RUBRICS_CRITERIA].title,
    reportTypes[DW_ATTENDANCE_SUMMARY_REPORT].title,
    reportTypes[DW_DASHBOARD_REPORT].title,
    reportTypes[DW_EARLY_WARNING_REPORT].title,
    reportTypes[DW_GOALS_AND_INTERVENTIONS_REPORT].title,
  ]
  const ReportsWithHiddenDownCSVIcon = [
    reportTypes[ENGAGEMENT_SUMMARY].title,
    reportTypes[PRE_VS_POST].title,
    reportTypes[DW_ATTENDANCE_SUMMARY_REPORT].title,
    reportTypes[DW_EARLY_WARNING_REPORT].title,
    reportTypes[DW_GOALS_AND_INTERVENTIONS_REPORT].title,
  ]
  const hideShareIcon = ReportsWithHiddenShareIcon.includes(title)
  const hideDownloadIcon = ReportsWithHiddenDownCSVIcon.includes(title)

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
