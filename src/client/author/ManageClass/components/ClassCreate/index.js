import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty, find, get } from "lodash";
import { Form, Divider } from "antd";
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
    loadCourseListData: PropTypes.func.isRequired,
    courseList: PropTypes.array.isRequired,
    cancelCreate: PropTypes.func
  };

  static defaultProps = {
    cancelCreate: () => null
  };

  componentDidMount() {
    const { curriculums, getCurriculums, loadCourseListData, courseList } = this.props;

    if (isEmpty(curriculums)) {
      getCurriculums();
    }

    if (isEmpty(courseList)) {
      loadCourseListData({ searchText: "Edulastic" });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, userId, userOrgData } = this.props;
    const { districtId } = userOrgData;
    form.validateFields((err, values) => {
      if (!err) {
        const { createClass, curriculums } = this.props;
        const { standardSets, endDate, startDate } = values;

        const updatedStandardsSets = standardSets.map(el => {
          const selectedCurriculum = find(curriculums, curriculum => curriculum._id === el);
          return {
            _id: selectedCurriculum._id,
            name: selectedCurriculum.curriculum
          };
        });

        values.districtId = districtId;
        values.type = "class";

        values.parent = { _id: userId };
        values.owners = [userId];

        values.standardSets = updatedStandardsSets;
        values.endDate = moment(endDate).format("X");
        values.startDate = moment(startDate).format("x");

        createClass(values);
      }
    });
  };

  render() {
    const { curriculums, form, courseList, userOrgData, cancelCreate } = this.props;
    const { getFieldDecorator } = form;
    const { defaultSchool, schools } = userOrgData;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header onCancel={cancelCreate} />
        <Container>
          <Divider orientation="left">
            <FormTitle>Class Details</FormTitle>
          </Divider>
          <FlexContainer alignItems="baseline">
            <LeftContainer>
              <LeftFields getFieldDecorator={getFieldDecorator} />
            </LeftContainer>
            <RightContainer>
              <RightFields
                curriculums={curriculums}
                getFieldDecorator={getFieldDecorator}
                schoolsData={defaultSchool}
                courseList={courseList}
                schoolList={schools}
              />
            </RightContainer>
          </FlexContainer>
        </Container>
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
      userOrgData: getUserOrgData(state),
      userId: get(state, "user.user._id")
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      createClass: createClassAction,
      loadCourseListData: receiveSearchCourseAction
    }
  )
);

export default enhance(ClassCreateForm);
