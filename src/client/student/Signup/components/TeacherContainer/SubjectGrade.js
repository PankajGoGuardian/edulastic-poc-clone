import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty, filter, map, pick, find, mapKeys, get } from "lodash";
import { Row, Col, Select, Form, Button } from "antd";
import styled from "styled-components";
import { IconHeader } from "@edulastic/icons";
import { themeColor, white, title, fadedGrey, mobileWidthMax } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import selectsData from "../../../../author/TestPage/components/common/selectsData";
// actions
import { getDictCurriculumsAction } from "../../../../author/src/actions/dictionaries";
import { saveSubjectGradeAction, saveSubjectGradeloadingSelector } from "../../duck";
// selectors
import {
  getCurriculumsListSelector,
  getFormattedCurriculumsSelector,
  getFormattedCurriculums
} from "../../../../author/src/selectors/dictionaries";
import { getInterestedCurriculumsSelector } from "../../../../author/src/selectors/user";

const { allGrades, allSubjects, defaultStandards } = selectsData;

const { Option } = Select;
const schoolIcon = "//cdn.edulastic.com/JS/webresources/images/as/signup-join-school-icon.png";

class SubjectGrade extends React.Component {
  state = {
    subjects: [],
    grades: []
  };

  static propTypes = {
    form: PropTypes.object.isRequired,
    getCurriculums: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    saveSubjectGrade: PropTypes.func.isRequired,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        curriculum: PropTypes.string.isRequired,
        grades: PropTypes.array.isRequired,
        subject: PropTypes.string.isRequired
      })
    ).isRequired
  };

  componentDidMount() {
    const { curriculums, getCurriculums } = this.props;

    if (isEmpty(curriculums)) {
      getCurriculums();
    }
  }

  updateSubjects = e => {
    this.setState({ subjects: e });
  };

  updateGrades = e => {
    this.setState({ grades: e });
  };

  handleSubmit = e => {
    const { grades: defaultGrades, subjects: defaultSubjects } = this.state;
    const { form, userInfo, saveSubjectGrade } = this.props;
    const isSignUp = true;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { curriculums } = this.props;

        const data = {
          orgId: userInfo._id,
          orgType: userInfo.role,
          districtId: userInfo.districtId,
          isSignUp,
          curriculums: [],
          defaultGrades,
          defaultSubjects
        };

        map(values.standard, id => {
          const filterData = find(curriculums, el => el._id === id);
          let newCurriculum = mapKeys(pick(filterData, ["_id", "curriculum", "subject"]), (vaule, key) => {
            if (key === "curriculum") key = "name";
            return key;
          });
          newCurriculum.grades = values.grade;
          data.curriculums.push(newCurriculum);
        });

        saveSubjectGrade({ ...data });
      }
    });
  };

  render() {
    const { subjects } = this.state;
    const { interestedCurriculums, curriculums, form, saveSubjectGradeloading, t } = this.props;
    const { showAllStandards } = get(this, "props.userInfo.orgData", {});
    const formattedCurriculums = isEmpty(subjects)
      ? []
      : getFormattedCurriculums(interestedCurriculums, curriculums, { subject: subjects }, showAllStandards);
    const { getFieldDecorator } = form;
    const filteredAllGrades = allGrades.filter(item => item.isContentGrade !== true);
    const _allSubjects = allSubjects.filter(item => item.value);
    return (
      <>
        <SubjectGradeBody>
          <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
            <FlexWrapper type="flex" align="middle">
              <BannerText xs={24} sm={18} md={12}>
                <SchoolIcon src={schoolIcon} alt="" />
                <h3>
                  {t("component.signup.teacher.choosesubject")} <br /> {t("component.signup.teacher.choosegrade")}
                </h3>
                <h5>{t("component.signup.teacher.gsinfotext")}</h5>
              </BannerText>
              <Col xs={24} sm={18} md={12}>
                <SelectForm onSubmit={this.handleSubmit}>
                  <Form.Item label="Grade">
                    {getFieldDecorator("grade", {
                      rules: [{ required: true, message: "Grade is not selected" }]
                    })(
                      <GradeSelect
                        data-cy="grade"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size="large"
                        placeholder="Select a grade or multiple grades"
                        mode="multiple"
                        onChange={this.updateGrades}
                        showArrow
                      >
                        {filteredAllGrades.map(el => (
                          <Option key={el.value} value={el.value}>
                            {el.text}
                          </Option>
                        ))}
                      </GradeSelect>
                    )}
                  </Form.Item>

                  <Form.Item label="Subject">
                    {getFieldDecorator("subjects", {
                      rules: [{ required: true, message: "Subject Area is not selected" }]
                    })(
                      <GradeSelect
                        data-cy="subject"
                        mode="multiple"
                        size="large"
                        placeholder="Select a subject"
                        onChange={this.updateSubjects}
                        showArrow
                      >
                        {_allSubjects.map(el => (
                          <Option key={el.value} value={el.value}>
                            {el.text}
                          </Option>
                        ))}
                      </GradeSelect>
                    )}
                  </Form.Item>
                  <Form.Item label="Standard Sets">
                    {getFieldDecorator("standard", {
                      rules: [{ required: false, message: "Standard Area is not selected" }]
                    })(
                      <GradeSelect
                        data-cy="standardSet"
                        optionFilterProp="children"
                        filterOption
                        size="large"
                        placeholder="Select your standard sets"
                        mode="multiple"
                        showArrow
                      >
                        {formattedCurriculums.map(({ value, text, disabled }) => (
                          <Option key={value} value={value} disabled={disabled}>
                            {text}
                          </Option>
                        ))}
                      </GradeSelect>
                    )}
                  </Form.Item>

                  <ProceedBtn data-cy="getStarted" type="primary" htmlType="submit" disabled={saveSubjectGradeloading}>
                    Get Started
                  </ProceedBtn>
                </SelectForm>
              </Col>
            </FlexWrapper>
          </Col>
        </SubjectGradeBody>
      </>
    );
  }
}

const SubjectGradeForm = Form.create()(SubjectGrade);

const enhance = compose(
  withNamespaces("login"),
  connect(
    state => ({
      curriculums: getCurriculumsListSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      saveSubjectGradeloading: saveSubjectGradeloadingSelector(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      saveSubjectGrade: saveSubjectGradeAction
    }
  )
);

export default enhance(SubjectGradeForm);

const SubjectGradeBody = styled(Row)`
  padding: 60px 0px;
  background: ${white};
  min-height: calc(100vh - 93px);
`;

const FlexWrapper = styled(Row)`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
  }
`;

const BannerText = styled(Col)`
  text-align: center;
  h3 {
    font-size: 38px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
    color: ${title};
  }
  h5 {
    font-size: 13px;
    margin-top: 10px;
    color: ${title};
  }

  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 30px;
    h3 {
      font-weight: 400;
    }
    h5 {
      font-size: 16px;
    }
  }
`;

const SelectForm = styled(Form)`
  max-width: 640px;
  margin: 0px auto;
  padding: 32px;
  background: ${fadedGrey};
  border-radius: 8px;
  text-align: center;

  .ant-form-item {
    text-align: left;

    label {
      font-weight: 800;
      font-size: 16px;
    }

    .ant-select-arrow {
      svg {
        fill: ${themeColor};
      }
    }
  }
`;

const SchoolIcon = styled.img`
  width: 80px;
  margin-bottom: 10px;
`;

const GradeSelect = styled(Select)`
  width: 100%;
`;

const ProceedBtn = styled(Button)`
  background: ${themeColor};
  min-width: 60%;
  color: ${white};
  text-transform: uppercase;
  text-align: center;
  border: 0px;
  &:hover {
    background: ${themeColor};
    color: ${white};
  }
`;
