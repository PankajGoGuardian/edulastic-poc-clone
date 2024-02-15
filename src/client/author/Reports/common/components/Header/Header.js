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
import {
  reportGroupType,
  reportNavType,
} from '@edulastic/constants/const/report'
import { roleuser } from '@edulastic/constants'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import HeaderNavigation from './HeaderNavigation'

import { getIsProxiedByEAAccountSelector } from '../../../../../student/Login/ducks'

import navigation from '../../static/json/navigation.json'
import { getUserOrgId, getUserRole } from '../../../../src/selectors/user'
import { DATA_STUDIO_DISABLED_DISTRICTS } from '../../../../src/constants/others'
import { CUSTOM_TO_STATE_REPORTS_DISTRICT_IDS } from '../../constants/customReports'
import { DGA_VISIBLE_TABS } from '../../constants/dataWarehouseReports'

const dataStudioReportTypes = navigation.navigation[
  reportGroupType.DATA_WAREHOUSE_REPORT
].map((item) => item.key)

const CustomizedHeaderWrapper = ({
  windowWidth,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  navigationItems: _navigationItems = [],
  activeNavigationKey = '',
  hideSideMenu,
  orgId,
  userRole,
  isCliUser,
  showCustomReport,
  showSharedReport,
  title,
  isSharedReport,
  hasCsvDocs,
  updateCsvDocs,
  isProxiedByEAAccount,
  t,
  districtId: _districtId,
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

  // NOTE: changes for demo district data with custom reports
  // ref. EV-40723
  const navigationItems = CUSTOM_TO_STATE_REPORTS_DISTRICT_IDS.includes(
    _districtId
  )
    ? _navigationItems.map((item) =>
        item.key === reportGroupType.CUSTOM_REPORT
          ? { ...item, title: 'State Reports' }
          : item
      )
    : _navigationItems

  let filterNavigationItems = navigationItems
  if (userRole === roleuser.DISTRICT_GROUP_ADMIN) {
    filterNavigationItems = filterNavigationItems
      .filter((item) => DGA_VISIBLE_TABS.includes(item.key))
      .reverse()
  }

  if (isCliUser) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) =>
        item.key !== reportNavType.PEER_PERFORMANCE &&
        item.key !== reportNavType.RESPONSE_FREQUENCY
    )
  }
  if (
    !showCustomReport &&
    activeNavigationKey !== reportGroupType.CUSTOM_REPORT
  ) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== reportGroupType.CUSTOM_REPORT
    )
  }
  if (
    !showSharedReport &&
    activeNavigationKey !== reportGroupType.SHARED_REPORT
  ) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== reportGroupType.SHARED_REPORT
    )
  }
  if (isSharedReport) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== reportNavType.PERFORMANCE_BY_RUBRICS_CRITERIA
    )
  }

  if (
    DATA_STUDIO_DISABLED_DISTRICTS.some((districtId) => districtId === orgId)
  ) {
    filterNavigationItems = filterNavigationItems.filter(
      (item) => item.key !== reportGroupType.DATA_WAREHOUSE_REPORT
    )
  }

  const isDataStudioReport = dataStudioReportTypes.find(
    (reportType) => reportType === activeNavigationKey
  )
  const showGroupNavItems = [
    userRole === roleuser.DISTRICT_GROUP_ADMIN,
    isDataStudioReport,
    filterNavigationItems.length > 1,
  ].some((e) => e)

  const availableNavItems = isSmallDesktop
    ? filterNavigationItems.filter((ite) => ite.key === activeNavigationKey)
    : // TODO remove bottom checks and use only `filterNavigationItems` as not required & approach is misleading/wrong.
    showGroupNavItems
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
    orgId: getUserOrgId(state),
    userRole: getUserRole(state),
  }))
)
export default enhance(CustomizedHeaderWrapper)

const StyledCol = styled(Col)`
  align-self: flex-end;
  display: flex;
  padding-bottom: 5px;
  text-align: right;
`
