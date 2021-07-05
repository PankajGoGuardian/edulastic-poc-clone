import React from 'react'
import { Link } from 'react-router-dom'
import { Modal } from 'antd'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'

const Button = styled(EduButton)`
  border: none;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`

const roles = {
  'district-admin': 'District Admin',
  'school-admin': 'School Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
}

const color = {
  student: '#D0A20D',
  teacher: '#1AB395',
  'school-admin': '#C33EC3',
  'district-admin': '#B82ECE',
  parent: '#D0A20D',
}

const StyledDiv = styled.div`
  height: 70px;
  border: 1px solid ${(props) => color[props.role]};
  border-radius: 10px;
  text-align: center;
  margin-top: 10px;
  padding: 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &: hover {
    background: ${(props) => color[props.role]};
    color: #fff;
  }
  & > div:first-child {
    text-align: left;
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
}) => (
  <Modal
    title="Switch User"
    visible={showModal}
    onCancel={closeModal}
    footer={null}
  >
    <div>
      <p>Select the role you want to switch</p>
      <div style={{ 'margin-top': '16px' }}>
        {Object.keys(roles).map((role) => {
          const users = otherAccounts
            .flatMap((acc) =>
              acc.districts.length && acc._id === userId
                ? acc.districts.map((district) => ({
                    ...acc,
                    district,
                  }))
                : {
                    ...acc,
                    district: {},
                  }
            )
            .filter(
              (acc) =>
                acc.role === role &&
                !(acc._id === userId && acc.district._id === orgId)
            )
          return (
            !!users.length &&
            users.map((user) => (
              <StyledDiv
                key={`${user._id}_${user.role}`}
                role={role}
                onClick={() =>
                  switchUser(user, { _id: userId, personId, orgId })
                }
              >
                <div style={{ 'font-size': '16px', 'font-weight': '600' }}>
                  <p>{roles[user.role]}</p>
                </div>
                <div style={{ marginLeft: '15px', minWidth: '50%' }}>
                  <div>
                    <p>{user.username}</p>{' '}
                  </div>
                  <div
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      margin: '0 2px',
                    }}
                  >
                    <NoWrapPara titlePrefix="Districts">
                      {(user.district.name ? [user.district] : user.districts)
                        .map((i) => i.name)
                        .join(', ')}
                      {user.districts.length && user.institutions.length
                        ? ', '
                        : ''}
                      {user.institutions.map((i) => i.name).join(', ')}
                    </NoWrapPara>
                  </div>
                </div>
              </StyledDiv>
            ))
          )
        })}
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
  </Modal>
)

export default SwitchUserModal
