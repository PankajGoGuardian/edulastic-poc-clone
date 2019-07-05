import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { isEmpty, find, get } from "lodash";
import { Form, Divider, Spin } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";
// actions
import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { updateClassAction, fetchStudentsByIdAction } from "../../ducks";

// selectors
import { getCurriculumsListSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgData } from "../../../src/selectors/user";
import { receiveSearchCourseAction } from "../../../Courses/ducks";

// componentes
import Header from "./Header";
import LeftFields from "./LeftFields";
import RightFields from "./RightFields";
import { Container, FormTitle, LeftContainer, RightContainer } from "./styled";

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
    const { curriculums, getCurriculums, selctedClass, loadStudents, match } = this.props;
    if (isEmpty(selctedClass)) {
      const { classId } = match.params;
      loadStudents({ classId });
    }

    if (isEmpty(curriculums)) {
      getCurriculums();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, userId, userOrgData } = this.props;
    const { districtId } = userOrgData;
    form.validateFields((err, values) => {
      if (!err) {
        const { updateClass, curriculums, selctedClass } = this.props;
        const { standardSets, endDate, startDate } = values;
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
        name: { type: "cont", value: key },
        number: { type: "eq", value: key },
        operator: "or"
      };
    }

    searchCourseList(searchTerms);
  };

  render() {
    const { curriculums, form, courseList, isSearching, selctedClass, updating, classLoaded } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const {
      _id: classId,
      thumbnail = "",
      tags = [],
      name,
      startDate,
      endDate,
      grade,
      subject,
      standardSets,
      course,
      institutionId
    } = selctedClass;
    if (!classLoaded) return <Spin />;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Header classId={classId} />
        <Spin spinning={updating}>
          <Container>
            <Divider orientation="left">
              <FormTitle>Class Details</FormTitle>
            </Divider>
            <FlexContainer alignItems="baseline">
              <LeftContainer>
                <LeftFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  thumbnailUri={thumbnail}
                  tags={tags}
                />
              </LeftContainer>
              <RightContainer>
                <RightFields
                  defaultName={name}
                  defaultStartDate={startDate}
                  defaultEndDate={endDate}
                  defaultGrade={grade}
                  defaultSubject={subject}
                  defaultStandardSets={standardSets}
                  defaultCourse={course}
                  defaultSchool={institutionId}
                  curriculums={curriculums}
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  courseList={courseList}
                  searchCourse={this.searchCourse}
                  isSearching={isSearching}
                />
              </RightContainer>
            </FlexContainer>
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
    state => ({
      curriculums: getCurriculumsListSelector(state),
      courseList: get(state, "coursesReducer.searchResult"),
      isSearching: get(state, "coursesReducer.searching"),
      userOrgData: getUserOrgData(state),
      userId: get(state, "user.user._id"),
      updating: get(state, "manageClass.updating"),
      selctedClass: get(state, "manageClass.entity", {}),
      classLoaded: get(state, "manageClass.classLoaded")
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      updateClass: updateClassAction,
      searchCourseList: receiveSearchCourseAction,
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassEditForm);
