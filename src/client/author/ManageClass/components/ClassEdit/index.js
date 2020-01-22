import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { isEmpty, find, get } from "lodash";
import { Form, Spin, Row } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { Paper } from "@edulastic/common";
// actions
import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { updateClassAction, fetchStudentsByIdAction, setSubjectAction } from "../../ducks";

// selectors
import { getCurriculumsListSelector, getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgData } from "../../../src/selectors/user";
import { receiveSearchCourseAction } from "../../../Courses/ducks";

// componentes
import Header from "./Header";
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

  componentDidUpdate({ updating, history, selctedClass }, { submitted }) {
    if (updating && submitted) {
      const { _id: classId } = selctedClass;
      history.push(`/author/manageClass/${classId}`);
    }
  }

  componentDidMount() {
    const { curriculums, getCurriculums, selctedClass, loadStudents, match, getAllTags } = this.props;
    if (isEmpty(selctedClass)) {
      const { classId } = match.params;
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
    const { districtId } = userOrgData;
    form.validateFields((err, values) => {
      if (!err) {
        const { updateClass, curriculums, selctedClass } = this.props;
        const { standardSets, endDate, startDate, tags } = values;
        const { _id: classId } = selctedClass;

        const updatedStandardsSets = standardSets.map(el => {
          const selectedCurriculum = find(curriculums, curriculum => curriculum._id === el);
          return {
            _id: selectedCurriculum._id,
            name: selectedCurriculum.curriculum
          };
        });

        values.districtId = districtId;
        values.type = "class";

        values.parent = { id: userId };
        values.owners = [userId];

        values.standardSets = updatedStandardsSets;
        values.endDate = moment(endDate).format("x");
        values.startDate = moment(startDate).format("x");
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
    const { districtId } = userOrgData;
    const key = keyword.trim();
    const searchTerms = {
      districtId
    };
    if (key) {
      searchTerms["search"] = {
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
      userOrgData = {}
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

    const {
      _id: classId,
      thumbnail = "",
      tags = [],
      name,
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

    const { schools } = userOrgData;

    return (
      <Form onSubmit={this.handleSubmit} style={{ position: "relative" }}>
        <Header classId={classId} />
        <Spin spinning={updating}>
          <Container>
            <Paper padding="40px">
              <FormTitle>Class Details</FormTitle>
              <Row gutter={36}>
                <LeftContainer xs={8}>
                  <LeftFields
                    getFieldDecorator={getFieldDecorator}
                    getFieldValue={getFieldValue}
                    thumbnailUri={thumbnail}
                    setFieldsValue={setFieldsValue}
                  />
                </LeftContainer>
                <RightContainer xs={16}>
                  <RightFields
                    defaultName={name}
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
                  />
                </RightContainer>
              </Row>
            </Paper>
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
        classLoaded: get(state, "manageClass.classLoaded"),
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
