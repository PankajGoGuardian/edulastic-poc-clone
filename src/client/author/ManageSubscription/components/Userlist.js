import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckboxLabel, EduButton } from '@edulastic/common'
import { isUndefined, isEmpty } from 'lodash'
import produce from 'immer'
import { Col, Row } from 'antd'
import { StyledAntdTable } from './styled'

const Userlist = ({ users }) => {
  const [changes, setChanges] = useState({})
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false)

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
    console.log(changes)
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
      dataIndex: 'expireOn',
      key: 'expireOn',
    },
    {
      title: 'TEACHER PREMIUM',
      dataIndex: 'hasPremium',
      key: 'actionPremium',
      render: (_, record) => getCheckbox(record, 'hasPremium'),
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
