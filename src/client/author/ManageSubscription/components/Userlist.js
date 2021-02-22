import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CheckboxLabel, EduButton } from '@edulastic/common'
import { isUndefined, isEmpty } from 'lodash'
import produce from 'immer'
import { Col, Row } from 'antd'
import { StyledAntdTable } from './styled'

const Userlist = ({
  users,
  bulkEditUsersPermission,
  teacherPremiumProductId,
  sparkMathProductId,
}) => {
  const [changes, setChanges] = useState({})
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false)

  useEffect(() => {
    setChanges({})
  }, [users])

  const onChangeHandler = (userId, fieldName, isChecked) => {
    const newChanges = produce(changes, (draft) => {
      if (isUndefined(draft[userId])) {
        draft[userId] = {}
        draft[userId][fieldName] = isChecked
        return
      }

      if (isUndefined(draft[userId][fieldName])) {
        draft[userId][fieldName] = isChecked
        return
      }

      if (!isUndefined(draft[userId][fieldName])) {
        delete draft[userId][fieldName]
      }

      if (isEmpty(draft[userId])) {
        delete draft[userId]
      }
    })
    setChanges(newChanges)
    setIsSaveButtonVisible(!isEmpty(newChanges))
  }

  const onSaveHandler = () => {
    // TODO: fix the usersPermission so that the segregation in BE can be removed
    // maybe create a map based on license or productId
    bulkEditUsersPermission({
      usersPermission: changes,
      teacherPremiumProductId,
      sparkMathProductId,
    })
  }

  const getXOR = (a, b) => (a || b) && !(a && b)

  const getCheckbox = (record, key) => {
    const isChecked = getXOR(
      record[key],
      !isUndefined(changes[record.userId]?.[key])
    )
    const onChange = (e) => {
      const {
        target: { checked },
      } = e
      onChangeHandler(record.userId, key, checked)
    }
    return <CheckboxLabel onChange={onChange} checked={isChecked} />
  }

  const columns = [
    {
      title: 'USERNAME',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'EXPIRATION DATE',
      dataIndex: 'expiresOn',
      key: 'expiresOn',
    },
    {
      title: 'TEACHER PREMIUM',
      dataIndex: 'hasTeacherPremium',
      key: 'actionPremium',
      render: (_, record) => getCheckbox(record, 'hasTeacherPremium'),
    },
    {
      title: 'SPARK MATH',
      dataIndex: 'hasSparkMath',
      key: 'actionSparkMath',
      render: (_, record) => getCheckbox(record, 'hasSparkMath'),
    },
    {
      title: 'MANAGE LICENSES',
      dataIndex: 'hasManageLicense',
      key: 'actionAdmin',
      render: (_, record) => getCheckbox(record, 'hasManageLicense'),
    },
  ]

  return (
    <Row>
      <Col span={24}>
        <StyledAntdTable
          rowKey={(x) => x.userId}
          dataSource={users}
          columns={columns}
          pagination={false}
        />
      </Col>
      {isSaveButtonVisible && (
        <Col span={2} offset={22}>
          <EduButton onClick={onSaveHandler}>Save</EduButton>
        </Col>
      )}
    </Row>
  )
}

Userlist.propTypes = {
  users: PropTypes.object.isRequired,
}

export default Userlist
