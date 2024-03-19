import { userPermissions } from '@edulastic/constants'
import {
  DATA_OPS,
  DATA_OPS_ONLY,
  DATA_WAREHOUSE_REPORTS,
  INSIGHTS_ONLY,
  SUPER_ADMIN,
} from '@edulastic/constants/const/userPermissions'

export const daRoleList = [
  {
    label: 'District Admin',
    value: '-',
    tooltipTitle:
      'This district admin user cannot access data studio upload feature.',
  },
  {
    label: 'Data Operations ',
    value: userPermissions.DATA_OPS_ONLY,
    tooltipTitle:
      'This district admin can only upload data to data studio feature. No access is given to district menu and insights.',
  },
  {
    label: 'District Admin and Data Operations',
    value: userPermissions.DATA_OPS,
    tooltipTitle:
      'This district admin user has full access to data studio upload and insight feature.',
  },
]

export const daPermissionsMap = {
  [SUPER_ADMIN]: 'Super Admin',
  [DATA_OPS]: 'Data Operations',
  [DATA_OPS_ONLY]: 'Data Operations Only',
  [DATA_WAREHOUSE_REPORTS]: 'Data Studio Reports',
  [INSIGHTS_ONLY]: 'Insights Only',
}

export const canEnableInsightOnly = (existingPermissions) => {
  return ![
    userPermissions.SUPER_ADMIN,
    userPermissions.DATA_OPS,
    userPermissions.DATA_OPS_ONLY,
  ].some((permission) => existingPermissions.includes(permission))
}

export const dataOpsRoleSelected = (selectedRoles) => {
  return [
    userPermissions.DATA_OPS,
    userPermissions.DATA_OPS_ONLY,
  ].some((permission) => selectedRoles.includes(permission))
}
