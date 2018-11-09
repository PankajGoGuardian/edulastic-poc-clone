import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, FlexContainer } from '@edulastic/common';
import { Table } from 'antd';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { IconTrash, IconPencilEdit } from '@edulastic/icons';
import { greenDark, green } from '@edulastic/colors';
import uuidv4 from 'uuid/v4';

import Header from './Header';
import ClassCell from './ClassCell';
import { Container } from '../../common';
import { Breadcrumbs } from '../common';
import EditModal from './EditModal';

const formatDate = date => moment(date).format('MM-DD-YYYY');

const getDefaultAssignData = () => ({
  key: uuidv4(),
  startDate: moment(),
  endDate: moment(),
  openPolicy: 'Automatically on Start Date',
  closePolicy: 'Automatically on Due Date',
  class: {
    id: uuidv4(),
    students: [],
  },
});

const columns = [
  {
    title: 'Class Name',
    dataIndex: 'className',
    sorter: (a, b) => a.className.id.localeCompare(b.className.id),
    render: data => <ClassCell {...data} />,
  },
  {
    title: 'Open Policy',
    dataIndex: 'openPolicy',
    sorter: (a, b) => a.openPolicy.localeCompare(b.openPolicy),
  },
  {
    title: 'Close Policy',
    dataIndex: 'closePolicy',
    sorter: (a, b) => a.closePolicy.localeCompare(b.closePolicy),
  },
  {
    title: 'Open Date',
    dataIndex: 'openDate',
    sorter: (a, b) => moment(a.openDate).unix() - moment(b.openDate).unix(),
    render: formatDate,
  },
  {
    title: 'Close Date',
    dataIndex: 'closeDate',
    sorter: (a, b) => moment(a.closeDate).unix() - moment(b.closeDate).unix(),
    render: formatDate,
  },
  {
    title: '',
    dataIndex: 'buttons',
    sorter: false,
    // eslint-disable-next-line react/prop-types
    render: ({ remove, edit }, record) => (
      <FlexContainer justifyContent="space-around">
        <IconPencilEdit
          onClick={() =>
            edit({
              key: record.key,
              startDate: moment(record.openDate),
              endDate: moment(record.closeDate),
              openPolicy: record.openPolicy,
              closePolicy: record.closePolicy,
              class: record.className,
            })
          }
          color={greenDark}
          hoverColor={green}
          style={{ cursor: 'pointer' }}
        />
        <IconTrash
          onClick={() => remove(record)}
          color={greenDark}
          hoverColor={green}
          style={{ cursor: 'pointer' }}
        />
      </FlexContainer>
    ),
  },
];

const Assign = ({ test, setData, current }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(getDefaultAssignData());

  const handleSearch = (value) => {
    console.log(value);
  };

  const handleRemoveAssignment = (record) => {
    const newData = cloneDeep(test);
    newData.assignments = newData.assignments.filter((item, i) => i !== record.key);
    setData(newData);
  };

  const handleAddEditAssignment = (data) => {
    setShowModal(true);
    setModalData(data);
  };

  const tableData = test.assignments.map((item, i) => ({
    key: i,
    className: item.class,
    openPolicy: item.openPolicy || '',
    closePolicy: item.closePolicy || '',
    openDate: item.startDate,
    closeDate: item.endDate,
    buttons: {
      remove: handleRemoveAssignment,
      edit: handleAddEditAssignment,
    },
  }));

  const saveAssignment = () => {
    const newData = cloneDeep(test);
    const data = cloneDeep(modalData);

    const assignmentIndex = tableData.findIndex(({ key }) => key === data.key);

    if (assignmentIndex < 0) {
      delete data.key;
      newData.assignments.push(data);
    } else {
      newData.assignments[assignmentIndex] = data;
    }

    setData(newData);
    setShowModal(false);
  };

  return (
    <Container>
      <EditModal
        visible={showModal}
        title="Edit Assignment"
        onOk={saveAssignment}
        onCancel={() => setShowModal(false)}
        modalData={modalData}
        setModalData={setModalData}
      />
      <Breadcrumbs current={current} />
      <Paper>
        <Header
          onAdd={() => handleAddEditAssignment(getDefaultAssignData())}
          onSearch={handleSearch}
        />
        <Table columns={columns} dataSource={tableData} />
      </Paper>
    </Container>
  );
};

Assign.propTypes = {
  test: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
};

export default Assign;
