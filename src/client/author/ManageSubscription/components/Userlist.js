import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { CheckboxLabel } from '@edulastic/common'
import {
  isBoolean,
  keyBy,
  differenceWith,
  isEqual,
  omit,
  isUndefined,
  omitBy,
} from 'lodash'
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
  currentUserId,
  bulkEditUsersPermission,
  subsLicenses = [],
  dynamicColumns = [],
  licenseOwnerId,
}) => {
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)
  const [currentUsers, setCurrentUsers] = useState(users)

  useEffect(() => {
    setCurrentUsers(users)
    setIsSaveButtonVisible(false)
    setIsSaveButtonDisabled(false)
  }, [users])

  const licenseIdsbyType = useMemo(
    () =>
      subsLicenses.reduce(
        (a, c) => ({ ...a, [c.productType]: c.licenseId }),
        {}
      ),
    [subsLicenses]
  )

  const keyedByUserId = useMemo(() => keyBy(users, 'userId'), [users])

  const onChangeHandler = (userId, key, isChecked) => {
    const newUsers = currentUsers.map((user) => {
      if (user.userId === userId) {
        const newUser = JSON.parse(JSON.stringify(user))
        if (key.startsWith('ITEM_BANK_') && isChecked && !newUser.PREMIUM) {
          newUser.PREMIUM = keyedByUserId[userId].PREMIUM || true
        }

        const itemBanks = omit(newUser, [
          'PREMIUM',
          'email',
          'expiresOn',
          'hasManageLicense',
          'userId',
          'username',
          '_id',
        ])
        const itemBankKeys = Object.keys(itemBanks)
        if (
          key === 'PREMIUM' &&
          !isChecked &&
          itemBankKeys.some((x) => newUser[x])
        ) {
          itemBankKeys.forEach((x) => {
            if (newUser[x]) {
              newUser[x] = keyedByUserId[userId][x]
                ? false
                : keyedByUserId[userId][x]
            }
          })
        }
        /**
         *  If checked then get the licenseId from user or fallback to the incomming value
         *  if unchecked then check if licenseId exists
         *    - if it exists then set as unchecked
         *    - if it doesn't exist then remove the attr by setting undefined
         */
        if (isChecked) {
          newUser[key] = keyedByUserId[userId][key] || isChecked
        } else {
          newUser[key] = keyedByUserId[userId][key]
            ? isChecked
            : keyedByUserId[userId][key]
        }
        return omitBy(newUser, isUndefined)
      }
      return user
    })
    const stringInitialUsers = JSON.stringify(users)
    const stringNewUsers = JSON.stringify(newUsers)
    setCurrentUsers(newUsers)
    setIsSaveButtonVisible(stringInitialUsers !== stringNewUsers)
  }

  const getCheckbox = (record, key) => {
    const { userId } = record
    const isOwnerForManageLicense =
      record.userId === currentUserId && key === 'hasManageLicense'
    const disabled =
      (record[key]?.length && record[key] !== licenseIdsbyType[key]) ||
      isOwnerForManageLicense
    const isChecked = record[key]
    const onChange = (e) => {
      const {
        target: { checked },
      } = e
      onChangeHandler(userId, key, checked)
    }

    return (
      <CheckboxLabel
        onChange={onChange}
        checked={isChecked}
        disabled={disabled}
      />
    )
  }

  const columns = useMemo(() => {
    const _dynamicColumns = dynamicColumns.map((column) => ({
      ...column,
      key: column.dataIndex,
      sorter: (a, b) => a[column.type]?.localeCompare(b[column.type]),
      render: (_, record) => getCheckbox(record, column.dataIndex),
    }))

    return [
      {
        title: 'USERNAME',
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.username?.localeCompare(b.username),
      },
      {
        title: 'EMAIL',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email?.localeCompare(b.email),
      },
      {
        title: 'EXPIRATION DATE',
        dataIndex: 'expiresOn',
        key: 'expiresOn',
        sorter: (a, b) => a.expiresOn?.localeCompare(b.expiresOn),
        render: (exipiresOn) =>
          exipiresOn === '-'
            ? exipiresOn
            : moment(exipiresOn).format('MMM DD, YYYY'),
      },
      ..._dynamicColumns,
      {
        title: 'MANAGE LICENSES',
        dataIndex: 'hasManageLicense',
        key: 'actionAdmin',
        sorter: (a, b) => a.hasManageLicense - b.hasManageLicense,
        render: (_, record) => getCheckbox(record, 'hasManageLicense'),
      },
    ]
  }, [dynamicColumns, users, currentUsers])

  const onSaveHandler = () => {
    const keyedUsers = keyBy(users, 'userId')
    let changes = differenceWith(currentUsers, users, isEqual)
    changes = changes.map((change) => {
      const { userId } = change
      const intialValues = keyedUsers[userId]
      const returnObject = {
        userId,
      }

      const keyMap = omit(change, ['userId'])

      Object.keys(keyMap).forEach((x) => {
        if (intialValues[x] !== change[x]) {
          returnObject[x] = change[x]
        }
      })

      return returnObject
    })

    setIsSaveButtonDisabled(true)
    let licensesPermission = {}
    let manageLicensePermission = {}
    let rowUserId = ''
    for (const permissions of changes) {
      const { hasManageLicense, userId } = permissions
      rowUserId = userId

      for (const type of Object.keys(
        omit(permissions, ['userId', 'hasManageLicense'])
      )) {
        if (isBoolean(permissions[type])) {
          licensesPermission = getUpdatedValue(
            permissions[type],
            userId,
            licensesPermission,
            licenseIdsbyType[type]
          )
        }
      }

      if (isBoolean(hasManageLicense)) {
        manageLicensePermission = getUpdatedValue(
          hasManageLicense,
          userId,
          manageLicensePermission
        )
      }
    }
    const apiData = {}
    if (Object.keys(licensesPermission).length) {
      apiData.licensesPermission = licensesPermission
    }
    if (Object.keys(manageLicensePermission).length) {
      apiData.manageLicensePermission = manageLicensePermission
    }

    const fetchOrgSubscriptions = rowUserId === currentUserId
    bulkEditUsersPermission({
      apiData,
      licenseOwnerId,
      fetchOrgSubscriptions,
    })
  }

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
