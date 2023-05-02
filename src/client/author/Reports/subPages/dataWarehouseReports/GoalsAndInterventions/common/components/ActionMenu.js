import React, { useState } from 'react'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Modal from 'antd/lib/modal'
import styled from 'styled-components'
import { IconCaretDown, IconClose } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { Link } from 'react-router-dom'
import { EduElse, EduIf, EduThen } from '@edulastic/common'

const DeleteModal = ({ type, showModal, setShowModal }) => (
  <Modal
    className="delete-popup"
    title="Confirm"
    centered
    width={300}
    visible={showModal}
    closeIcon={<IconClose />}
    onOk={() => setShowModal(false)}
    onCancel={() => setShowModal(false)}
  >
    <p>Are you sure you’d like to delete this {type.toLowerCase()}?</p>
  </Modal>
)

const ActionMenu = ({
  type,
  options,
  onAction,
  title = 'ACTIONS',
  includeDelete = false,
}) => {
  const [showModal, setShowModal] = useState(false)
  const menu = (
    <Menu onClick={onAction}>
      <Header>
        <h2>Actions</h2>
        <IconClose />
      </Header>
      {options.map((item) => (
        <Menu.Item key={item.id}>
          <EduIf condition={item.link}>
            <EduThen>
              <Link to={item.link}>{item.label}</Link>
            </EduThen>
            <EduElse>{item.label}</EduElse>
          </EduIf>
        </Menu.Item>
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
        <DeleteModal showModal setShowModal={setShowModal} type={type} />
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
