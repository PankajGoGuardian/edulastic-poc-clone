import React, { useState, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import { CSVLink } from 'react-csv'
import styled from 'styled-components'
import moment from 'moment'
import path from 'path'
import { Spin, Icon, Table } from 'antd'

import { EduButton, FlexContainer } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import {
  dashBorderColor,
  dragDropUploadText,
  greyThemeDark3,
  greyThemeLighter,
  themeColorBlue,
} from '@edulastic/colors'

const DropzoneUploader = ({ handleDrop, disabled = false }) => (
  <Dropzone
    onDrop={handleDrop}
    accept="text/*" // text/csv might not work for Windows based machines
    className="dropzone"
    activeClassName="active-dropzone"
    multiple={false}
    disabled={disabled}
  >
    {({ getRootProps, getInputProps, isDragActive }) => {
      return (
        <DropzoneContentContainer
          {...getRootProps()}
          className={`orders-dropzone ${
            isDragActive ? 'orders-dropzone--active' : ''
          }`}
          isDragActive={isDragActive}
        >
          <input {...getInputProps()} />
          <FlexContainer
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <IconUpload />
            <StyledText>Drag & Drop</StyledText>
            <StyledText isComment>
              {`or `}
              <Underlined>browse</Underlined>
              {` : ORDERS (CSV, 1MB Max.)`}
            </StyledText>
          </FlexContainer>
        </DropzoneContentContainer>
      )
    }}
  </Dropzone>
)

const columns = [
  {
    title: 'Status',
    dataIndex: 'message',
    key: 'message',
    align: 'left',
    width: 160,
  },
  {
    title: 'Project ID',
    dataIndex: 'projectId',
    key: 'projectId',
    width: 120,
  },
  {
    title: 'Project Name',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 200,
  },
  {
    title: 'Start Date',
    dataIndex: 'subStartDate',
    key: 'subStartDate',
    width: 120,
    render: (data) => moment(data).format('MM/DD/YYYY'),
  },
  {
    title: 'End Date',
    dataIndex: 'subEndDate',
    key: 'subEndDate',
    width: 120,
    render: (data) => moment(data).format('MM/DD/YYYY'),
  },
  {
    title: 'Scope',
    dataIndex: 'scope',
    key: 'scope',
    width: 120,
  },
  {
    title: 'CSM',
    dataIndex: 'customerSuccessManager',
    key: 'customerSuccessManager',
    width: 160,
  },
  {
    title: 'Opportunity ID',
    dataIndex: 'opportunityId',
    key: 'opportunityId',
    width: 120,
  },
  {
    title: 'License Count',
    dataIndex: 'licenceCount',
    key: 'licenceCount',
    width: 120,
  },
  {
    title: 'District',
    dataIndex: 'districtName',
    key: 'districtName',
    width: 200,
  },
  {
    title: 'District ID',
    dataIndex: 'districtId',
    key: 'districtId',
    width: 200,
  },
  {
    title: 'School',
    dataIndex: 'schoolName',
    key: 'schoolName',
    width: 200,
  },
  {
    title: 'School ID',
    dataIndex: 'schoolIds',
    key: 'schoolIds',
    width: 200,
    render: (data) => (data || [])[0] || 'NA',
  },
  {
    title: 'User ID',
    dataIndex: 'userIds',
    key: 'userIds',
    width: 200,
    render: (data) => (data || [])[0] || 'NA',
  },
  {
    title: 'Subscription Type',
    dataIndex: 'subType',
    key: 'subType',
    width: 160,
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    width: 200,
  },
]

const headers = columns.map(({ title, key }) => ({ label: title, key }))

const BulkUpgrade = ({
  bulkUpgradeByCSV,
  bulkUpgradeData: { loading, data, processedFile },
}) => {
  const [file, setFile] = useState(null)

  const processedFileName = useMemo(() => {
    const name = processedFile?.name || 'bulk-upgrade'
    const ext = path.extname(name)
    const basename = path.basename(name, ext)
    return `${basename}-processed.csv`
  }, [processedFile])

  return loading ? (
    <Spin />
  ) : (
    <FlexContainer flexDirection="column" marginLeft="40px" mr="40px">
      <DropzoneUploader handleDrop={([f]) => setFile(f)} />
      <FlexContainer alignItems="center" justifyContent="center">
        {file && (
          <>
            <Icon
              type="file-text"
              theme="filled"
              style={{ fill: greyThemeDark3, fontSize: '18px' }}
            />
            <StyledText style={{ color: greyThemeDark3, marginLeft: '10px' }}>
              {file.name}
            </StyledText>
            <EduButton
              btnType="primary"
              isBlue
              ml="40px"
              height="30px"
              onClick={() => bulkUpgradeByCSV(file)}
              disabled={file?.name === processedFile?.name}
            >
              Upgrade
            </EduButton>
          </>
        )}
        {data?.length ? (
          <CSVLink
            data={data}
            filename={processedFileName}
            seperator=","
            headers={headers}
            target="_blank"
          >
            <EduButton
              btnType="primary"
              isBlue
              ml="10px"
              height="30px"
              disabled={!data?.length}
            >
              Download CSV
            </EduButton>
          </CSVLink>
        ) : null}
      </FlexContainer>
      {data?.length ? (
        <TableContainer>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: '100%' }}
          />
        </TableContainer>
      ) : null}
    </FlexContainer>
  )
}

export default BulkUpgrade

const DropzoneContentContainer = styled.div`
  margin: 20px 0;
  padding: 50px;
  border-radius: 2px;
  border: ${({ isDragActive }) =>
    isDragActive
      ? `2px solid ${themeColorBlue}`
      : `1px dashed ${dashBorderColor}`};
  background: ${greyThemeLighter};
  svg {
    margin-bottom: 12px;
    width: 35px;
    height: 30px;
    fill: ${({ isDragActive }) =>
      isDragActive ? themeColorBlue : dragDropUploadText};
  }
  &:hover {
    border: 1px dashed ${greyThemeDark3};
    svg {
      fill: ${greyThemeDark3};
    }
  }
`

const TableContainer = styled.div`
  margin: 20px 0;
  font-size: 9px !important;
  th {
    margin: 0px;
    padding: 10px 5px !important;
  }
  td {
    margin: 0px;
    padding: 5px !important;
  }
`

const StyledText = styled.div`
  font-size: ${({ isComment }) => (isComment ? 11 : 14)}px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${dragDropUploadText};
  margin-top: ${({ isComment }) => (isComment ? 10 : 0)}px;
`

const Underlined = styled.span`
  color: ${themeColorBlue};
  cursor: pointer;
  text-decoration: underline;
`
