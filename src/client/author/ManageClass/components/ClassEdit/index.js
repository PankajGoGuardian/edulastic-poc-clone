import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { isEmpty, find, get } from "lodash";
import { Form, Spin, Row } from "antd";
import { withNamespaces } from "@edulastic/localization";
// actions
import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { updateClassAction, fetchStudentsByIdAction, setSubjectAction } from "../../ducks";

// selectors
import { getCurriculumsListSelector, getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgData } from "../../../src/selectors/user";
import { receiveSearchCourseAction } from "../../../Courses/ducks";

// componentes
import Header from "./Header";
import BreadCrumb from "../../../src/components/Breadcrumb";
import LeftFields from "./LeftFields";
import RightFields from "./RightFields";
import { Container, FormTitle, LeftContainer, RightContainer } from "./styled";
import { getAllTagsAction, addNewTagAction, getAllTagsSelector } from "../../../TestPage/ducks";

class ClassEdit extends React.Component {
  static propTypes = {
    getCurriculums: PropTypes.func.isRequired,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        curriculum: PropTypes.string.isRequired,
        grades: PropTypes.array.isRequired,
        subject: PropTypes.string.isRequired
      })
    ).isRequired,
    form: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    selctedClass: PropTypes.object.isRequired,
    userOrgData: PropTypes.object.isRequired,
    updateClass: PropTypes.func.isRequired,
    searchCourseList: PropTypes.func.isRequired,
    isSearching: PropTypes.bool.isRequired,
    courseList: PropTypes.array.isRequired,
    updating: PropTypes.bool.isRequired
  };

  state = {};

  componentDidUpdate({ updating, history, selctedClass, location }, { submitted }) {
    const { exitPath, showPath, exitToShow } = location?.state || {};
    if (updating && submitted) {
      const { _id: classId } = selctedClass;
      history.push((exitToShow ? showPath : exitPath) || `/author/manageClass/${classId}`);
    }
  }

  componentDidMount() {
    const { curriculums, getCurriculums, selctedClass, loadStudents, match, getAllTags } = this.props;
    const { classId } = match.params;
    if (isEmpty(selctedClass) || selctedClass?._id !== classId) {
      loadStudents({ classId });
    }
    if (isEmpty(curriculums)) {
      getCurriculums();
    }
    getAllTags({ type: "group" });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, userId, userOrgData, allTagsData } = this.props;
    const {
      districtIds: [districtId]
    } = userOrgData;
    form.validateFields((err, values) => {
      if (!err) {
        const { updateClass, curriculums, selctedClass } = this.props;
        const { standardSets, endDate, startDate, tags, description } = values;
        const { _id: classId, type } = selctedClass;

        const updatedStandardsSets = standardSets?.map(el => {
          const selectedCurriculum = find(curriculums, curriculum => curriculum._id === el);
          return {
            _id: selectedCurriculum._id,
            name: selectedCurriculum.curriculum
          };
        });

        values.districtId = districtId;
        values.type = type;
        values.parent = { id: userId };
        values.owners = [userId];
        values.description = description || "";
        values.institutionId = values.institutionId || selctedClass.institutionId;
        values.standardSets = updatedStandardsSets || selctedClass.standardSets;
        values.endDate = moment(endDate).format("x") || selctedClass.startDate;
        values.startDate = moment(startDate).format("x") || selctedClass.startDate;
        values.tags = tags.map(t => allTagsData.find(o => o._id === t));

        const editedClassValues = Object.assign({}, values);
        if (editedClassValues.courseId === "") {
          delete editedClassValues.courseId;
        }
        // eslint-disable-next-line react/no-unused-state
        this.setState({ submitted: true });
        updateClass({ params: editedClassValues, classId });
      }
    });
  };

  searchCourse = keyword => {
    const { searchCourseList, userOrgData } = this.props;
    const {
      districtIds: [districtId]
    } = userOrgData;
    const key = keyword.trim();
    const searchTerms = {
      districtId,
      active: 1
    };
    if (key) {
      searchTerms.search = {
        name: [{ type: "cont", value: key }],
        number: [{ type: "eq", value: key }],
        operator: "or"
      };
    }

    searchCourseList(searchTerms);
  };

  clearStandards = () => {
    const { form } = this.props;
    form.setFieldsValue({
      standardSets: []
    });
  };

  getBreadCrumbData = ({ classId, name, type }) => {
    const { match, location } = this.props;
    const { showPath, exitPath } = location?.state || {};
    type = type !== "class" ? "group" : "class";
    const pathList = match.url.split("/");
    let breadCrumbData = [];

    const editClassBreadCrumb = {
      title: `Edit ${type}`,
      to: match.url,
      state: { type, exitPath, showPath }
    };

    // pathList[2] determines the origin of the ClassEdit component
    switch (pathList[2]) {
      case "groups":
        breadCrumbData = [
          {
            title: pathList[2].split("-").join(" "),
            to: `/author/${pathList[2]}`
          },
          {
            title: `${name}`,
            to: showPath,
            state: { type, exitPath, editPath: match.url }
          }
        ];
        break;
      case "manageClass":
      default:
        breadCrumbData = [
          {
            title: "MANAGE CLASS",
            to: "/author/manageClass"
          },
          ...(type !== "class"
            ? [
                {
                  title: "GROUPS",
                  to: "/author/manageClass",
                  state: { currentTab: "group" }
                }
              ]
            : []),
          {
            title: `${name}`,
            to: `/author/manageClass/${classId}`
          }
        ];
    }
    return [...breadCrumbData, editClassBreadCrumb];
  };

  render() {
    const {
      curriculums,
      form,
      courseList,
      isSearching,
      selctedClass,
      updating,
      classLoaded,
      filteredCurriculums,
      setSubject,
      allTagsData,
      addNewTag,
      selectedSubject = "",
      userOrgData = {},
      location
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { exitPath, showPath, exitToShow } = location?.state || {};
    const { schools } = userOrgData;
    const {
      _id: classId,
      thumbnail = "",
      tags = [],
      name,
      type,
      description,
      startDate,
      endDate,
      grades,
      subject,
      standardSets,
      course,
      institutionId,
      cleverId
    } = selctedClass;

    if (!classLoaded) return <Spin />;

    return (
      <Form onSubmit={this.handleSubmit} style={{ position: "relative" }}>
        <Header classId={classId} type={type} exitPath={exitToShow ? showPath : exitPath} />
        <Spin spinning={updating}>
          <BreadCrumb
            ellipsis="calc(100% - 200px)"
            data={this.getBreadCrumbData({ classId, name, type })}
            style={{ position: "unset", margin: "20px 0 0 30px" }}
          />
          <Container>
            <FormTitle>{type === "custom" ? "Group" : "Class"} Details</FormTitle>
            <Row gutter={36}>
              <LeftContainer xs={8}>
                <LeftFields
                  tags={tags}
                  addNewTag={addNewTag}
                  allTagsData={allTagsData}
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  thumbnailUri={thumbnail}
                  setFieldsValue={setFieldsValue}
                  type={type}
                />
              </LeftContainer>
              <RightContainer xs={16}>
                <RightFields
                  defaultName={name}
                  defaultDescription={description}
                  defaultStartDate={startDate}
                  defaultEndDate={endDate}
                  defaultGrade={grades}
                  defaultSubject={subject}
                  defaultStandardSets={standardSets}
                  defaultCourse={course || undefined}
                  defaultSchool={institutionId}
                  schoolList={schools}
                  curriculums={curriculums}
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  courseList={courseList}
                  searchCourse={this.searchCourse}
                  isSearching={isSearching}
                  clearStandards={this.clearStandards}
                  filteredCurriculums={filteredCurriculums}
                  setSubject={setSubject}
                  subject={selectedSubject}
                  cleverId={cleverId}
                  tags={tags}
                  setFieldsValue={setFieldsValue}
                  allTagsData={allTagsData}
                  addNewTag={addNewTag}
                  type={type}
                />
              </RightContainer>
            </Row>
          </Container>
        </Spin>
      </Form>
    );
  }
}

const ClassEditForm = Form.create()(ClassEdit);

const enhance = compose(
  withNamespaces("classEdit"),
  withRouter,
  connect(
    state => {
      const selectedSubject = get(state, "manageClass.selectedSubject", "");
      return {
        curriculums: getCurriculumsListSelector(state),
        courseList: get(state, "coursesReducer.searchResult"),
        isSearching: get(state, "coursesReducer.searching"),
        userOrgData: getUserOrgData(state),
        userId: get(state, "user.user._id"),
        updating: get(state, "manageClass.updating"),
        selctedClass: get(state, "manageClass.entity", {}),
        classLoaded: get(state, "manageClass.classLoaded") && get(state, "manageClass.loaded"),
        allTagsData: getAllTagsSelector(state, "group"),
        filteredCurriculums: getFormattedCurriculumsSelector(state, { subject: selectedSubject }),
        selectedSubject
      };
    },
    {
      getCurriculums: getDictCurriculumsAction,
      updateClass: updateClassAction,
      searchCourseList: receiveSearchCourseAction,
      loadStudents: fetchStudentsByIdAction,
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      setSubject: setSubjectAction
    }
  )
);

export default enhance(ClassEditForm);
