import {
  extraDesktopWidthMax,
  green,
  largeDesktopWidth,
  mobileWidthMax,
  themeColorBlue,
} from '@edulastic/colors'
import { IconFilterClass } from '@edulastic/icons'
import { Select } from 'antd'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  changeChildAction,
  changeClassAction,
  getCurrentGroupExactValue,
} from '../Login/ducks'
import { getFormattedName } from '../../author/Gradebook/transformers'
import { setSelectedGroupStatusAction } from '../sharedDucks/AssignmentModule/ducks'
import { getCurrentTerm } from '../../author/src/selectors/user'

const ClassSelector = ({
  t,
  classList,
  currentGroup,
  changeClass,
  allClasses = [],
  showAllClassesOption,
  setSelectedGroupStatus,
  currentTerm,
}) => {
  const [isShown, setShown] = useState(false)
  const activeClasses = classList.filter((item) => item.active === 1)
  useEffect(() => {
    if (!showAllClassesOption) {
      /* For skill report we are not showing "All options", so when we route to the skill-report 
       page we pick the first class id by default and exit out of useEffect */
      if (!currentGroup && activeClasses.length)
        changeClass(activeClasses[0]?._id)
    } else {
      if (
        currentGroup === '' &&
        classList.length === 1 &&
        activeClasses.length
      ) {
        // all classes. but really only one classes available
        changeClass(activeClasses[0]._id)
      }
      if (currentGroup !== '' && currentGroup !== 'archive') {
        // not all classes

        const currentGroupInList = activeClasses.find(
          (x) => x._id === currentGroup
        )
        if (!currentGroupInList) {
          // currently selected class is not in the list. so selecting first available class
          if (activeClasses.length > 0 && !sessionStorage.temporaryClass) {
            changeClass(activeClasses[0]._id)
          }
        }
      }
    }
  }, [activeClasses, currentGroup, showAllClassesOption])
  const temporaryClassId = sessionStorage.getItem('temporaryClass')
  const tempClass =
    allClasses.find((clazz) => clazz._id === temporaryClassId) || {}
  const currentClass =
    activeClasses.length === 0 &&
    currentGroup &&
    isEmpty(tempClass) &&
    allClasses.find((c) => c._id === currentGroup)
  const handleChangeClass = (value) => {
    if (value === '') {
      setSelectedGroupStatus('all')
    } else if (value === 'archive') {
      setSelectedGroupStatus('archive')
    } else {
      setSelectedGroupStatus('active')
    }
    changeClass(value)
  }

  const hasArchivedClasses = classList.some(
    (item) => item.active === 0 && item.termId === currentTerm
  )

  return (
    <>
      <AssignmentMobileButton onClick={() => setShown(!isShown)}>
        <IconFilterClass />
      </AssignmentMobileButton>
      <AssignmentSelectClass id="class-dropdown-wrapper" isShown={isShown}>
        <ClassLabel>{t('common.classLabel')}</ClassLabel>
        <Select
          data-cy="select-class"
          aria-label="select class"
          value={currentGroup}
          getPopupContainer={() =>
            document.getElementById('class-dropdown-wrapper')
          }
          onChange={handleChangeClass}
        >
          {classList.length > 1 && showAllClassesOption && (
            <Select.Option key="all" value="">
              All classes
            </Select.Option>
          )}

          {!isEmpty(tempClass) && (
            <Select.Option key={tempClass._id} value={tempClass._id}>
              {tempClass.name}
            </Select.Option>
          )}
          {activeClasses.map(
            (cl) =>
              temporaryClassId !== cl._id && (
                <Select.Option key={cl._id} value={cl._id}>
                  {cl.name}
                </Select.Option>
              )
          )}
          {currentClass && (
            <Select.Option key={currentClass._id} value={currentClass._id}>
              {currentClass.name}
            </Select.Option>
          )}
          {hasArchivedClasses && showAllClassesOption && (
            <Select.Option key="archive" value="archive">
              Archived Classes
            </Select.Option>
          )}
        </Select>
      </AssignmentSelectClass>
    </>
  )
}

ClassSelector.propTypes = {
  t: PropTypes.func.isRequired,
}

const stateToProps = (state) => ({
  currentGroup: getCurrentGroupExactValue(state),
  allClasses: state.studentEnrollClassList.allClasses,
  currentTerm: getCurrentTerm(state),
})
export default connect(stateToProps, {
  changeClass: changeClassAction,
  setSelectedGroupStatus: setSelectedGroupStatusAction,
})(ClassSelector)

function StudentSelect({ changeChild, childs, currentChild }) {
  if ((childs || []).length <= 1) {
    return null
  }
  return (
    <AssignmentSelectClass
      id="class-dropdown-wrapper"
      style={{ marginRight: '20px' }}
    >
      <ClassLabel>student</ClassLabel>
      <Select
        value={currentChild}
        getPopupContainer={() =>
          document.getElementById('class-dropdown-wrapper')
        }
        onChange={(value) => {
          changeChild(value)
        }}
      >
        {childs.map((cl) => (
          <Select.Option key={cl._id} value={cl._id}>
            {getFormattedName(cl.firstName, cl.middleName, cl.lastName)}
          </Select.Option>
        ))}
      </Select>
    </AssignmentSelectClass>
  )
}

export const StudentSlectCommon = connect(
  (state) => ({
    childs: state?.user?.user?.children,
    currentChild: state?.user?.currentChild,
  }),
  {
    changeChild: changeChildAction,
  }
)(StudentSelect)

const ClassLabel = styled.span`
  display: flex;
  font-size: ${(props) => props.theme.header.headerClassTitleFontSize};
  color: ${(props) => props.theme.header.headerClassTitleColor};
  font-weight: 600;
  margin-right: 10px;
  align-items: center;
  letter-spacing: 0.2px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 12px;
    margin-right: 19px;
  }

  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

const AssignmentSelectClass = styled.div`
  display: flex;
  align-items: center;

  .ant-select {
    height: 40px;
    width: 190px;
    border-color: ${themeColorBlue};

    @media (min-width: ${extraDesktopWidthMax}) {
      width: 240px;
    }

    @media (max-width: ${largeDesktopWidth}) {
      height: 37px;
      width: 164px;
    }
  }

  .ant-select-selection {
    background-color: ${(props) => props.theme.headerDropdownBgColor};
    color: ${themeColorBlue};
    font-size: ${(props) => props.theme.classNameFontSize};
    border-color: ${themeColorBlue};
    box-shadow: none !important;
    font-weight: 600;
  }

  .ant-select-dropdown-menu-item {
    background-color: ${(props) => props.theme.headerDropdownItemBgColor};
    color: ${(props) => props.theme.headerDropdownTextColor};
    font-size: ${(props) => props.theme.classNameFontSize};
    &.ant-select-dropdown-menu-item-selected {
      background-color: ${(props) =>
        props.theme.headerDropdownItemBgSelectedColor};
      color: ${(props) => props.theme.headerDropdownItemTextSelectedColor};
    }

    &:hover {
      background-color: ${(props) =>
        props.theme.headerDropdownItemBgHoverColor} !important;
      color: ${(props) =>
        props.theme.headerDropdownItemTextHoverColor} !important;
    }
  }

  .ant-select-selection__rendered {
    height: 100%;
    align-items: center;
    display: flex !important;
    padding-left: 15px;
    font-size: ${(props) => props.theme.classNameFontSize};

    @media (max-width: ${largeDesktopWidth}) {
      padding-left: 2px;
      font-size: 11px;
    }
  }
  .anticon-down {
    svg {
      fill: ${(props) => props.theme.headerDropdownTextColor};
    }
  }

  @media (max-width: ${mobileWidthMax}) {
    position: absolute;
    top: calc(100% + 11px);
    left: 50%;
    transform: translateX(-50%);
    width: 100vw !important;
    padding: 16px 26px;
    z-index: 1;
    background: #fff;
    padding-top: 10px;
    opacity: ${({ isShown }) => (isShown ? 1 : 0)};
    pointer-events: ${({ isShown }) => (isShown ? 'all' : 'none')};

    .ant-select {
      height: 40px;
      flex: 1;
      margin-right: 0;
      margin-left: 0;
      border: 1px solid #e1e1e1;
      width: 100%;
      max-width: 100%;
    }

    .ant-select-selection {
      background: #f8f8f8;
    }
  }
`

const AssignmentMobileButton = styled.div`
  display: none;

  @media (max-width: ${mobileWidthMax}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 40px;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    svg {
      fill: ${green};
    }
  }
`
