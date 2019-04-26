import React from "react";
// import PropTypes from "prop-types";
import { Select, Checkbox } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import { receiveClassListAction } from "../../../Classes/ducks";
import { getUserOrgId } from "../../../src/selectors/user";
import { ClassListFilter, StyledRowLabel, StyledTable, ClassListContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const columns = [
  {
    title: <Checkbox />,
    width: "10%",
    dataIndex: "standard",
    key: "standard",
    render: () => <Checkbox />
  },
  {
    title: "CLASS NAME",
    sorter: true,
    width: "25%",
    dataIndex: "className",
    key: "className"
  },
  {
    title: "TEACHER",
    sorter: true,
    width: "25%",
    dataIndex: "teacher",
    key: "teacher"
  },
  {
    title: "SUBJECT",
    width: "25%",
    sorter: true,
    key: "subject",
    dataIndex: "subject"
  },
  {
    title: "GRADE",
    width: "15%",
    sorter: true,
    key: "grades",
    dataIndex: "grades"
  }
];
const tdata = [
  {
    key: "1",
    className: "Digiulio-G7-1",
    teacher: "John Digiulio",
    subject: "Mathematics",
    grades: 7
  },
  {
    key: "2",
    className: "Digiulio-G7-2",
    teacher: "John Digiulio",
    subject: "Mathematics",
    grades: 7
  },
  {
    key: "3",
    className: "Markrof-G7-3",
    teacher: "John Markrof",
    subject: "Mathematics",
    grades: 7
  },
  {
    key: "4",
    className: "Markrof-G7-4",
    teacher: "John Markrof",
    subject: "Mathematics",
    grades: 7
  },
  {
    key: "5",
    className: "Bocanegra-G7-1",
    teacher: "",
    subject: "Mathematics",
    grades: 7
  }
];

class ClassList extends React.Component {
  componentDidMount() {
    const { loadClassListData, userOrgId } = this.props;
    loadClassListData({
      districtId: userOrgId,
      search: {
        institutionIds: [],
        codes: [],
        subjects: [],
        grades: [],
        active: 1
      }
    });
  }

  render() {
    return (
      <ClassListContainer>
        <ClassListFilter>
          <StyledRowLabel>
            School
            <Select placeholder="All School">
              {allGrades.map(
                ({ value, text, isContentGrade }) =>
                  !isContentGrade && (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  )
              )}
            </Select>
          </StyledRowLabel>

          <StyledRowLabel>
            Grade
            <Select mode="multiple" placeholder="All grades">
              {allGrades.map(
                ({ value, text, isContentGrade }) =>
                  !isContentGrade && (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  )
              )}
            </Select>
          </StyledRowLabel>

          <StyledRowLabel>
            Subject
            <Select mode="multiple" placeholder="All subjects">
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
          </StyledRowLabel>

          <StyledRowLabel>
            Course
            <Select placeholder="All Course">
              {allGrades.map(
                ({ value, text, isContentGrade }) =>
                  !isContentGrade && (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  )
              )}
            </Select>
          </StyledRowLabel>
        </ClassListFilter>

        <StyledTable columns={columns} dataSource={tdata} pagination={false} />
      </ClassListContainer>
    );
  }
}

export default connect(
  state => ({
    termsData: get(state, "user.user.orgData.terms", []),
    userOrgId: getUserOrgId(state)
  }),
  {
    loadClassListData: receiveClassListAction
  }
)(ClassList);
