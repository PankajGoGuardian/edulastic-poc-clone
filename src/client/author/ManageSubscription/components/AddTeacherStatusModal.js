import { themeColor } from '@edulastic/colors'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Col, Row, Table } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { StatusDiv, StyledStatusIcon } from './styled'

const AddTeacherStatusModal = ({
  isVisible,
  onCancel,
  teacherDataSource,
  userRole,
  t,
}) => {
  const columns = [
    {
      title: t('users.student.studentdetail.name'),
      dataIndex: 'fullName',
      render: () => {
        return <div>Teacher name will be updated after first sign-up</div>
      },
    },
    {
      title: t('users.student.studentdetail.username'),
      dataIndex: 'username',
      render: (username) => <div>{username}</div>,
    },
    {
      title: t('users.student.studentdetail.status'),
      dataIndex: 'status',
      render: (status) => {
        let statusText = ''
        if (status === 'SUCCESS') {
          statusText = (
            <StatusDiv>
              <StyledStatusIcon type="check" iconColor={themeColor} />
              {t('users.student.studentdetail.usercreated')}
            </StatusDiv>
          )
        } else if (status === 'FAILED_USER_EXISTS') {
          statusText = (
            <StatusDiv>
              <StyledStatusIcon type="exclamation-circle" iconColor="#faad14" />
              {t('users.student.studentdetail.userexists')}
            </StatusDiv>
          )
        } else {
          statusText = (
            <StatusDiv>
              <StyledStatusIcon type="close-circle" iconColor="#f5222d" />
              {t('users.student.studentdetail.emailnotallowed')}
            </StatusDiv>
          )
        }
        return <>{statusText}</>
      },
    },
  ]

  const modifiedDataSource = teacherDataSource.map((item) => {
    const obj = {
      ...item,
      fullName: `${get(item, 'firstName', '')} ${get(
        item,
        'lastName',
        ''
      )}`.trim(),
      userRole,
    }
    return obj
  })
  return (
    <CustomModalStyled
      visible={isVisible}
      title="Teacher Details"
      onCancel={onCancel}
      centered
      width="60%"
      footer={[
        <EduButton
          height="40px"
          width="200px"
          data-cy="closeAddTeachersStatusModal"
          onClick={onCancel}
        >
          Done
        </EduButton>,
      ]}
    >
      <Row>
        <Col span={24}>
          <Table
            rowKey={(record) => record.userName}
            dataSource={modifiedDataSource}
            pagination={false}
            columns={columns}
          />
        </Col>
      </Row>
    </CustomModalStyled>
  )
}

export default AddTeacherStatusModal
