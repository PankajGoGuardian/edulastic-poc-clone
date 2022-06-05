import { userPermissions } from '@edulastic/constants'

export const daRoleList = [
  {
    label: 'District Admin only',
    value: '-',
    tooltipTitle:
      'This district admin user cannot access data warehouse feature.',
  },
  {
    label: 'Data Warehouse upload only',
    value: userPermissions.DATA_OPS_ONLY,
    tooltipTitle:
      'This district admin can only upload data to data warehouse feature. No access is given to district menu and insights.',
  },
  {
    label: 'District Admin and Data Warehouse insights user',
    value: userPermissions.DATA_OPS,
    tooltipTitle:
      'This district admin user has full access to data warehouse upload and insight feature.',
  },
]
