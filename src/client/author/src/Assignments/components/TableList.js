/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Table, Button, Dropdown } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import { FlexContainer } from '@edulastic/common';
import {
  mobileWidth,
  tabletWidth
} from '@edulastic/colors';
import arrowUpIcon from '../../assets/assignments/arrow-up.svg';
import assignedIcon from '../../assets/assignments/assigned.svg';
import presentationIcon from '../../assets/assignments/presentation.svg';
import additemsIcon from '../../assets/assignments/add-items.svg';
import piechartIcon from '../../assets/assignments/pie-chart.svg';
import ActionMenu from './ActionMenu';

const convertTableData = data => ({
  name: data[0].testName,
  key: data[0]._id,
  class: data[0].className,
  type: data[0].type,
  assigned: 'Lorem Ipsum',
  status: '',
  submitted: `${data[0].submittedNumber} of ${data.length}`,
  graded: '1',
  action: '',
  classId: data[0].classId
});
const convertExpandTableData = (data, totalNumber) => ({
  name: '',
  key: data._id,
  class: data.className,
  type: data.type,
  assigned: 'Lorem Ipsum',
  status: data.status,
  submitted: `${data.submittedNumber} of ${totalNumber}`,
  graded: '1',
  action: '',
  classId: data.classId
});

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: false
    };
  }

  static propTypes = {
    t: PropTypes.func.isRequired
  };

  onShowDetails = () => {
    this.setState({ details: true });
  };

  expandedRowRender = (parentData) => {
    console.log(parentData, 'PARENT DATA');
    const { t } = this.props;
    let getInfo;
    const columns = [
      {
        dataIndex: 'name',
        width: '22%',
        render: text => (<div>{text}</div>)
      },
      {

        dataIndex: 'class',
        width: '11%',
        render: text => (<div><GreyFont>{text}</GreyFont></div>)
      },
      {
        dataIndex: 'type',
        width: '11%',
        render: () => (<div><AssignedImg src={assignedIcon} /></div>)
      },
      {
        dataIndex: 'assigned',
        width: '12%',
        render: text => (<div><GreyFont>{text}</GreyFont></div>)
      },
      {
        dataIndex: 'status',
        width: '12%',
        render: text => (
          <div>
            { text === 'IN PROGRESS' ? <BtnProgress size="small">{text}</BtnProgress> : (
              text === t('common.submittedTag') ? <BtnSubmitted size="small">{text}</BtnSubmitted> : (
                text === t('common.notStartedTag') ? <BtnStarted size="small">{text}</BtnStarted> : ''))
            }
          </div>
        ) },
      {
        dataIndex: 'submitted',
        width: '9%',
        render: text => (<div><GreyFont>{text}</GreyFont></div>)
      },
      {
        dataIndex: 'graded',
        width: '9%',
        render: text => (<div><GreyFont>{text}</GreyFont></div>)
      },
      {
        dataIndex: 'action',
        width: '14%',
        render: () => (
          <ActionDiv>
            <FlexContainer justifyContent="space-between" style={{ marginLeft: 20, marginRight: 20 }}>
              <Link to={`/author/classboard/${getInfo.key}/${getInfo.classId}`}><img src={presentationIcon} alt="Images" /></Link>
              <Link to="/author/expressgrader"><img src={additemsIcon} alt="Images" /></Link>
              <div><img src={piechartIcon} alt="Images" /></div>
            </FlexContainer>
          </ActionDiv>
        ) }
    ];

    const totalData = this.props.assignments;
    const expandTableList = [];
    totalData.forEach((expandData) => {
      if (parentData.key === expandData[0]._id) {
        expandData.forEach((data) => {
          getInfo = convertExpandTableData(data, expandData.length);
          expandTableList.push(getInfo);
        });
      }
    });

    return (
      <ExpandedTable
        columns={columns}
        dataSource={expandTableList}
        pagination={false}
      />
    );
  };

  render() {
    const menu = (<ActionMenu />);
    const columns = [
      {
        title: 'Assignment Name',
        dataIndex: 'name',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '22%',
        render: text => (
          <FlexContainer style={{ marginLeft: 0 }}>
            <div><BtnGreen type="primary" size="small" /></div>
            <AssignmentTD>{text}</AssignmentTD>
          </FlexContainer>
        )
      },
      {
        title: 'Class',
        dataIndex: 'class',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '11%',
        render: () => (
          <ExpandDivdier onMouseEnter={() => this.setState({ details: true })} onMouseLeave={() => this.setState({ details: false })}>
            <IconArrowDown onclick={() => false} src={arrowUpIcon} />1
          </ExpandDivdier>
        )
      },
      {
        title: 'Type',
        dataIndex: 'type',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '11%',
        render: text => (
          <div>
            {text}
          </div>
        )
      },
      {
        title: 'Assigned by',
        dataIndex: 'assigned',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '12%',
        render: text => (<div> {text} </div>)
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '12%',
        render: text => (<div> {text} </div>)
      },
      {
        title: 'Submitted',
        dataIndex: 'submitted',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '9%',
        render: text => (<div> {text} </div>)
      },
      {
        title: 'Graded',
        dataIndex: 'graded',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '9%',
        render: text => (<div> {text} </div>)
      },
      {
        dataIndex: 'action',
        width: '14%',
        render: () => (
          <ActionDiv>
            <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
              <BtnAction>ACTIONS</BtnAction>
            </Dropdown>
          </ActionDiv>
        )
      }
    ];

    const { assignments } = this.props;
    return (
      <Container>
        <TableData
          columns={columns}
          expandRowByClick={this.state.details}
          expandedRowRender={this.expandedRowRender}
          dataSource={assignments.map(data => convertTableData(data))}
        />
      </Container>
    );
  }
}

export default withNamespaces('assignmentCard')(TableList);

const Container = styled.div`
  padding: 30;
  left: 0;
  right: 0;
  height: 100%;
`;
const TableData = styled(Table)`
  text-align: center;
  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters, .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters {
    text-align: center;
  }
  .ant-table-tbody{
    text-align: center;
  }
  .ant-table-tbody > tr > td{
    border-bottom:none;
  }
  @media (max-width: ${tabletWidth}) {
    display: none;
  }
  .ant-table-row-expand-icon {
    display: none;
  }
  
`;
const BtnGreen = styled(Button)`
  background-color: #1cd6dc !important;
  border: 0px;
  width: 55px;
  margin-right: 15px;
`;
const AssignmentTD = styled.div`
  text-align: left;
  padding-left: 0px !important;
  padding-right: 0px !important;
`;
// const IconArrowUP = styled.img`
//   color: #12a6e8;
//   margin-right: 5px;
//   width: 17px;
// `;
const IconArrowDown = styled.img`
  color: #12a6e8;
  margin-right: 5px;
  width: 6px;
`;
const BtnAction = styled(Button)`
  color: #12a6e8;
  border-color: #12a6e8;
  max-width: 140px;
  height:32px;
  font-size:0.7em;
  font-weight: bold;
  width:100%;
  padding:0px 20px;

  :active {
    background-color: #12a6e8;
    color: #fff;
  }
  :hover{
    background-color: #12a6e8;
    color: #fff;
  }
`;
const AssignedImg = styled.img`
  color: #12a6e8;
`;
const ExpandDivdier = styled.div`
  color: #12a6e8;
  cursor: pointer;
`;

const BtnProgress = styled(Button)`
  color: #d1a422;
  background-color: #deba5b;
  border: 0px;
  font-size:0.7em;
  font-weight: bold;
  max-width: 145px;
  width:100%;
  padding:0px 20px;
  height:26px;
  border-radius:8px;
`;
const BtnSubmitted = styled(Button)`
  color: #8750ac;
  background-color: #e7c8fb;
  border: 0px;
  font-size:0.7em;
  font-weight: bold;
  max-width: 145px;
  width:100%;
  padding:0px 20px;
  height:26px;
  border-radius:8px;
`;
const BtnStarted = styled(Button)`
  color: #0686c0;
  background-color: #c8ebfb;
  border: 1px solid #eaf3f6;
  font-size:0.7em;
  width:100%;
  font-weight: bold;
  max-width: 145px;
  height:26px;
  border-radius:8px;
  padding:0px 20px;
`;
const ActionDiv = styled.div`
  text-align: center;
  flex: 1;
`;

const GreyFont = styled.div`
  color: grey;
  font-size: 12px;
`;

const ExpandedTable = styled(Table)`
  .ant-table-thead th{
    height:0px;
    margin: 0px;
    padding: 0px;
    border-color: #ffffff;
  }
  .ant-table-tbody tr{
    background-color: #fbfbfb;
    border: 3px solid #ffffff;
    border-radius: 10px;
  }
  .ant-table-tbody tr td{
    padding: 9px 15px !important;
  }
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;
