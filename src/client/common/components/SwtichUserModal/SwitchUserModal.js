import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Spin } from 'antd'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { IconPlusCircle, IconCircleCheck } from '@edulastic/icons'

const Button = styled(EduButton)`
  border: none;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`
// TODO - Need to use the constant roleuser.ROLE_LABEL from '@edulastic/constants'
const roles = {
  'district-admin': 'District Admin',
  'school-admin': 'School Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  'edulastic-curator': 'edulastic-curator',
}
const roleOrder = Object.fromEntries(
  Object.entries(roles).map(([key], i) => [key, i])
)

const color = {
  student: '#D0A20D',
  teacher: '#1AB395',
  'school-admin': '#C33EC3',
  'district-admin': '#B82ECE',
  parent: '#D0A20D',
  'edulastic-curator': '#D0A20D',
}

const StyledDiv = styled.div.attrs((props) => ({
  ...props,
  onClick: props.selected ? () => {} : props.onClick,
  'aria-selected': `${!!props.selected}`,
}))`
  height: 70px;
  border: 1px solid ${(props) => color[props.role]};
  border-radius: 10px;
  text-align: center;
  margin-top: 10px;
  padding: 34px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ selected }) => (selected ? 'not-allowed' : 'pointer')};
  & > div.check {
    flex: 0 0 38px;
    margin: 0 16px;
    & svg {
      display: ${({ selected }) => (selected ? 'inline' : 'none')};
      color: white;
      fill: #1a73e8;
    }
  }
  & > div.role {
    text-align: left;
    flex: 0 0 auto;
    font-size: 16px;
    font-weight: 600;
  }
  & > div.description {
    text-align: right;
    flex: 1 1 auto;
    margin-left: 15px;
    min-width: 50%;
    & div.organizations {
      max-width: 250px;
      overflow: hidden;
      margin: 0 2px;
      float: right;
      color: gray;
      font-weight: 550;
    }
  }
  &: hover ${(p) => (p.isActive ? ', &' : '')} {
    background: ${(props) => color[props.role]};
    color: #fff;
    & > div.description > div.organizations {
      color: #fff;
    }
  }
`

const NoWrapPara = styled.p.attrs((props) => ({
  title: props.children.join(''),
  ...props,
}))`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const SwitchUserModal = ({
  showModal,
  closeModal,
  otherAccounts,
  personId,
  userId,
  switchUser,
  userRole,
  orgId,
}) => {
  const [activeKey, setActiveKey] = useState('')
  const getKey = useCallback(
    (user) => `${user._id}_${user.role}_${user.district?._id}`,
    []
  )
  useEffect(() => {
    if (!showModal) {
      setActiveKey('')
    }
  }, [showModal])
  const switchUserCB = useCallback(
    (user, ...args) => {
      setActiveKey(getKey(user))
      return switchUser(user, ...args).finally(() => {
        setActiveKey('')
      })
    },
    [setActiveKey, getKey, switchUser]
  )
  return (
    <Modal
      title="Switch User"
      visible={showModal}
      onCancel={closeModal}
      footer={null}
      wrapProps={{
        'data-cy': 'switch-user-modal',
      }}
    >
      <Spin spinning={!!activeKey}>
        <div>
          <p>Select the role you want to switch</p>
          <div style={{ marginTop: '16px' }} data-cy="switch-user-list">
            {otherAccounts
              .filter((acc) => Object.keys(roles).includes(acc.role))
              .sort((a, b) => {
                if (a._id === userId && b._id !== userId) return -1
                if (a._id !== userId && b._id === userId) return 1
                return roleOrder[a.role] - roleOrder[b.role]
              })
              .map((user) => ({
                ...user,
                districtString: (user.district.name
                  ? [user.district]
                  : user.districts || []
                )
                  .map((i) => i.name)
                  .join(', '),
                schoolString: (user.institutions || [])
                  .map((i) => i.name)
                  .join(', '),
              }))
              .map((user) => (
                <StyledDiv
                  key={getKey(user)}
                  role={user.role}
                  selected={user._id === userId && user.district._id === orgId}
                  isActive={getKey(user) === activeKey}
                  onClick={() =>
                    switchUserCB(user, { _id: userId, personId, orgId })
                  }
                >
                  <div className="check">
                    <IconCircleCheck />
                  </div>
                  <div className="role">
                    <p>{roles[user.role]}</p>
                  </div>
                  <div className="description">
                    <div>
                      <p>{user.username}</p>{' '}
                    </div>
                    <div className="organizations">
                      <NoWrapPara>
                        {user.districtString || user.schoolString ? '( ' : ''}
                        {user.districtString}
                        {user.districtString && user.schoolString ? ', ' : ''}
                        {user.schoolString}
                        {user.districtString || user.schoolString ? ' )' : ''}
                      </NoWrapPara>
                    </div>
                  </div>
                </StyledDiv>
              ))}
          </div>
        </div>
        {userRole === 'edulastic-admin' ||
        userRole === 'edulastic-curator' ? null : (
          <ButtonsContainer>
            <Link to={`/?addAccount=true&userId=${userId}`} target="_blank">
              <Button isGhost>
                <IconPlusCircle /> Add another account
              </Button>
            </Link>
          </ButtonsContainer>
        )}
      </Spin>
    </Modal>
  )
}

export default SwitchUserModal
