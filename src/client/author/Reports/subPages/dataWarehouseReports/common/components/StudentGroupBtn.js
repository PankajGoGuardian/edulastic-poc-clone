import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { IconPlusCircle } from '@edulastic/icons'
import { StyledEduButton } from './styledComponents'
import { createStudentGroupUrl } from '../../../../common/constants/dataWarehouseReports'

const StudentGroupBtn = ({
  showAddToStudentGroupBtn,
  handleAddToGroupClick,
}) => {
  return (
    <EduIf condition={showAddToStudentGroupBtn}>
      <EduThen>
        <StyledEduButton onClick={handleAddToGroupClick}>
          <IconPlusCircle /> Add To Student Group
        </StyledEduButton>
      </EduThen>
      <EduElse>
        <StyledEduButton isGhost href={createStudentGroupUrl} target="_blank">
          <IconPlusCircle /> Create Student Group
        </StyledEduButton>
      </EduElse>
    </EduIf>
  )
}

export default StudentGroupBtn
