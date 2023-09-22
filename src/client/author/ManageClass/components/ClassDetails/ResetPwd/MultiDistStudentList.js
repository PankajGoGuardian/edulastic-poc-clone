import React from 'react'
import { IconExclamationMark } from '@edulastic/icons'

const MultiDistStudentList = ({ multiDistStudents, t }) => {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <span>
        <IconExclamationMark width={12} height={12} />
      </span>
      <div
        style={{
          color: 'red',
          fontSize: '15px',
          marginLeft: '5px',
          marginTop: '-2px',
        }}
        data-cy="pwdResetForMultiDist"
      >
        {t('multiDistrictStudentPasswordError.multiStudentPasswordReset')}
        {multiDistStudents.map((o) => (
          <ul style={{ color: 'black' }} data-cy="multiDistStudentList">
            {`${o.lastName ? `${o.lastName},` : ''} ${
              o.firstName ? o.firstName : ''
            }`}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default MultiDistStudentList
