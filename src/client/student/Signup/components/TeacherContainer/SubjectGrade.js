import { extraDesktopWidthMax, mobileWidthMax, themeColor, title, white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { Button, Col, Form, Row, Select } from "antd";
import { find, get, isEmpty, map, mapKeys, pick } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
// actions
import { getDictCurriculumsAction } from "../../../../author/src/actions/dictionaries";
// selectors
import { getCurriculumsListSelector, getFormattedCurriculums } from "../../../../author/src/selectors/dictionaries";
import { getInterestedCurriculumsSelector } from "../../../../author/src/selectors/user";
import selectsData from "../../../../author/TestPage/components/common/selectsData";
import { saveSubjectGradeAction, saveSubjectGradeloadingSelector } from "../../duck";

const { allGrades, allSubjects } = selectsData;

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
          const newCurriculum = mapKeys(pick(filterData, ["_id", "curriculum", "subject"]), (vaule, key) => {
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
                      rules: [
                        {
                          required: true,
                          message: "Grade is not selected"
                        }
                      ]
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
                      rules: [
                        {
                          required: true,
                          message: "Subject Area is not selected"
                        }
                      ]
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
  text-align: left;
  h3 {
    font-size: 45px;
    font-weight: bold;
    color: ${title};
    line-height: 1;
    letter-spacing: -2.25px;
    margin-top: 0px;
    margin-bottom: 15px;
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
  @media (min-width: ${extraDesktopWidthMax}) {
    h5 {
      font-size: 24px;
    }
  }
`;

const SelectForm = styled(Form)`
  max-width: 640px;
  margin: 0px auto;
  padding: 25px;
  text-align: center;

  .ant-form-item {
    text-align: left;

    label {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: #434b5d;
    }

    .ant-select-arrow {
      svg {
        fill: ${themeColor};
      }
    }
  }
  .ant-form-item-required::before {
    content: "";
  }
  .ant-form-item-label > label::after {
    content: "";
  }
  .ant-form-explain {
    padding-top: 8px;
  }
  .ant-select-selection {
    border: none;
    border-bottom: 1px solid #a0a0a0;
    border-radius: 0;
    min-height: 45px;
    box-shadow: none !important;
    .ant-select-selection__rendered {
      line-height: 45px;
      .ant-input {
        min-height: 43px;
        box-shadow: none;
        border: none;
        font-size: 20px;
        &:hover {
          box-shadow: none;
          border: none;
        }
      }
      .ant-select-selection__choice {
        background: #e3e3e3;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        padding: 0px 15px;
        .ant-select-selection__choice__content {
          font-size: 11px;
          color: ${title};
          text-transform: uppercase;
          margin-right: 5px;
          svg {
            width: 8px;
            height: 8px;
            fill: ${title};
          }
        }
        .ant-select-selection__choice__remove {
          right: 5px;
        }
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
  min-width: 100%;
  color: ${white};
  text-transform: uppercase;
  text-align: center;
  border: 0px;
  &:hover {
    background: ${themeColor};
    color: ${white};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`;
