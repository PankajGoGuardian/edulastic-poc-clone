import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { Tooltip } from 'antd'
import {
  RosterHistoryWrapper,
  StyledHeading2,
  RecordTable,
  HistoryWrapperChild,
  CompleteWrapper,
  StyledParagraph,
  StyledDiv,
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
        <StyledHeading2 bold="700">Last Attempted Import</StyledHeading2>
        <MetaDataOnTable>
          {getModifiedFileName(
            summary.length ? summary?.[0]?.zipFileName : 'NA'
          )}
          <StyledParagraph>
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
              width="1%"
              render={(text) => getModifiedEntityName(text)}
            />
            <Column
              title="Entity Count"
              dataIndex="totalCount"
              key="totalCount"
              width="1%"
            />
            <Column
              title="Created / Updated Count"
              dataIndex="createdCount"
              key="createdCount"
              width="1.7%"
            />
            <Column
              title="Failed Count"
              dataIndex="errorCount"
              key="errorCount"
              width="1%"
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
              width="2%"
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
      <div>
        <StyledHeading2>Roster Import History</StyledHeading2>
        <HistoryWrapperChild>
          {summary.map((doc) => (
            <StyledDiv>
              {getModifiedFileName(doc.zipFileName)}
              <StyledParagraph>{getTime(doc.syncStartTS)}</StyledParagraph>
            </StyledDiv>
          ))}
        </HistoryWrapperChild>
      </div>
    </CompleteWrapper>
  )
}

export default RosterHistory
