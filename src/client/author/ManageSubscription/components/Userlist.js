import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { CheckboxLabel } from '@edulastic/common'
import { isBoolean, keyBy, differenceWith, isEqual } from 'lodash'
import produce from 'immer'
import { Col, Row } from 'antd'
import { StyledAntdTable, SaveButton } from './styled'

const getClubbedValue = (prev = [], curr) => prev.concat(curr)

const getUpdatedValue = (attr, userId, data, licenseId) =>
  produce(data, (draft) => {
    if (!draft[licenseId] && licenseId) {
      draft[licenseId] = {}
    }
    if (attr) {
      const key = 'userIdsToAdd'
      if (licenseId) {
        draft[licenseId][key] = getClubbedValue(draft[licenseId][key], userId)
      } else {
        draft[key] = getClubbedValue(draft[key], userId)
      }
    } else {
      const key = 'userIdsToRemove'
      if (licenseId) {
        draft[licenseId][key] = getClubbedValue(draft[licenseId][key], userId)
      } else {
        draft[key] = getClubbedValue(draft[key], userId)
      }
    }
    return draft
  })

const Userlist = ({
  users,
  userId: currentUserId,
  bulkEditUsersPermission,
  teacherPremiumProductId,
  sparkMathProductId,
  subsLicenses,
}) => {
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)
  const [currentUsers, setCurrentUsers] = useState(users)
  useEffect(() => {
    setCurrentUsers(users)
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
      if ([linkedProductId, productId].includes(sparkMathProductId)) {
        _sparkMathLicenseId = licenseId
      }
    }
    return {
      premiumLicenseId: _premiumLicenseId,
      sparkMathLicenseId: _sparkMathLicenseId,
    }
  }, [subsLicenses, teacherPremiumProductId, sparkMathProductId])
  const onChangeHandler = (userId, fieldName, isChecked) => {
    const newUsers = currentUsers.map((user) => {
      if (user.userId === userId) {
        const newUser = JSON.parse(JSON.stringify(user))
        if (
          fieldName === 'hasSparkMath' &&
          isChecked &&
          !newUser.hasTeacherPremium
        ) {
          newUser.hasTeacherPremium = true
        }
        if (
          fieldName === 'hasTeacherPremium' &&
          !isChecked &&
          newUser.hasSparkMath
        ) {
          newUser.hasSparkMath = false
        }
        newUser[fieldName] = isChecked
        return newUser
      }
      return user
    })
    const stringInitialUsers = JSON.stringify(users)
    const stringNewUsers = JSON.stringify(newUsers)
    setCurrentUsers(newUsers)
    setIsSaveButtonVisible(stringInitialUsers !== stringNewUsers)
  }
  const onSaveHandler = () => {
    const keyedUsers = keyBy(users, 'userId')
    let changes = differenceWith(currentUsers, users, isEqual)
    changes = changes.map((change) => {
      const {
        userId,
        hasSparkMath,
        hasManageLicense,
        hasTeacherPremium,
      } = change
      const intialValues = keyedUsers[userId]
      const returnObject = {
        userId,
      }
      if (intialValues.hasSparkMath !== hasSparkMath) {
        returnObject.hasSparkMath = hasSparkMath
      }
      if (intialValues.hasManageLicense !== hasManageLicense) {
        returnObject.hasManageLicense = hasManageLicense
      }
      if (intialValues.hasTeacherPremium !== hasTeacherPremium) {
        returnObject.hasTeacherPremium = hasTeacherPremium
      }
      return returnObject
    })
    setIsSaveButtonDisabled(true)
    let licensesPermission = {}
    let manageLicensePermission = {}
    for (const permissions of changes) {
      const {
        hasTeacherPremium,
        hasSparkMath,
        hasManageLicense,
        userId,
      } = permissions
      if (isBoolean(hasTeacherPremium)) {
        licensesPermission = getUpdatedValue(
          hasTeacherPremium,
          userId,
          licensesPermission,
          premiumLicenseId
        )
      }
      if (isBoolean(hasSparkMath)) {
        licensesPermission = getUpdatedValue(
          hasSparkMath,
          userId,
          licensesPermission,
          sparkMathLicenseId
        )
      }
      if (isBoolean(hasManageLicense)) {
        manageLicensePermission = getUpdatedValue(
          hasManageLicense,
          userId,
          manageLicensePermission
        )
      }
    }
    const data = {}
    if (Object.keys(licensesPermission).length) {
      data.licensesPermission = licensesPermission
    }
    if (Object.keys(manageLicensePermission).length) {
      data.manageLicensePermission = manageLicensePermission
    }

    bulkEditUsersPermission(data)
  }

  const getCheckbox = (record, key) => {
    const { userId, hasTeacherPremium = '', hasSparkMath = '' } = record
    let disabled = false
    const isChecked = record[key]
    const onChange = (e) => {
      const {
        target: { checked },
      } = e
      onChangeHandler(userId, key, checked)
    }
    if (key === 'hasTeacherPremium') {
      disabled =
        hasTeacherPremium.length && hasTeacherPremium !== premiumLicenseId
    }
    if (key === 'hasSparkMath') {
      disabled = hasSparkMath.length && hasSparkMath !== sparkMathLicenseId
    }
    return (
      <CheckboxLabel
        onChange={onChange}
        checked={isChecked}
        disabled={
          disabled ||
          (record.userId === currentUserId && key === 'hasManageLicense')
        }
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
          dataSource={currentUsers}
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
