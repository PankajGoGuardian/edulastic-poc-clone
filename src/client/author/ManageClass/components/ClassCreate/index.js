import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { capitalize, isEmpty, find, get, pickBy, identity } from "lodash";
import { Form, Spin, Row } from "antd";
import { withNamespaces } from "@edulastic/localization";
// actions
import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { createClassAction, getSelectedSubject, setSubjectAction } from "../../ducks";
// selectors
import { getCurriculumsListSelector, getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgData } from "../../../src/selectors/user";
import { receiveSearchCourseAction, getCoursesForDistrictSelector } from "../../../Courses/ducks";

// componentes
import Header from "./Header";
import BreadCrumb from "../../../src/components/Breadcrumb";
import LeftFields from "./LeftFields";
import RightFields from "./RightFields";
import { Container, FormTitle, LeftContainer, RightContainer } from "./styled";
import { addNewTagAction, getAllTagsAction, getAllTagsSelector } from "../../../TestPage/ducks";

class ClassCreate extends React.Component {
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
    filteredCurriculums: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string,
        disabled: PropTypes.bool
      })
    ).isRequired,
    setSubject: PropTypes.func.isRequired,
    selectedSubject: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    userOrgData: PropTypes.object.isRequired,
    createClass: PropTypes.func.isRequired,
    searchCourseList: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    error: PropTypes.any,
    courseList: PropTypes.array.isRequired
  };

  state = {};

  static defaultProps = {
    error: null
  };

  componentDidMount() {
    const { curriculums, getCurriculums, getAllTags } = this.props;

    if (isEmpty(curriculums)) {
      getCurriculums();
    }
    getAllTags({ type: "group" });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, userId, userOrgData, allTagsData, location } = this.props;
    const { districtId } = userOrgData;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { createClass, curriculums } = this.props;
        const { standardSets, endDate, startDate, courseId, grades, subject, tags } = values;

        // default start and end date
        const term =
          userOrgData.terms.length &&
          userOrgData.terms.find(term => term.endDate > Date.now() && term.startDate < Date.now());
        const defaultStartDate = moment(),
          defaultEndDate = term ? term.endDate : defaultStartDate.add(1, "year");

        const updatedStandardsSets = standardSets?.map(el => {
          const selectedCurriculum = find(curriculums, curriculum => curriculum._id === el);
          return {
            _id: selectedCurriculum._id,
            name: selectedCurriculum.curriculum
          };
        });

        values.districtId = districtId;
        values.type = location?.state?.type === "group" ? "custom" : "class";
        values.parent = { id: userId };
        values.owners = [userId];
        values.standardSets = updatedStandardsSets || [];
        values.endDate = moment(endDate || defaultEndDate).format("x");
        values.startDate = moment(startDate || defaultStartDate).format("x");
        values.courseId = isEmpty(courseId) ? "" : courseId;
        values.grades = isEmpty(grades) ? ["O"] : grades;
        values.subject = isEmpty(subject) ? "Other Subjects" : subject;
        values.tags = tags?.map(t => allTagsData.find(o => o._id === t));

        values.studentIds = location?.state?.studentIds || [];

        // eslint-disable-next-line react/no-unused-state
        this.setState({ submitted: true });
        createClass(pickBy(values, identity));
      }
    });
  };

  clearStandards = () => {
    const { form } = this.props;
    form.setFieldsValue({
      standardSets: []
    });
  };

  searchCourse = keyword => {
    const { searchCourseList, userOrgData } = this.props;
    const { districtId } = userOrgData;
    let searchTerms;
    const key = keyword.trim();
    if (keyword == "") {
      searchTerms = {
        districtId
      };
    } else {
      searchTerms = {
        districtId,
        search: {
          name: [{ type: "cont", value: key }],
          number: [{ type: "eq", value: key }],
          operator: "or"
        }
      };
    }

    searchCourseList(searchTerms);
  };

  getBreadCrumbData = () => {
    const { match, location } = this.props;
    const { type, exitPath } = location?.state || {};
    const pathList = match.url.split("/");
    let breadCrumbData = [];

    const createClassBreadCrumb = {
      title: `Create ${type}`,
      to: match.url,
      state: { type, exitPath }
    };

    // pathList[2] determines the origin of the ClassCreate component
    switch (pathList[2]) {
      case "reports":
        breadCrumbData = [
          {
            title: "Reports",
            to: "/author/reports"
          },
          {
            // pathList[3] contains the report-type
            title: pathList[3].split("-").join(" "),
            to: exitPath
          }
        ];
        return [...breadCrumbData, createClassBreadCrumb];
      case "manageClass":
      default:
        breadCrumbData = [
          {
            title: "MANAGE CLASS",
            to: "/author/manageClass"
          },
          {
            title: "GROUPS",
            to: "/author/manageClass",
            state: { currentTab: "group" }
          }
        ];
        return type === "class"
          ? [breadCrumbData[0], createClassBreadCrumb]
          : [...breadCrumbData, createClassBreadCrumb];
    }
  };

  render() {
    const {
      form,
      courseList,
      userOrgData,
      isSearching,
      creating,
      error,
      filteredCurriculums,
      setSubject,
      selectedSubject,
      entity,
      allTagsData,
      addNewTag,
      history,
      location
    } = this.props;

    const { type, exitPath } = location?.state || {};

    const { _id: classId, tags } = entity;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { defaultSchool, schools } = userOrgData;
    const { submitted } = this.state;
    if (!creating && submitted && isEmpty(error)) {
      if (exitPath) {
        history.push(exitPath);
      } else {
        history.push(`/author/manageClass/${classId}`);
      }
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Header type={type || "class"} exitPath={exitPath} />
        <Spin spinning={creating}>
          <BreadCrumb
            ellipsis="calc(100% - 200px)"
            data={this.getBreadCrumbData()}
            style={{ position: "unset", margin: "20px 0 0 30px" }}
          />
          <Container padding="30px">
            <FormTitle>{capitalize(type || "class")} Details</FormTitle>
            <Row gutter={36}>
              <LeftContainer xs={8}>
                <LeftFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  tags={tags}
                  setFieldsValue={setFieldsValue}
                  allTagsData={allTagsData}
                  addNewTag={addNewTag}
                  type={type || "class"}
                />
              </LeftContainer>
              <RightContainer xs={16}>
                <RightFields
                  selectedSubject={selectedSubject}
                  filteredCurriculums={filteredCurriculums}
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  defaultSchool={defaultSchool}
                  courseList={courseList}
                  schoolList={schools}
                  searchCourse={this.searchCourse}
                  isSearching={isSearching}
                  setSubject={setSubject}
                  userOrgData={userOrgData}
                  clearStandards={this.clearStandards}
                  tags={tags}
                  setFieldsValue={setFieldsValue}
                  allTagsData={allTagsData}
                  addNewTag={addNewTag}
                  type={type || "class"}
                />
              </RightContainer>
            </Row>
          </Container>
        </Spin>
      </Form>
    );
  }
}

const ClassCreateForm = Form.create()(ClassCreate);

const enhance = compose(
  withNamespaces("classCreate"),
  withRouter,
  connect(
    state => {
      const selectedSubject = getSelectedSubject(state);
      return {
        curriculums: getCurriculumsListSelector(state),
        courseList: getCoursesForDistrictSelector(state),
        isSearching: get(state, "coursesReducer.searching"),
        userOrgData: getUserOrgData(state),
        userId: get(state, "user.user._id"),
        creating: get(state, "manageClass.creating"),
        error: get(state, "manageClass.error"),
        entity: get(state, "manageClass.entity"),
        allTagsData: getAllTagsSelector(state, "group"),
        filteredCurriculums: getFormattedCurriculumsSelector(state, {
          subject: selectedSubject
        }),
        selectedSubject
      };
    },
    {
      getCurriculums: getDictCurriculumsAction,
      createClass: createClassAction,
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      searchCourseList: receiveSearchCourseAction,
      setSubject: setSubjectAction
    }
  )
);

export default enhance(ClassCreateForm);
