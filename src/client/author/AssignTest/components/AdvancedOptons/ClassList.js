import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { Select } from "antd";
import { get, curry, isEmpty, remove, lowerCase, find } from "lodash";
import { receiveClassListAction } from "../../../Classes/ducks";
import { getUserOrgId } from "../../../src/selectors/user";
import { getSchoolsSelector, receiveSchoolsAction } from "../../../Schools/ducks";
import { receiveCourseListAction, getCourseListSelector } from "../../../Courses/ducks";
import { getTestsSelector } from "../../../TestList/ducks";

import { ClassListFilter, StyledRowLabel, StyledTable, ClassListContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const findTeacherName = row => {
  const { owners, primaryTeacherId } = row;
  const teacher = find(owners, owner => owner.id === primaryTeacherId);
  return teacher ? teacher.name : "";
};

const convertTableData = row => ({
  key: row._id,
  className: row.name,
  teacher: findTeacherName(row),
  subject: row.subject,
  grades: row.grade
});

class ClassList extends React.Component {
  static propTypes = {
    loadCourseListData: PropTypes.func.isRequired,
    loadSchoolsData: PropTypes.func.isRequired,
    loadClassListData: PropTypes.func.isRequired,
    userOrgId: PropTypes.string.isRequired,
    schools: PropTypes.array.isRequired,
    courseList: PropTypes.array.isRequired,
    classList: PropTypes.array.isRequired,
    selectedClasses: PropTypes.array.isRequired,
    selectClass: PropTypes.func.isRequired,
    tests: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const { match, tests } = props;
    const { testId } = match.params;
    const { grades = [], subjects = [] } = find(tests, item => item._id === testId) || {};

    this.state = {
      searchTerms: {
        institutionIds: [],
        codes: [],
        subjects: subjects.map(subject => lowerCase(subject)),
        grades,
        active: 1
      }
    };
  }

  componentDidMount() {
    const { classList, schools, loadSchoolsData, courseList, loadCourseListData, userOrgId } = this.props;
    if (isEmpty(classList)) {
      this.loadClassList();
    }
    if (isEmpty(schools)) {
      loadSchoolsData({ districtId: userOrgId });
    }
    if (isEmpty(courseList)) {
      loadCourseListData({ districtId: userOrgId });
    }
  }

  loadClassList = () => {
    const { loadClassListData, userOrgId } = this.props;
    const { searchTerms } = this.state;
    loadClassListData({
      districtId: userOrgId,
      search: searchTerms
    });
  };

  changeFilter = (key, value) => {
    const { searchTerms } = this.state;
    searchTerms[key] = value;
    this.setState({ searchTerms }, this.loadClassList);
  };

  selectClass = (classId, checked) => {
    const { selectClass, selectedClasses } = this.props;
    if (checked) {
      selectedClasses.push(classId);
    } else {
      remove(selectedClasses, item => item === classId);
    }
    if (selectClass) {
      selectClass("class", selectedClasses);
    }
  };

  render() {
    const { classList, schools, courseList, selectClass, selectedClasses } = this.props;
    const { searchTerms } = this.state;
    const tableData = classList.map(item => convertTableData(item));
    const changeField = curry(this.changeFilter);

    const rowSelection = {
      selectedRowKeys: selectedClasses,
      onChange: selectedRowKeys => {
        if (selectClass) {
          selectClass("class", selectedRowKeys);
        }
      }
    };

    const columns = [
      {
        title: "CLASS NAME",
        width: "25%",
        dataIndex: "className",
        key: "className",
        sorter: (a, b) => a.className > b.className,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "TEACHER",
        width: "25%",
        dataIndex: "teacher",
        key: "teacher",
        sorter: (a, b) => a.teacher > b.teacher,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "SUBJECT",
        width: "25%",
        key: "subject",
        dataIndex: "subject",
        sorter: (a, b) => a.subject > b.subject,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "GRADE",
        width: "15%",
        key: "grades",
        dataIndex: "grades",
        sorter: (a, b) => a.grades > b.grades,
        sortDirections: ["descend", "ascend"]
      }
    ];

    return (
      <ClassListContainer>
        <ClassListFilter>
          <StyledRowLabel>
            School
            <Select mode="multiple" placeholder="All School" onChange={changeField("institutionIds")}>
              {schools.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </StyledRowLabel>

          <StyledRowLabel>
            Grade
            <Select
              mode="multiple"
              value={searchTerms.grades}
              placeholder="All grades"
              onChange={changeField("grades")}
            >
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
            <Select
              mode="multiple"
              value={searchTerms.subjects}
              placeholder="All subjects"
              onChange={changeField("subjects")}
            >
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={lowerCase(value)}>
                  {text}
                </Select.Option>
              ))}
            </Select>
          </StyledRowLabel>

          <StyledRowLabel>
            Course
            <Select mode="multiple" placeholder="All Course" onChange={changeField("courseIds")}>
              {courseList.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </StyledRowLabel>
        </ClassListFilter>

        <StyledTable
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 7 }}
        />
      </ClassListContainer>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      termsData: get(state, "user.user.orgData.terms", []),
      classList: get(state, "classesReducer.data"),
      userOrgId: getUserOrgId(state),
      schools: getSchoolsSelector(state),
      courseList: getCourseListSelector(state),
      tests: getTestsSelector(state)
    }),
    {
      loadClassListData: receiveClassListAction,
      loadSchoolsData: receiveSchoolsAction,
      loadCourseListData: receiveCourseListAction
    }
  )
);

export default enhance(ClassList);
