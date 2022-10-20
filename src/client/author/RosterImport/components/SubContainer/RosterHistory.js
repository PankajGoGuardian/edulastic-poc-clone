import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import {
  RosterHistoryWrapper,
  StyledHeading2,
  RecordTable,
  HistoryWrapper,
  HistoryWrapperChild,
  CompleteWrapper,
  StyledParagraph,
  StyledDiv,
  MetaDataOnTable,
  StyledCSVLink,
  StyledDownloadIcon,
} from './styled'
import { Table } from '../../../../admin/Common/StyledComponents/index'

const { Column } = Table
const RosterHistory = ({ rosterImportLog = [], summary = [] }) => {
  const getTime = (TS) => {
    return moment(TS).format('MMM DD YYYY hh:mm A')
  }
  return (
    <CompleteWrapper>
      <RosterHistoryWrapper>
        <StyledHeading2>Last Attempted Import</StyledHeading2>
        <MetaDataOnTable>
          <p>
            {summary.length ? summary?.[0]?.rawFileName : 'Roster - file name'}
          </p>
          <StyledParagraph>
            {summary.length
              ? getTime(summary?.[0]?.syncStartTS)
              : getTime(new Date().getTime())}
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
              dataIndex="errorLog"
              key="errorLog"
              width="2%"
              render={(text, record) => {
                return text.length ? (
                  <StyledCSVLink
                    data={text}
                    filename={record.recordType}
                    seperator=","
                  >
                    <StyledDownloadIcon />
                    Download Changes
                  </StyledCSVLink>
                ) : (
                  ''
                )
              }}
            />
          </Table>
        </RecordTable>
      </RosterHistoryWrapper>
      <HistoryWrapper>
        <h1>Roster Import History</h1>
        <HistoryWrapperChild>
          {summary.map((doc) => (
            <StyledDiv>
              <p>{doc.rawFileName}</p>
              <StyledParagraph>{getTime(doc.syncStartTS)}</StyledParagraph>
            </StyledDiv>
          ))}
        </HistoryWrapperChild>
      </HistoryWrapper>
    </CompleteWrapper>
  )
}

export default RosterHistory
