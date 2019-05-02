import React from "react";
import PropTypes from "prop-types";
import { Select, Checkbox } from "antd";
import { connect } from "react-redux";
import { get, curry, isEmpty, find, remove } from "lodash";
import { receiveClassListAction } from "../../../Classes/ducks";
import { getUserOrgId } from "../../../src/selectors/user";
import { ClassListFilter, StyledRowLabel, StyledTable, ClassListContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const convertTableData = row => ({
  key: row._id,
  className: row.name,
  teacher: row.teacherName,
  subject: row.subject,
  grades: row.grade
});

class ClassList extends React.Component {
  static propTypes = {
    loadClassListData: PropTypes.func.isRequired,
    userOrgId: PropTypes.string.isRequired,
    classList: PropTypes.array.isRequired,
    selectedClasses: PropTypes.array.isRequired,
    selectClass: PropTypes.func.isRequired
  };

  state = {
    searchTerms: {
      institutionIds: [],
      codes: [],
      subjects: [],
      grades: [],
      active: 1
    }
  };

  componentDidMount() {
    const { classList } = this.props;
    if (isEmpty(classList)) {
      this.loadClassList();
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
    const { classList, selectedClasses } = this.props;
    const { searchTerms } = this.state;
    const tableData = classList.map(item => convertTableData(item));
    const changeField = curry(this.changeFilter);

    const columns = [
      {
        title: <Checkbox />,
        width: "10%",
        dataIndex: "standard",
        key: "standard",
        render: (_, row) => {
          const checked = find(selectedClasses, item => row.key === item);
          return <Checkbox checked={!!checked} onChange={e => this.selectClass(row.key, e.target.checked)} />;
        }
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

        <StyledTable columns={columns} dataSource={tableData} pagination={{ pageSize: 7 }} />
      </ClassListContainer>
    );
  }
}

export default connect(
  state => ({
    termsData: get(state, "user.user.orgData.terms", []),
    classList: get(state, "classesReducer.data"),
    userOrgId: getUserOrgId(state)
  }),
  {
    loadClassListData: receiveClassListAction
  }
)(ClassList);
