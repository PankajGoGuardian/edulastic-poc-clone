import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
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
} from './styled'
import { Table } from '../../../../admin/Common/StyledComponents/index'

const { Column } = Table
const RosterHistory = (props) => {
  const { rosterImportLog = [] } = props
  const data = rosterImportLog
  return (
    <CompleteWrapper>
      <RosterHistoryWrapper>
        <StyledHeading2>Last Attempted Import</StyledHeading2>
        <MetaDataOnTable>
          <p>Roster - file name</p>
          <p>24 August 2022</p>
          <p>3:14pm</p>
        </MetaDataOnTable>
        <RecordTable>
          <Table
            rowKey={(record) => record.key}
            dataSource={data}
            pagination={false}
          >
            <Column
              title="Record Type"
              dataIndex="recordType"
              key="recordType"
              width="1%"
            />
            <Column
              title="Total Count"
              dataIndex="totalCount"
              key="totalCount"
              width="1%"
            />
            <Column
              title="Created"
              dataIndex="createdCount"
              key="createdCount"
              width="1%"
            />
            <Column
              title="Errors"
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
            <Column title="" dataIndex="download" key="downlad" width="2%" />
          </Table>
        </RecordTable>
      </RosterHistoryWrapper>
      <HistoryWrapper>
        <h1>Roster Import History</h1>
        <HistoryWrapperChild>
          <div>
            <p>Roster-file name</p>
            <StyledParagraph>24 August 2022 3:15pm</StyledParagraph>
          </div>
          <StyledDiv>
            <p>View Upload Data</p>
          </StyledDiv>
        </HistoryWrapperChild>
      </HistoryWrapper>
    </CompleteWrapper>
  )
}

export default RosterHistory
