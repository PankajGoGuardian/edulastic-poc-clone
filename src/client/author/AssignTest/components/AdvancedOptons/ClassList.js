import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { Select } from "antd";
import { SelectInputStyled } from "@edulastic/common";
import { IconGroup, IconClass } from "@edulastic/icons";
import { lightGrey10 } from "@edulastic/colors";
import { get, curry, isEmpty, find, uniq } from "lodash";
import { receiveClassListAction } from "../../../Classes/ducks";
import { getClassListSelector } from "../../duck";
import { getUserOrgId, getSchoolsByUserRoleSelector } from "../../../src/selectors/user";
import { receiveSchoolsAction } from "../../../Schools/ducks";
import { receiveCourseListAction, getCourseListSelector } from "../../../Courses/ducks";
import {
  ClassListFilter,
  StyledRowLabel,
  StyledTable,
  ClassListContainer,
  TableContainer,
  InfoSection
} from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";
import { getTestSelector, getAllTagsAction, getAllTagsSelector } from "../../../TestPage/ducks";
import Tags from "../../../src/components/common/Tags";

const { allGrades, allSubjects } = selectsData;

const findTeacherName = row => {
  const {
    owners = [],
    primaryTeacherId,
    parent: { id: teacherId }
  } = row;
  const teacher = find(owners, owner => owner.id === (primaryTeacherId || teacherId));
  return teacher ? teacher.name : owners.length ? owners[0].name : "";
};

const convertTableData = row => ({
  key: row._id,
  className: row.name,
  teacher: findTeacherName(row),
  subject: row.subject,
  grades: row.grades || "",
  type: row.type,
  tags: row.tags
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
    test: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      classType: "all",
      searchTerms: {
        institutionIds: [],
        subjects: [],
        grades: [],
        active: [1],
        tags: []
      },
      filterClassIds: []
    };
  }

  componentDidMount() {
    const { schools, test, loadSchoolsData, courseList, loadCourseListData, userOrgId, getAllTags } = this.props;

    if (isEmpty(schools)) {
      loadSchoolsData({ districtId: userOrgId });
    }
    if (isEmpty(courseList)) {
      loadCourseListData({ districtId: userOrgId, active: 1 });
    }

    getAllTags({ type: "group" });

    const { subjects = [], grades = [] } = test;
    this.setState(
      prevState => ({
        ...prevState,
        searchTerms: {
          ...prevState.searchTerms,
          grades,
          subjects
        }
      }),
      this.loadClassList
    );
  }

  componentDidUpdate(prevProps) {
    const { test } = this.props;
    if (prevProps.test._id !== test._id) {
      const { subjects = [], grades = [] } = test;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        prevState => ({
          ...prevState,
          searchTerms: {
            ...prevState.searchTerms,
            grades,
            subjects
          }
        }),
        this.loadClassList
      );
    }
  }

  loadClassList = () => {
    const { loadClassListData, userOrgId } = this.props;
    const { searchTerms } = this.state;
    loadClassListData({
      districtId: userOrgId,
      queryType: "OR",
      search: searchTerms,
      page: 1,
      limit: 1000
    });
  };

  changeFilter = (key, value) => {
    const { searchTerms } = this.state;
    searchTerms[key] = value;
    this.setState({ searchTerms }, this.loadClassList);
  };

  handleClassTypeFilter = key => {
    this.setState({ classType: key });
  };

  handleSelectAll = checked => {
    const { selectClass, classList } = this.props;
    const { filterClassIds } = this.state;
    let filterclassList = [];
    if (checked) {
      const selectedClasses = classList.map(item => item._id);
      selectClass("class", selectedClasses, classList);
      filterclassList = selectedClasses;
    } else {
      selectClass("class", [], classList);
    }
    if (filterClassIds.length) {
      this.setState({ filterClassIds: filterclassList });
    }
  };

  handleClassSelectFromDropDown = value => {
    const { classList, selectClass } = this.props;
    this.setState({ filterClassIds: value }, () => selectClass("class", value, classList));
  };

  render() {
    const { classList, schools, courseList, selectClass, selectedClasses, tagList } = this.props;
    const { searchTerms, classType, filterClassIds } = this.state;

    const tableData = classList
      .filter(item => {
        if (!filterClassIds.length) return classType === "all" || item.type === classType;
        return filterClassIds.includes(item._id);
      })
      .map(item => convertTableData(item));

    const changeField = curry(this.changeFilter);

    const rowSelection = {
      selectedRowKeys: selectedClasses,
      hideDefaultSelections: true,
      onSelect: (_, __, selectedRows) => {
        if (selectClass) {
          const selectedClassIds = selectedRows.map(item => item.key);
          selectClass("class", selectedClassIds, classList);
          if (filterClassIds.length) this.setState({ filterClassIds: selectedClassIds });
        }
      },
      onSelectAll: this.handleSelectAll
    };

    const selectedClassData = classList?.filter(({ _id }) => selectedClasses.includes(_id)) || 0;
    const schoolsCount =
      uniq(selectedClassData?.map(({ institutionId }) => institutionId)?.filter(i => !!i))?.length || 0;
    const classesCount = selectedClassData?.filter(({ type }) => type === "class")?.length;
    const studentsCount = selectedClassData?.reduce((acc, curr) => acc + (curr.studentCount || 0), 0) || 0;

    const columns = [
      {
        title: "CLASS NAME",
        width: "25%",
        dataIndex: "className",
        key: "className",
        sorter: (a, b) => a.className > b.className,
        sortDirections: ["descend", "ascend"],
        render: (className, row) => (
          <div>
            {row.type === "custom" ? (
              <IconGroup width={20} height={19} margin="0 10px 0 0px" color={lightGrey10} />
            ) : (
              <IconClass width={13} height={14} margin="0 10px 0 0px" color={lightGrey10} />
            )}
            <span>{className}</span>
            <Tags data-cy="tags" tags={row.tags} show={1} key="tags" isGrayTags />
          </div>
        )
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
        title: "GRADES",
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
            <SelectInputStyled
              mode="multiple"
              placeholder="All School"
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={changeField("institutionIds")}
              value={searchTerms.institutionIds}
            >
              {schools.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Grades
            <SelectInputStyled
              mode="multiple"
              value={searchTerms.grades}
              placeholder="All grades"
              onChange={changeField("grades")}
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {allGrades.map(
                ({ value, text, isContentGrade }) =>
                  !isContentGrade && (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  )
              )}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Subject
            <SelectInputStyled
              mode="multiple"
              value={searchTerms.subjects}
              placeholder="All subjects"
              onChange={changeField("subjects")}
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Course
            <SelectInputStyled
              mode="multiple"
              placeholder="All Course"
              onChange={changeField("courseIds")}
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {courseList.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Show Class/Groups
            <SelectInputStyled
              placeholder="All"
              onChange={this.handleClassTypeFilter}
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {[
                { name: "All", value: "all" },
                { name: "Classes", value: "class" },
                { name: "Student Groups", value: "custom" }
              ].map(({ name, value }) => (
                <Select.Option key={name} value={value}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Search Class/Groups
            <SelectInputStyled
              placeholder="Search by name of class or group"
              onChange={this.handleClassSelectFromDropDown}
              mode="multiple"
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={filterClassIds}
            >
              {classList.map(({ name, _id }) => (
                <Select.Option key={name} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Tags
            <SelectInputStyled
              mode="multiple"
              value={searchTerms.tags}
              placeholder="All Tags"
              onChange={changeField("tags")}
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {tagList.map(({ _id, tagName }) => (
                <Select.Option key={_id} value={_id}>
                  {tagName}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>
        </ClassListFilter>

        <TableContainer>
          <InfoSection>
            <div>
              <span>School(s)</span>
              <span>{schoolsCount}</span>
            </div>
            <div>
              <span>Class(es)</span>
              <span>{classesCount}</span>
            </div>
            <div>
              <span>Student(s)</span>
              <span>{studentsCount}</span>
            </div>
          </InfoSection>
          <StyledTable
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 20 }}
          />
        </TableContainer>
      </ClassListContainer>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      termsData: get(state, "user.user.orgData.terms", []),
      classList: getClassListSelector(state),
      userOrgId: getUserOrgId(state),
      schools: getSchoolsByUserRoleSelector(state),
      courseList: getCourseListSelector(state),
      test: getTestSelector(state),
      tagList: getAllTagsSelector(state, "group")
    }),
    {
      loadClassListData: receiveClassListAction,
      loadSchoolsData: receiveSchoolsAction,
      loadCourseListData: receiveCourseListAction,
      getAllTags: getAllTagsAction
    }
  )
);

export default enhance(ClassList);
