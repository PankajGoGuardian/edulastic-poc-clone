import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { CheckboxLabel } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import {
  isBoolean,
  keyBy,
  differenceWith,
  isEqual,
  omit,
  isUndefined,
  omitBy,
  isEmpty,
  pick,
} from 'lodash'
import produce from 'immer'
import { Col, Row } from 'antd'
import { SAVE_BUTTON_STATES } from '../ducks'
import { StyledAntdTable, SaveButton } from './styled'

const getClubbedValue = (prev = [], curr) => prev.concat(curr)

const getUpdatedValue = (isManageLicense, attr, userId, data, licenseId) =>
  produce(data, (draft) => {
    if (!draft[licenseId] && licenseId) {
      draft[licenseId] = {}
    }
    if (attr) {
      const key = 'userIdsToAdd'
      if (licenseId) {
        draft[licenseId][key] = getClubbedValue(draft[licenseId][key], userId)
      } else if (isManageLicense) {
        draft[key] = getClubbedValue(draft[key], userId)
      }
    } else {
      const key = 'userIdsToRemove'
      if (licenseId) {
        draft[licenseId][key] = getClubbedValue(draft[licenseId][key], userId)
      } else if (isManageLicense) {
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
  subType,
  isEdulasticAdminView,
  saveButtonState,
  setSaveButtonState,
}) => {
  const [currentUsers, setCurrentUsers] = useState(users)

  useEffect(() => {
    setCurrentUsers(users)
    setSaveButtonState(SAVE_BUTTON_STATES.NOT_VISIBLE)
  }, [users])

  const licenseIdsbyType = useMemo(
    () =>
      subsLicenses.reduce(
        (a, c) => ({
          ...a,
          // Picking the first license of its type as per current requirement
          [c.productType]: a[c.productType] ? a[c.productType] : c.licenseId,
        }),
        {}
      ),
    [subsLicenses]
  )

  const licenseOwnersMap = useMemo(
    () => subsLicenses.reduce((a, c) => ({ ...a, [c.ownerId]: true }), {}),
    [subsLicenses]
  )

  const keyedByUserId = useMemo(() => keyBy(users, 'userId'), [users])

  const isTeacherPremiumExists = useMemo(() => {
    return !isEmpty(
      dynamicColumns.find(({ dataIndex }) => dataIndex === 'PREMIUM')
    )
  }, [dynamicColumns])

  const onChangeHandler = (userId, key, isChecked) => {
    const newUsers = currentUsers.map((user) => {
      if (user.userId === userId) {
        const newUser = JSON.parse(JSON.stringify(user))
        if (
          key.startsWith('ITEM_BANK_') &&
          isChecked &&
          !newUser.PREMIUM &&
          isTeacherPremiumExists
        ) {
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
    // Pick only required fields to compare
    const fieldsToOmit = [
      'institutionIds',
      'fullName',
      'ownerLicenseIds',
      'role',
      'username',
      'userId',
      '_id',
      'districtId',
      'email',
      'expiresOn',
      'status',
    ]
    const stringInitialUsers = JSON.stringify(
      users.map((u) => omit(u, fieldsToOmit))
    )
    const stringNewUsers = JSON.stringify(
      newUsers.map((u) => omit(u, fieldsToOmit))
    )
    setCurrentUsers(newUsers)
    /**
     * convert to number from bool (hidden: 0, visible: 1)
     * not setting disabled here
     */
    setSaveButtonState(+(stringInitialUsers !== stringNewUsers))
  }

  const getCheckbox = (record, key) => {
    const { userId } = record
    const isOwnerForManageLicense =
      record.userId === currentUserId && key === 'hasManageLicense'

    // if user bought the license disable manage license checkbox
    const isOwner =
      licenseOwnersMap[record.userId] && key === 'hasManageLicense'

    const isUserAdmin =
      [roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN].includes(record.role) &&
      key !== 'hasManageLicense' &&
      subType !== 'enterprise'

    const disabled =
      (record[key]?.length && record[key] !== licenseIdsbyType[key]) ||
      isOwnerForManageLicense ||
      isOwner ||
      isUserAdmin
    const isChecked = record[key]
    const onChange = (e) => {
      const {
        target: { checked },
      } = e
      onChangeHandler(userId, key, checked)
    }

    return (
      <CheckboxLabel
        data-cy={`${key}_${record.email}Checkbox`}
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
        title: 'ROLE',
        dataIndex: 'role',
        key: 'role',
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

    setSaveButtonState(SAVE_BUTTON_STATES.DISABLED)
    let licensesPermission = {}
    let manageLicensePermission = {}
    const usersById = keyBy(users, 'userId')
    for (const permissions of changes) {
      const { hasManageLicense, userId } = permissions

      for (const type of Object.keys(
        pick(
          permissions,
          dynamicColumns.map(({ dataIndex }) => dataIndex)
        )
      )) {
        if (isBoolean(permissions[type]) && !type.startsWith(`TRIAL_`)) {
          licensesPermission = getUpdatedValue(
            false,
            permissions[type],
            userId,
            licensesPermission,
            permissions[type] ? licenseIdsbyType[type] : usersById[userId][type]
          )
        }
      }

      if (isBoolean(hasManageLicense)) {
        manageLicensePermission = getUpdatedValue(
          true,
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
      if (isEdulasticAdminView) {
        Object.assign(manageLicensePermission, {
          licenseIds: subsLicenses.map((x) => x.licenseId),
        })
      }
      apiData.manageLicensePermission = manageLicensePermission
    }
    const updatingUserIds = Object.values(licensesPermission).flatMap((x) =>
      (x.userIdsToAdd || []).concat(x.userIdsToRemove || [])
    )
    const fetchOrgSubscriptions = updatingUserIds.includes(currentUserId)
    bulkEditUsersPermission({
      apiData,
      licenseOwnerId,
      fetchOrgSubscriptions,
    })
  }

  const usersWithoutStudent = useMemo(
    () => currentUsers?.filter((user) => user?.role !== roleuser.STUDENT),
    [currentUsers]
  )

  return (
    <Row>
      <Col span={24}>
        <StyledAntdTable
          rowKey={(x) => x.userId}
          dataSource={usersWithoutStudent}
          columns={columns}
          pagination={false}
        />
      </Col>
      {saveButtonState !== SAVE_BUTTON_STATES.NOT_VISIBLE && (
        <Col span={2} offset={22}>
          <SaveButton
            data-cy="saveButton"
            disabled={saveButtonState === SAVE_BUTTON_STATES.DISABLED}
            onClick={onSaveHandler}
          >
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
