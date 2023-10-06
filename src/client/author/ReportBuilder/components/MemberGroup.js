import React from 'react'
import * as PropTypes from 'prop-types'
import { IconPlusCircle } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import MemberDropdown from './MemberDropdown'
import RemoveButtonGroup from './RemoveButtonGroup'
import MemberGroupTitle from './MemberGroupTitle'

const MemberGroup = ({
  members,
  availableMembers,
  addMemberName,
  updateMethods,
  title,
  multiple = false,
}) => {
  const updateMembers = (oldMember, newMember) => {
    const idxToReplace = members.findIndex((o) => o.name === oldMember.name)
    const existingMembers = [...members]
    existingMembers[idxToReplace] = newMember
    updateMethods(existingMembers)
  }
  return (
    <div>
      <MemberGroupTitle title={title} />
      {members.map((m) => (
        <RemoveButtonGroup
          key={m.index || m.name}
          onRemoveClick={() =>
            updateMethods(members.filter((o) => o.name !== m.name))
          }
        >
          <MemberDropdown
            type="selected"
            availableMembers={availableMembers}
            members={members}
            onClick={(updateWith) => updateMembers(m, updateWith)}
          >
            {m.title}
          </MemberDropdown>
        </RemoveButtonGroup>
      ))}
      <EduIf condition={!members.length || multiple}>
        <MemberDropdown
          type={members.length > 0 ? 'icon' : 'new'}
          onClick={(m) => updateMethods([...members, m])}
          availableMembers={availableMembers}
          members={members}
        >
          {addMemberName}
          <IconPlusCircle
            style={{
              marginLeft: '7px',
              fill: themeColor,
              height: '18',
              width: '18',
              marginBottom: '-3px',
            }}
          />
        </MemberDropdown>
      </EduIf>
    </div>
  )
}

MemberGroup.propTypes = {
  members: PropTypes.array.isRequired,
  availableMembers: PropTypes.array.isRequired,
  addMemberName: PropTypes.string.isRequired,
  updateMethods: PropTypes.object.isRequired,
}

export default MemberGroup
