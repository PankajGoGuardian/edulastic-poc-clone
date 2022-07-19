import { userPermissions } from '@edulastic/constants'

export const daRoleList = [
  {
    label: 'District Admin',
    value: '-',
    tooltipTitle:
      'This district admin user cannot access data warehouse feature.',
  },
  {
    label: 'Data Manager',
    value: userPermissions.DATA_OPS_ONLY,
    tooltipTitle:
      'This district admin can only upload data to data warehouse feature. No access is given to district menu and insights.',
  },
  {
    label: 'District Data Admin',
    value: userPermissions.DATA_OPS,
    tooltipTitle:
      'This district admin user has full access to data warehouse upload and insight feature.',
  },
]
