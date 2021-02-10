import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, EduButton } from '@edulastic/common'
import { isEmpty } from 'lodash'
import produce from 'immer'
import { Col, Row } from 'antd'
import { StyledAntdTable } from './styled'

const Userlist = ({ users }) => {
  const [changes, setChanges] = useState({})
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false)

  const onChangeHandler = (userId, fieldName) => {
    const newChanges = produce(changes, (draft) => {
      if (!draft[userId]) {
        draft[userId] = {}
        draft[userId][fieldName] = true
        return
      }

      if (!draft[userId][fieldName]) {
        draft[userId][fieldName] = true
        return
      }

      if (draft[userId][fieldName]) {
        delete draft[userId][fieldName]
        isEmpty(draft[userId])
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
    const checked = getXOR(record[key], changes[record.userId]?.[key])
    const onChange = () => onChangeHandler(record.userId, key)
    return <Checkbox onChange={onChange} checked={checked} />
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
      dataIndex: 'isAdmin',
      key: 'actionAdmin',
      render: (_, record) => getCheckbox(record, 'isAdmin'),
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
