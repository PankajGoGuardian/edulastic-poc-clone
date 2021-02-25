import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { CheckboxLabel } from '@edulastic/common'
import { isUndefined, isEmpty, isObject, isBoolean } from 'lodash'
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
  licenseIds,
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
    let licensesPermission = {}
    let manageLicensePermission = {}

    for (const [userId, permissions] of Object.entries(changes)) {
      const { hasTeacherPremium, hasSparkMath, hasManageLicense } = permissions

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

    bulkEditUsersPermission({
      licensesPermission,
      manageLicensePermission,
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
    const { userId, hasTeacherPremium = '', hasSparkMath = '' } = record
    let disabled = false
    const isChecked = getXOR(
      getChange(record[key]),
      !isUndefined(changes[userId]?.[key])
    )
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
