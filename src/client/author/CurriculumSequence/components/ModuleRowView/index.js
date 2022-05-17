import React, { Fragment } from 'react'
import { Dropdown, Icon, Menu, Col } from 'antd'
import { IconMoreVertical, IconVerified } from '@edulastic/icons'
import { lightGrey5, themeColor, themeColorLighter } from '@edulastic/colors'
import { removeCommentsFromHtml } from '@edulastic/common/src/helpers'
import {
  StyledLabel,
  StyledTag,
  MenuStyled,
} from '../../../Reports/common/styled'
import { Tooltip } from '../../../../common/utils/helpers'

import ProgressBars from './ProgressBars'
import {
  CaretUp,
  IconActionButton,
  ModuleHeader,
  ModuleID,
  ModuleHeaderData,
  ModuleTitleWrapper,
  ModuleTitle,
  ModuleTitlePrefix,
  ModuleDescription,
  LastColumn,
  HideLinkLabel,
} from '../styled'

const ModuleRowView = (props) => {
  const {
    module,
    isDesktop,
    moduleIndex,
    summaryData,
    isStudent,
    urlHasUseThis,
    hasEditAccess,
    moduleStatus,
    collapsed,
    removeUnit,
    toggleModule,
    assignModule,
    isMobile,
    addModuleMenuClick,
    editModuleMenuClick,
    deleteModuleMenuClick,
    isPlaylistDetailsPage,
    isManageContentActive,
    customizeInDraft,
    blurCurrentModuleRow,
  } = props

  const {
    title,
    data = [],
    description = '',
    moduleId,
    moduleGroupName,
  } = module

  const hideEditOptions = !urlHasUseThis

  const totalAssigned = data.length

  const moduleInlineStyle = {
    'white-space': 'nowrap',
    opacity: module.hidden || blurCurrentModuleRow ? `.5` : `1`,
    pointerEvents: module.hidden ? 'none' : 'all',
    overflow: 'hidden',
  }

  const toPreviewDescription = (description || '')
    .replace(/<p[^>]*>/g, '<span>')
    .replace(/<\/p>/g, '</span>')

  const onClickHideShow = (event) => {
    event.preventDefault()
    event.stopPropagation()
    toggleModule(module, moduleIndex)
  }

  const onClickAssign = () => {
    !module.hidden && totalAssigned ? assignModule(module) : {}
  }

  const moduleManagementMenu = (
    <MenuStyled data-cy="moduleItemMoreMenu" data-testid="moduleItemMoreMenu">
      <CaretUp className="fa fa-caret-up" />
      {!isDesktop && (
        <Menu.Item onClick={onClickHideShow}>
          {module.hidden ? 'Show Module' : 'Hide Module'}
        </Menu.Item>
      )}
      {!isDesktop && !moduleStatus && totalAssigned && (
        <Menu.Item onClick={onClickAssign}>Assign Module</Menu.Item>
      )}
      <Menu.Item onClick={addModuleMenuClick}>Add Module</Menu.Item>
      <Menu.Item onClick={editModuleMenuClick}>Edit Module</Menu.Item>
      <Menu.Item onClick={deleteModuleMenuClick}>Delete Module</Menu.Item>
    </MenuStyled>
  )

  const hideLink = !hideEditOptions &&
    hasEditAccess &&
    !isStudent &&
    !moduleStatus && (
      <HideLinkLabel
        textColor={themeColor}
        fontWeight="Bold"
        data-cy={module.hidden ? 'show-module' : 'hide-module'}
        data-tetsid="hide-module"
        onClick={onClickHideShow}
      >
        {module.hidden ? 'SHOW MODULE' : 'HIDE MODULE'}
      </HideLinkLabel>
    )

  let moduleCompleteOrAssign = ''
  if (!isStudent && moduleStatus && !hideEditOptions) {
    moduleCompleteOrAssign = (
      <StyledLabel
        data-cy="module-complete"
        textColor={themeColorLighter}
        fontWeight="Bold"
      >
        MODULE COMPLETED
        <IconVerified
          color={themeColorLighter}
          style={{ 'margin-left': '20px' }}
        />
      </StyledLabel>
    )
  } else if (!isStudent && !hideEditOptions) {
    moduleCompleteOrAssign = (
      <StyledTag
        data-cy="AssignWholeModule"
        data-tetsid="AssignWholeModule"
        bgColor={themeColor}
        onClick={onClickAssign}
        style={moduleInlineStyle}
      >
        {totalAssigned ? 'ASSIGN MODULE' : 'NO ASSIGNMENTS'}
      </StyledTag>
    )
  }

  const moreActions = !isStudent &&
    (!isPlaylistDetailsPage || isManageContentActive) &&
    (hasEditAccess || customizeInDraft) && (
      <Dropdown overlay={moduleManagementMenu} trigger={['click']}>
        <IconActionButton onClick={(e) => e.stopPropagation()}>
          <IconMoreVertical
            data-testid="actionDropdown"
            width={5}
            height={14}
            color={themeColor}
          />
        </IconActionButton>
      </Dropdown>
    )

  const moduleActions = (
    <>
      {hideLink}
      <LastColumn
        style={moduleInlineStyle}
        width={hideEditOptions || isStudent ? 'auto' : null}
        justifyContent={hideEditOptions && 'flex-end'}
        ml={hideEditOptions && 'auto'}
      >
        {moduleCompleteOrAssign}
        {!isManageContentActive && isPlaylistDetailsPage ? null : moreActions}
      </LastColumn>
    </>
  )

  return (
    <ModuleHeader>
      <ModuleID data-cy="module-id" data-testid="module-id">
        <span>{moduleId || moduleIndex + 1}</span>
      </ModuleID>
      <ModuleHeaderData>
        <Col
          urlHasUseThis={urlHasUseThis}
          style={{
            ...moduleInlineStyle,
            marginRight: urlHasUseThis && 'auto',
            width: isDesktop ? '' : '100%',
          }}
        >
          <StyledLabel fontWeight="normal" textColor={lightGrey5}>
            {moduleGroupName}
          </StyledLabel>
          <ModuleTitleWrapper>
            <Tooltip title={title}>
              <ModuleTitle data-cy="module-name" data-testid="module-name">
                {title}
              </ModuleTitle>
            </Tooltip>
            <ModuleTitlePrefix>
              {!hideEditOptions && (
                <Icon
                  type="close-circle"
                  data-cy="removeUnit"
                  style={{ visibility: 'hidden' }}
                  onClick={() => removeUnit(module.id)}
                />
              )}
            </ModuleTitlePrefix>
          </ModuleTitleWrapper>
          {description && (
            <ModuleDescription
              collapsed={collapsed}
              dangerouslySetInnerHTML={{
                __html: removeCommentsFromHtml(
                  collapsed ? toPreviewDescription : description
                ),
              }}
            />
          )}
        </Col>
        <ProgressBars
          isDesktop={isDesktop}
          isStudent={isStudent}
          urlHasUseThis={urlHasUseThis}
          columnStyle={moduleInlineStyle}
          data={summaryData[moduleIndex]}
          renderExtra={isMobile ? hideLink : ''}
        />
        {isDesktop ? moduleActions : moreActions}
      </ModuleHeaderData>
    </ModuleHeader>
  )
}

export const InfoProgressBar = ProgressBars
export default ModuleRowView
