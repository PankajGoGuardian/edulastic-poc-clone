import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

// components
import { Modal, Table, Icon } from 'antd'
import { IconClose } from '@edulastic/icons'
import { greyThemeDark1, darkGrey2, lightGrey11 } from '@edulastic/colors'
import { StyledEduButton } from '../../common/styled'

// constants
import navigation from '../../common/static/json/navigation.json'

const ReportsNotificationModal = ({
  reportDocs = [],
  visible,
  onClose,
  // NOTE: uncomment for dev purpose, do not delete
  // deleteDoc = () => {},
}) => {
  const columns = [
    {
      title: 'Report',
      key: 'reportType',
      dataIndex: 'reportType',
      width: 270,
      render: (data) => navigation.locToData[data].title,
      sorter: (a, b) => a.reportType.localeCompare(b.reportType),
    },
    {
      title: 'Requested Date',
      key: 'modifiedAt',
      dataIndex: 'modifiedAt',
      width: 150,
      align: 'center',
      render: (data) => moment(data).format('MM-DD-YYYY'),
      sorter: (a, b) => a.modifiedAt - b.modifiedAt,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Download',
      key: 'downloadLink',
      dataIndex: 'downloadLink',
      width: 150,
      align: 'center',
      render: (data) => (
        <StyledEduButton
          isGhost
          isBlue
          noBorder
          title="Download CSV"
          href={data}
        >
          <Icon type="download" />
        </StyledEduButton>
      ),
    },
    // NOTE: uncomment for dev purpose, do not delete
    // {
    //   title: 'Delete',
    //   key: '__id',
    //   dataIndex: '__id',
    //   width: 100,
    //   align: 'center',
    //   render: (data) => (
    //     <StyledEduButton
    //       isGhost
    //       isBlue
    //       noBorder
    //       title="Delete CSV"
    //       onClick={() => deleteDoc(data)}
    //     >
    //       <Icon type="close" />
    //     </StyledEduButton>
    //   ),
    // },
  ]

  return (
    <StyledModal
      className="download-csv-modal"
      title={
        <div>
          <span>Requested Report Data</span>
          <IconClose
            className="download-csv-modal-close-icon"
            height={20}
            width={20}
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          />
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={false}
      centered
    >
      <StyledTable
        columns={columns}
        dataSource={reportDocs}
        pagination={false}
      />
    </StyledModal>
  )
}

export default ReportsNotificationModal

const StyledModal = styled(Modal)`
  min-width: fit-content;
  .ant-modal-content {
    width: fit-content;
    border-radius: 10px;
    padding: 25px 50px 50px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      padding: 0px;
      margin-bottom: 20px;
      border: none;
      .ant-modal-title {
        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          span {
            color: ${greyThemeDark1};
            font-size: 22px;
            font-weight: 700;
            line-height: 30px;
          }
        }
        p {
          color: ${darkGrey2};
          font-size: 14px;
          font-weight: 600;
          line-height: 19px;
          margin-bottom: 30px;
        }
      }
    }
    .ant-modal-body {
      border-radius: 10px;
      padding: 0px;
      .ant-spin {
        padding-top: 65px;
      }
    }
    .ant-modal-footer {
      display: none;
    }
  }
`

const StyledTable = styled(Table)`
  width: 100%;
  .ant-table {
    .ant-table-content {
      height: 250px;
      overflow: auto;
      .ant-table-body {
        min-height: auto;
        table {
          border: none;
          .ant-table-thead {
            tr {
              background: white;
              th {
                border: none;
                background: white;
                padding: 5px 10px 20px 10px;
                .ant-table-column-title {
                  white-space: nowrap;
                  font-size: 12px;
                  line-height: 17px;
                  font-weight: 700;
                  color: ${lightGrey11};
                  text-transform: uppercase;
                }
              }
            }
          }
          .ant-table-tbody {
            border-collapse: collapse;
            tr {
              cursor: pointer;
              td {
                height: 40px;
                padding: 5px 10px;
                font-size: 14px;
                line-height: 19px;
                font-weight: 600;
                color: ${greyThemeDark1};
                .ant-radio {
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }
      .ant-table-placeholder {
        border: none;
      }
    }
  }
`
