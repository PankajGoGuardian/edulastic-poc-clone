import { roleuser, userPermissions } from '@edulastic/constants'
import { useEffect, useRef } from 'react'

export const getDate = () => {
  const currentDate = new Date()
  const oneYearDate = new Date(
    new Date().setFullYear(currentDate.getFullYear() + 1)
  )
  return {
    currentDate: currentDate.getTime(),
    oneYearDate: oneYearDate.getTime(),
  }
}

// a custom effect which does not run after the initial render, but runs on every subsequent render
export function useUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) fn()
    else didMountRef.current = true
  }, inputs)
}

export const isEASuperAdmin = (permissions, role) =>
  role === roleuser.EDULASTIC_ADMIN &&
  permissions.includes(userPermissions.SUPER_ADMIN)

const findPermissionExpiry = (permissionsExpiry, permission) => {
  return permissionsExpiry.find((item) => item.permissionKey === permission)
}

const findPermission = (permissions, permission) => {
  return permissions.includes(permission)
}

const removePermissionExpiry = (permissionsExpiry, permission) => {
  return permissionsExpiry.filter((item) => item.permissionKey !== permission)
}

const removePermission = (permissions, permission) => {
  return permissions.filter((item) => item !== permission)
}

const addDataStudio = ({
  permissions,
  permissionsExpiry,
  perStartDate,
  perEndDate,
}) => {
  const updateData = {
    permissions,
    permissionsExpiry,
  }

  const dataStudioPermissionExist = findPermission(
    updateData.permissions,
    userPermissions.DATA_WAREHOUSE_REPORTS
  )

  // add data_warehouse_reports permission if not exist
  if (!dataStudioPermissionExist) {
    updateData.permissions.push(userPermissions.DATA_WAREHOUSE_REPORTS)
  }

  // if start and end date is provided
  if (perStartDate && perEndDate) {
    // find permission expiry for data_warehouse_reports
    const foundDataStudioPermissionExpiry = findPermissionExpiry(
      updateData.permissionsExpiry,
      userPermissions.DATA_WAREHOUSE_REPORTS
    )

    // update dates if permission expiry exist
    if (foundDataStudioPermissionExpiry) {
      foundDataStudioPermissionExpiry.perStartDate = perStartDate
      foundDataStudioPermissionExpiry.perEndDate = perEndDate
    }
    // add permission expiry if does not exist
    else {
      updateData.permissionsExpiry.push({
        permissionKey: userPermissions.DATA_WAREHOUSE_REPORTS,
        perStartDate,
        perEndDate,
      })
    }
  }
  // remove permission expiry if date is not provided
  else {
    updateData.permissionsExpiry = removePermissionExpiry(
      updateData.permissionsExpiry,
      userPermissions.DATA_WAREHOUSE_REPORTS
    )
  }

  return updateData
}

// if data studio is disabled then remove data studio permission and permission expiry for data studio
const removeDataStudio = ({ permissions, permissionsExpiry }) => {
  const updateData = {
    permissions,
    permissionsExpiry,
  }

  updateData.permissions = removePermission(
    updateData.permissions,
    userPermissions.DATA_WAREHOUSE_REPORTS
  )
  updateData.permissionsExpiry = removePermissionExpiry(
    updateData.permissionsExpiry,
    userPermissions.DATA_WAREHOUSE_REPORTS
  )

  return updateData
}

export const updateDataStudioPermission = ({
  isDataStudio,
  permissions,
  permissionsExpiry,
  perStartDate,
  perEndDate,
}) => {
  // if data studio is enabled
  if (isDataStudio) {
    return addDataStudio({
      permissions,
      permissionsExpiry,
      perStartDate,
      perEndDate,
    })
  }

  return removeDataStudio({ permissions, permissionsExpiry })
}
