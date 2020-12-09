import React from 'react'
import { capitalize } from 'lodash'
import Button from "antd/es/button";
import Table from "antd/es/table";
import { deleteRed, themeColor } from '@edulastic/colors'
import { IconPencilEdit } from '@edulastic/icons'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  getCustomReportList,
  updatePermissionStatusAction,
} from '../CustomReportContainer/ducks'
import { StyledTableButton } from '../../../common/styled'

const CustomReportTable = ({
  customReportData = [],
  updatePermissionStatus,
  showEditModal,
  selectedDistrictId,
}) => {
  const onToggle = (id) => {
    const reportData = customReportData.find((report) => report._id === id)
    const { _id, permissions } = reportData
    updatePermissionStatus({
      _id,
      enable: !permissions?.[0].enabled,
      permissionIds: permissions.map((o) => o._id),
      districtId: selectedDistrictId,
    })
  }
  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'title',
      key: 'name',
    },
    {
      title: 'Access Level',
      dataIndex: 'permissions',
      key: 'accessLevel',
      render: (permissions) => {
        let orgType = permissions?.[0].orgType
        if (orgType === 'role') {
          const roles = permissions.map((o) =>
            o.permissionLevel === 'district-admin'
              ? `District Admin`
              : o.permissionLevel === 'school-admin'
              ? `School Admin`
              : 'Teacher'
          )
          orgType = `${capitalize(orgType)} [ ${roles.join(', ')} ]`
        } else {
          orgType = capitalize(orgType)
        }
        return <span>{orgType}</span>
      },
    },
    {
      title: 'Status',
      dataIndex: 'archived',
      key: 'archived',
      render: (archived) =>
        archived === false ? (
          <span style={{ color: themeColor }}>ACTIVE</span>
        ) : (
          <span style={{ color: deleteRed }}>DISABLED</span>
        ),
    },
    {
      title: 'Actions',
      dataIndex: 'permissions',
      key: 'action',
      render: (permissions, record) => {
        const enabled = permissions?.[0].enabled
        return (
          <>
            <StyledEditButton
              onClick={() => showEditModal('edit', record._id)}
              title="Edit"
            >
              <IconPencilEdit color={themeColor} />
            </StyledEditButton>
            <StyledButton onClick={() => onToggle(record._id)}>
              {enabled === false ? 'ENABLE' : 'DISABLE'}
            </StyledButton>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <Table
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={customReportData}
        pagination={false}
        bordered
      />
    </div>
  )
}
const mapStateToProps = (state) => ({
  customReportList: getCustomReportList(state),
})

const withConnect = connect(mapStateToProps, {
  updatePermissionStatus: updatePermissionStatusAction,
})

export default compose(withConnect)(CustomReportTable)

const StyledButton = styled(Button)`
  color: themeColor;
  border-color: themeColor;
`

const StyledEditButton = styled(StyledTableButton)`
  opacity: 1;
`
