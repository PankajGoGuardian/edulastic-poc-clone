import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { stringCompare } from '@edulastic/constants/reportUtils/common'
import moment from 'moment'
import { Tooltip } from 'antd'
import {
  RosterHistoryWrapper,
  StyledHeading2,
  RecordTable,
  HistoryWrapperChild,
  CompleteWrapper,
  StyledParagraph,
  MetaDataOnTable,
  StyledButton,
  StyledDownloadIcon,
} from './styled'
import { Table } from '../../../../admin/Common/StyledComponents/index'

const { Column } = Table
const RosterHistory = ({
  rosterImportLog = [],
  summary = [],
  downloadCsvErrorData,
}) => {
  const getModifiedFileName = (fileName = '') => {
    let modifiedFileName = fileName
    if (fileName.length > 30) {
      modifiedFileName = `${fileName.slice(0, 27)}...`
    }
    return (
      <Tooltip title={fileName}>
        <p>{modifiedFileName}</p>
      </Tooltip>
    )
  }
  const getModifiedEntityName = (entityName) => {
    const map = {
      school: 'Schools',
      class: 'Sections',
      user: 'Users',
      enrollment: 'Enrollments',
      course: 'Courses',
    }
    return map[entityName]
  }

  const getTime = (TS) => {
    return moment(TS).format('MMM DD YYYY hh:mm A')
  }

  return (
    <CompleteWrapper>
      <RosterHistoryWrapper>
        <StyledHeading2 bold="700">Import Summary</StyledHeading2>
        <MetaDataOnTable>
          {getModifiedFileName(
            summary.length ? summary?.[0]?.zipFileName : 'NA'
          )}
          <StyledParagraph ml="30px">
            {summary.length
              ? getTime(summary?.[0]?.syncStartTS)
              : '-- / -- / --'}
          </StyledParagraph>
        </MetaDataOnTable>
        <RecordTable>
          <Table
            rowKey={(record) => record.key}
            dataSource={rosterImportLog}
            pagination={false}
          >
            <Column
              title="Record Type"
              dataIndex="recordType"
              key="recordType"
              width="10%"
              render={(text) => getModifiedEntityName(text)}
              sorter={(a, b) =>
                stringCompare(
                  getModifiedEntityName(a.recordType),
                  getModifiedEntityName(b.recordType)
                )
              }
            />
            <Column
              title="Total Count"
              dataIndex="totalCount"
              key="totalCount"
              width="10%"
              sorter={(a, b) => a.totalCount - b.totalCount}
            />
            <Column
              title="Modified Count"
              dataIndex="createdCount"
              key="createdCount"
              width="12%"
              sorter={(a, b) => a.createdCount - b.createdCount}
            />
            <Column
              title="Failed Count"
              dataIndex="errorCount"
              key="errorCount"
              width="10%"
              sorter={(a, b) => a.errorCount - b.errorCount}
              render={(text) => {
                const showExclaimationIcon = parseInt(text, 10) > 0
                return {
                  props: {
                    style: {
                      color: parseInt(text, 10) > 0 ? 'orange' : 'black',
                    },
                  },
                  children: (
                    <div>
                      {text}
                      {showExclaimationIcon && (
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ),
                }
              }}
            />
            <Column
              title=""
              dataIndex="errorCount"
              key="downloadError"
              width="15%"
              render={(val, record) => {
                return val ? (
                  <StyledButton
                    type="link"
                    onClick={() =>
                      downloadCsvErrorData({
                        entity: record.recordType,
                        timestamp: summary?.[0].syncStartTS,
                        fileName: `${record.recordType}.csv`,
                      })
                    }
                  >
                    <StyledDownloadIcon /> Download Changes
                  </StyledButton>
                ) : (
                  ''
                )
              }}
            />
          </Table>
        </RecordTable>
      </RosterHistoryWrapper>
      <HistoryWrapperChild>
        <StyledHeading2 bold="700">Recent Imports</StyledHeading2>
        <RecordTable>
          <Table
            rowKey={(record) => record.key}
            dataSource={summary}
            pagination={false}
          >
            <Column
              title="File Name"
              dataIndex="zipFileName"
              key="zipFileName"
              width="2%"
              sorter={(a, b) => stringCompare(a.zipFileName, b.zipFileName)}
              render={(text) => {
                return getModifiedFileName(text)
              }}
            />
            <Column
              title="Date and Time"
              dataIndex="syncStartTS"
              key="syncStartTS"
              width="1.5%"
              sorter={(a, b) => a.syncStartTS - b.syncStartTS}
              render={(text) => {
                return getTime(text)
              }}
            />
          </Table>
        </RecordTable>
      </HistoryWrapperChild>
    </CompleteWrapper>
  )
}

export default RosterHistory
