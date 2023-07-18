import { userPermissions } from '@edulastic/constants'

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
  'super-admin': 'Super Admin',
  'data-ops': 'Data Operations',
  data_ops_only: 'Data Operations Only',
  data_warehouse_reports: 'Data Studio Reports',
  insights_only: 'Insights Only',
}
