import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty, find, get, pickBy, identity } from "lodash";
import { Form, Divider, Spin } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";
// actions
import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { createClassAction } from "../../ducks";
// selectors
import { getCurriculumsListSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgData } from "../../../src/selectors/user";
import { receiveSearchCourseAction } from "../../../Courses/ducks";

// componentes
import Header from "./Header";
import LeftFields from "./LeftFields";
import RightFields from "./RightFields";
import { Container, FormTitle, LeftContainer, RightContainer } from "./styled";

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
    form: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    userOrgData: PropTypes.object.isRequired,
    createClass: PropTypes.func.isRequired,
    searchCourseList: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    error: PropTypes.any,
    courseList: PropTypes.array.isRequired,
    changeView: PropTypes.func
  };

  state = {};

  static defaultProps = {
    changeView: () => null,
    error: null
  };

  componentDidMount() {
    const { curriculums, getCurriculums } = this.props;

    if (isEmpty(curriculums)) {
      getCurriculums();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, userId, userOrgData } = this.props;
    const { districtId } = userOrgData;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { createClass, curriculums } = this.props;
        const { standardSets, endDate, startDate, courseId, grade, subject } = values;

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
        values.courseId = isEmpty(courseId) ? "" : courseId;
        values.grade = isEmpty(grade) ? "Other" : grade;
        values.subject = isEmpty(subject) ? "Other Subjects" : subject;

        // eslint-disable-next-line react/no-unused-state
        this.setState({ submitted: true });
        createClass(pickBy(values, identity));
      }
    });
  };

  searchCourse = keyword => {
    if (keyword) {
      const { searchCourseList, userOrgData } = this.props;
      const { districtId } = userOrgData;
      const serachTerms = {
        districtId,
        search: {
          name: { type: "cont", value: keyword }
        },
        active: 1,
        page: 0,
        limit: 50
      };
      searchCourseList(serachTerms);
    }
  };

  render() {
    const { curriculums, form, courseList, userOrgData, changeView, isSearching, creating, error } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { defaultSchool, schools } = userOrgData;
    const { submitted } = this.state;
    if (!creating && submitted && isEmpty(error)) {
      changeView("details");
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Header onCancel={() => changeView("list")} />
        <Spin spinning={creating}>
          <Container>
            <Divider orientation="left">
              <FormTitle>Class Details</FormTitle>
            </Divider>
            <FlexContainer alignItems="baseline">
              <LeftContainer>
                <LeftFields getFieldDecorator={getFieldDecorator} getFieldValue={getFieldValue} />
              </LeftContainer>
              <RightContainer>
                <RightFields
                  curriculums={curriculums}
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  defaultSchool={defaultSchool}
                  courseList={courseList}
                  schoolList={schools}
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

const ClassCreateForm = Form.create()(ClassCreate);

const enhance = compose(
  withNamespaces("classCreate"),
  connect(
    state => ({
      curriculums: getCurriculumsListSelector(state),
      courseList: get(state, "coursesReducer.searchResult"),
      isSearching: get(state, "coursesReducer.searching"),
      userOrgData: getUserOrgData(state),
      userId: get(state, "user.user._id"),
      creating: get(state, "manageClass.creating"),
      error: get(state, "manageClass.error")
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      createClass: createClassAction,
      searchCourseList: receiveSearchCourseAction
    }
  )
);

export default enhance(ClassCreateForm);
