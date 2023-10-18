import React from 'react'
import * as PropTypes from 'prop-types'
import { Menu } from 'antd'
import { sortBy, prop } from 'ramda'
import { ButtonDropdown } from './ButtonDropdown'

const sortByTitle = sortBy(prop('title'))

const memberMenu = (onClick, availableMembers, members) => {
  const filteredAvailableMembers =
    availableMembers.filter(
      (am) => !members.find((m) => (m.name || m.dimension?.name) === am.name)
    ) || []
  return (
    <Menu>
      {filteredAvailableMembers.length ? (
        sortByTitle(filteredAvailableMembers).map((m) => (
          <Menu.Item key={m.name} onClick={() => onClick(m)}>
            {m.title}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>No members found</Menu.Item>
      )}
    </Menu>
  )
}

export const MemberDropdown = ({
  onClick,
  availableMembers,
  members,
  ...buttonProps
}) => (
  <ButtonDropdown
    overlay={memberMenu(onClick, availableMembers, members)}
    {...buttonProps}
  />
)

MemberDropdown.propTypes = {
  onClick: PropTypes.func.isRequired,
  availableMembers: PropTypes.array.isRequired,
}
