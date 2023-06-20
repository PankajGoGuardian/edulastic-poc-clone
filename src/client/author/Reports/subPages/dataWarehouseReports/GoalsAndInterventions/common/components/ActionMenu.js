import React, { useState } from 'react'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import styled from 'styled-components'
import { IconCaretDown, IconClose } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { flattenFormData } from '../utils'
import { ACADEMIC } from '../../constants/form'
import { GIListActions, IN_PROGRESS, NOT_STARTED } from '../../constants/common'
import ActionMenuItem from './ActionMenuItem'
import DeleteModal from './GITable/DeleteModal'

const ActionMenu = ({
  type,
  options,
  onAction,
  title = 'ACTIONS',
  includeDelete = false,
  GIData = {},
}) => {
  const [showModal, setShowModal] = useState(false)
  let urlData
  if (type !== 'group') {
    const { termId, studentGroupIds = [], type: GIType } = GIData
    const {
      applicableTo: { testTypes = [], subjects = [] } = {},
      target: { performanceBandId = '' } = {},
    } = GIData?.goalCriteria || GIData?.interventionCriteria || {}

    urlData = {
      termId,
      ...(GIType === ACADEMIC ? { performanceBandId } : {}),
      studentGroupIds: studentGroupIds.join(),
      testTypes: testTypes.join(),
      subjects: subjects.join(),
    }
  } else {
    const { termId, _id: groupId } = GIData
    urlData = { termId, groupId }
  }

  const { status } = GIData
  const isEditDisabled = ![IN_PROGRESS, NOT_STARTED].includes(status)

  const handleClick = (event) => {
    const { key } = event
    if ([GIListActions.DELETE, GIListActions.EDIT].includes(key)) {
      if (key === GIListActions.DELETE) {
        setShowModal(true)
      }
      if (key === GIListActions.EDIT) {
        onAction({
          ...flattenFormData(GIData),
          formType: type,
          isEditFlow: true,
        })
      }
      return
    }
    onAction(event)
  }

  const menu = (
    <Menu onClick={handleClick}>
      <Header>
        <h2>Actions</h2>
        <IconClose />
      </Header>
      {options.map((item) => (
        <ActionMenuItem
          item={item}
          urlData={urlData}
          key={item.id}
          isEditDisabled={isEditDisabled}
          GIType={type}
        />
      ))}
      <EduIf condition={includeDelete}>
        <Menu.Item key="3" onClick={() => setShowModal(true)}>
          Delete
        </Menu.Item>
      </EduIf>
    </Menu>
  )
  return (
    <>
      <EduIf condition={showModal}>
        <DeleteModal
          showModal
          setShowModal={setShowModal}
          type={type}
          GIData={GIData}
        />
      </EduIf>
      <Dropdown
        overlayClassName="action-menu"
        overlay={menu}
        placement="bottomCenter"
        trigger={['click']}
      >
        <a onClick={(e) => e.preventDefault()}>
          {title}
          <StyledIconCaretDown />
        </a>
      </Dropdown>
    </>
  )
}

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  h2 {
    font-weight: 700;
    font-size: 10px;
    color: #bbbbbb;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #eeeeee;
    width: fit-content;
    padding: 0 10px;
    width: 100%;
    text-align: left;
  }
  svg {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 5px;
    height: 5px;
  }
`

export const StyledIconCaretDown = styled(IconCaretDown)`
  fill: ${themeColor};
  height: 5px;
  margin-left: 6px;
`

export default ActionMenu
