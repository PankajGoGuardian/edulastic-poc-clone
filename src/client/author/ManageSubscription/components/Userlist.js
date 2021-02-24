import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { CheckboxLabel, EduButton } from '@edulastic/common'
import { isUndefined, isEmpty, isObject } from 'lodash'
import produce from 'immer'
import { Col, Row } from 'antd'
import { StyledAntdTable, SaveButton } from './styled'

const Userlist = ({
  users,
  userId: currentUserId,
  bulkEditUsersPermission,
  teacherPremiumProductId,
  sparkMathProductId,
  subsLicenses,
}) => {
  const [changes, setChanges] = useState({})
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)

  useEffect(() => {
    setChanges({})
    setIsSaveButtonVisible(false)
    setIsSaveButtonDisabled(false)
  }, [users])

  const { premiumLicenseId, sparkMathLicenseId } = useMemo(() => {
    let _premiumLicenseId = null
    let _sparkMathLicenseId = null
    for (const { productId, linkedProductId, licenseId } of subsLicenses) {
      if (productId === teacherPremiumProductId) {
        _premiumLicenseId = licenseId
      }
      if (linkedProductId === sparkMathProductId) {
        _sparkMathLicenseId = licenseId
      }
    }
    return {
      premiumLicenseId: _premiumLicenseId,
      sparkMathLicenseId: _sparkMathLicenseId,
    }
  }, [subsLicenses, teacherPremiumProductId, sparkMathProductId])

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
    setIsSaveButtonDisabled(true)
    // TODO: fix the usersPermission so that the segregation in BE can be removed
    // maybe create a map based on license or productId
    bulkEditUsersPermission({
      usersPermission: changes,
      teacherPremiumProductId,
      sparkMathProductId,
    })
  }

  const getXOR = (a, b) => (a || b) && !(a && b)

  const getChange = (record) => {
    if (isObject(record)) {
      return record?.some((x) =>
        [premiumLicenseId, sparkMathLicenseId].includes(x)
      )
    }
    return record
  }

  const getCheckbox = (record, key) => {
    let disabled = false
    const isChecked = getXOR(
      getChange(record[key]),
      !isUndefined(changes[record.userId]?.[key])
    )
    const onChange = (e) => {
      const {
        target: { checked },
      } = e
      onChangeHandler(record.userId, key, checked)
    }
    if (key === 'hasTeacherPremium') {
      disabled =
        record.hasTeacherPremium.length &&
        record.hasTeacherPremium !== premiumLicenseId
    }
    if (key === 'hasSparkMath') {
      disabled =
        record.hasSparkMath.length && record.hasSparkMath !== sparkMathLicenseId
    }
    return (
      <CheckboxLabel
        onChange={onChange}
        checked={isChecked}
        disabled={disabled || (record.userId === currentUserId && key === 'hasManageLicense')}
      />
    )
  }

  const columns = [
    {
      title: 'USERNAME',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'EXPIRATION DATE',
      dataIndex: 'expiresOn',
      key: 'expiresOn',
      sorter: true,
      render: (exipiresOn) =>
        exipiresOn === '-'
          ? exipiresOn
          : moment(exipiresOn).format('MMM DD, YYYY'),
    },
    {
      title: 'TEACHER PREMIUM',
      dataIndex: 'hasTeacherPremium',
      key: 'actionPremium',
      sorter: true,
      render: (_, record) => getCheckbox(record, 'hasTeacherPremium'),
    },
    {
      title: 'SPARK MATH',
      dataIndex: 'hasSparkMath',
      key: 'actionSparkMath',
      sorter: true,
      render: (_, record) => getCheckbox(record, 'hasSparkMath'),
    },
    {
      title: 'MANAGE LICENSES',
      dataIndex: 'hasManageLicense',
      key: 'actionAdmin',
      sorter: true,
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
          <SaveButton disabled={isSaveButtonDisabled} onClick={onSaveHandler}>
            Save
          </SaveButton>
        </Col>
      )}
    </Row>
  )
}

Userlist.propTypes = {
  users: PropTypes.object.isRequired,
}

export default Userlist
