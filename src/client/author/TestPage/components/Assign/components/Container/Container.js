import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { IconTrash, IconPencilEdit, IconPlus } from '@edulastic/icons';
import { Paper, FlexContainer, EduButton } from '@edulastic/common';
import { greenDark, green, white } from '@edulastic/colors';
import {
  addAssignmentAction,
  updateAssignmentAction,
  fetchAssignmentsAction,
  deleteAssignmentAction,
  getGroupSelector,
  fetchGroupsAction
} from '../../ducks';
import ClassCell from '../ClassCell/ClassCell';
import { Container } from '../../../../../src/components/common';
import Breadcrumb from '../../../../../src/components/Breadcrumb';
import EditModal from '../EditModal/EditModal';
import { StyledTable } from './styled';

const formatDate = date => moment(date).format('MM-DD-YYYY');

const getDefaultAssignData = () => ({
  startDate: moment(),
  endDate: moment(),
  openPolicy: 'Automatically on Start Date',
  closePolicy: 'Automatically on Due Date',
  class: [],
  specificStudents: false
});

// Todo from  where we got localeCompare ?
const columns = group => [
  {
    title: 'Class Name',
    dataIndex: 'class',
    sorter: (a, b) => a.class._id.localeCompare(b.class._id),
    render: data => <ClassCell data={data} group={group} />
  },
  {
    title: 'Open Policy',
    dataIndex: 'openPolicy',
    sorter: (a, b) => a.openPolicy.localeCompare(b.openPolicy)
  },
  {
    title: 'Close Policy',
    dataIndex: 'closePolicy',
    sorter: (a, b) => a.closePolicy.localeCompare(b.closePolicy)
  },
  {
    title: 'Open Date',
    dataIndex: 'openDate',
    sorter: (a, b) => moment(a.openDate).unix() - moment(b.openDate).unix(),
    render: formatDate
  },
  {
    title: 'Close Date',
    dataIndex: 'closeDate',
    sorter: (a, b) => moment(a.closeDate).unix() - moment(b.closeDate).unix(),
    render: formatDate
  },
  {
    title: '',
    dataIndex: 'buttons',
    sorter: false,
    // eslint-disable-next-line react/prop-types
    render: ({ remove, edit }, record) => {
      const handleClick = () =>
        edit({
          key: record.key,
          startDate: moment(record.openDate),
          endDate: moment(record.closeDate),
          openPolicy: record.openPolicy,
          closePolicy: record.closePolicy,
          class: record.class || [],
          students: record.students || [],
          specificStudents: record.specificStudents || false
        });
      return (
        <FlexContainer justifyContent="space-around">
          <IconPencilEdit
            data-cy="edit"
            onClick={handleClick}
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
      );
    }
  }
];

class Assign extends PureComponent {
  static propTypes = {
    test: PropTypes.object.isRequired,
    current: PropTypes.string.isRequired,
    addAssignment: PropTypes.func.isRequired,
    updateAssignment: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    fetchAssignments: PropTypes.func.isRequired,
    deleteAssignment: PropTypes.func.isRequired,
    group: PropTypes.array.isRequired
  }

  state = {
    showModal: false,
    modalData: getDefaultAssignData(),
    isAddAssignment: false
  }

  componentDidMount() {
    const { fetchGroups, fetchAssignments } = this.props;

    fetchGroups();
    fetchAssignments();
  }

  handleRemoveAssignment = (record) => {
    const { deleteAssignment } = this.props;
    deleteAssignment(record._id);
  };

  handleAddEditAssignment = (data, add = false) => () => {
    this.setState({
      showModal: true,
      modalData: data,
      isAddAssignment: add
    });
  };

  handleShowModalState = value => () => {
    this.setState({
      showModal: value
    });
  };

  saveAssignment = tableData => () => {
    const { test, addAssignment, updateAssignment } = this.props;
    const { modalData, isAddAssignment } = this.state;
    const newData = cloneDeep(test);
    const data = cloneDeep(modalData);
    const assignmentIndex = tableData.findIndex(({ key }) => key === data.key);

    const assignmentId =
      tableData[assignmentIndex] && tableData[assignmentIndex]._id;
    if (assignmentIndex < 0) {
      delete data.key;
      newData.assignments.push(data);
    } else {
      newData.assignments[assignmentIndex] = data;
    }

    modalData.testId = test._id;
    if (isAddAssignment) addAssignment(modalData);
    else updateAssignment({ ...modalData, id: assignmentId });
    this.setState({
      showModal: false
    });
  };

  setModalData = (value) => {
    this.setState({
      modalData: value
    });
  }

  render() {
    const { test, group, current } = this.props;
    const { showModal, isAddAssignment, modalData } = this.state;
    // TODO Assigmnent  = []
    const assignments = test.assignments||[];
    const tableData = assignments.map((item, i) => ({
      key: i,
      _id: item._id,
      class: item.class,
      students: item.students,
      specificStudents: item.specificStudents || false,
      openPolicy: item.openPolicy || '',
      closePolicy: item.closePolicy || '',
      openDate: item.startDate,
      closeDate: item.endDate,
      buttons: {
        remove: this.handleRemoveAssignment,
        edit: this.handleAddEditAssignment
      }
    }));

    const breadcrumbData = [
      {
        title: 'TESTS LIST',
        to: '/author/tests'
      },
      {
        title: current,
        to: ''
      }
    ];

    return (
      <Container>
        <EditModal
          visible={showModal}
          title={isAddAssignment ? 'New Assignment' : 'Edit Assignment'}
          onOk={this.saveAssignment(tableData)}
          onCancel={this.handleShowModalState(false)}
          modalData={modalData}
          setModalData={this.setModalData}
          group={group}
        />
        <FlexContainer
          justifyContent="space-between"
          style={{ marginBottom: 20 }}
        >
          <div>
            <Breadcrumb
              data={breadcrumbData}
              style={{ position: 'unset' }}
            />
          </div>
          <EduButton
            onClick={this.handleAddEditAssignment(getDefaultAssignData(), true)}
            type="secondary"
            size="large"
            style={{ height: 32 }}
          >
            <FlexContainer>
              <IconPlus color={white} width={14} height={14} />
              <span>Add new assignment</span>
            </FlexContainer>
          </EduButton>
        </FlexContainer>
        <Paper style={{ padding: '18px' }}>
          <StyledTable columns={columns(group)} dataSource={tableData} />
        </Paper>
      </Container>
    );
  }
}
export default connect(
  state => ({
    group: getGroupSelector(state)
  }),
  {
    addAssignment: addAssignmentAction,
    updateAssignment: updateAssignmentAction,
    fetchGroups: fetchGroupsAction,
    fetchAssignments: fetchAssignmentsAction,
    deleteAssignment: deleteAssignmentAction
  }
)(Assign);
