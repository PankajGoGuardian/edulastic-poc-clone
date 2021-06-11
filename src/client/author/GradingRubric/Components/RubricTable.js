import React from 'react'
import { connect } from 'react-redux'
import { Col, Icon } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
  TableActionsContainer,
  StyledTable,
  StyledScrollbarContainer,
} from '../styled'
import { updateRubricDataAction, getCurrentRubricDataSelector } from '../ducks'

const RubricTable = ({
  handleTableAction,
  searchedRubricList,
  loading,
  user,
}) => {
  const getTableActions = (text, record) => {
    return (
      <TableActionsContainer data-cy="actionContainer">
        <span
          title="Preview"
          onClick={() => handleTableAction('PREVIEW', record._id)}
        >
          <Icon type="eye" />
        </span>
        <span
          title="Clone"
          onClick={() => handleTableAction('CLONE', record._id)}
        >
          <FontAwesomeIcon icon={faClone} aria-hidden="true" />
        </span>
        {record.createdBy._id === user._id && (
          <>
            <span
              title="Delete"
              onClick={() => handleTableAction('DELETE', record._id)}
            >
              <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" />
            </span>
            <span
              title="Share"
              onClick={() => handleTableAction('SHARE', record._id)}
            >
              <Icon type="share-alt" />
            </span>
          </>
        )}
      </TableActionsContainer>
    )
  }

  const columns = [
    {
      title: 'Rubric Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Author',
      dataIndex: 'name',
      key: 'authorName',
      render: (_, record) => record.createdBy.name,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (text, record) => getTableActions(text, record),
    },
  ]

  return (
    <Col md={24}>
      <StyledScrollbarContainer style={{ maxHeight: '350px' }}>
        <StyledTable
          data-cy="rubricTable"
          columns={columns}
          dataSource={searchedRubricList}
          pagination={false}
          loading={loading}
        />
      </StyledScrollbarContainer>
    </Col>
  )
}

export default connect(
  (state) => ({
    currentRubricData: getCurrentRubricDataSelector(state),
  }),
  {
    updateRubricData: updateRubricDataAction,
  }
)(RubricTable)
