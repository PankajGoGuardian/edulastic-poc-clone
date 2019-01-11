import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import ProfileImage from '../../../assets/Profile.png';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const FormItem = Form.Item;
class ProfileContent extends React.Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = (e) => {
    const { form, login } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email }) => {
      if (!err) {
        login({
          password,
          email
        });
      }
    });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    const { flag, t } = this.props;
    return (
      <ProfileContentWrapper flag={flag}>
        <AssignmentContentWrapper>
          <Wrapper>
            <Content>
              <AssignmentDetail>
                <UserTitle>Welcome Zack</UserTitle>
                <UserSubTitle>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque eget mauris nunc.
                </UserSubTitle>
              </AssignmentDetail>
              <ProfileImg src={ProfileImage} alt="" />
              <FormWrapper onSubmit={this.handleSubmit}>
                <FormItemWrapper {...formItemLayout}>
                  <label>{t('common.title.firstNameInputLabel')}</label>
                  {getFieldDecorator('First Name', {
                    rules: [
                      {
                        required: true,
                        message: t('common.title.firstName')
                      }
                    ]
                  })(<Input />)}
                </FormItemWrapper>
                <FormItemWrapper {...formItemLayout}>
                  <label>{t('common.title.lastNameInputLabel')}</label>
                  {getFieldDecorator('Last Name', {
                    rules: [
                      {
                        required: true,
                        message: t('common.title.lastName')
                      }
                    ]
                  })(<Input />)}
                </FormItemWrapper>
                <FormItemWrapper {...formItemLayout}>
                  <label>{t('common.title.emailInputLabel')}</label>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        type: 'email',
                        message: t('common.title.validemail')
                      },
                      {
                        required: true,
                        message: t('common.title.email')
                      }
                    ]
                  })(<Input />)}
                </FormItemWrapper>
                <FormItemWrapper {...formItemLayout}>
                  <label>{t('common.title.passwordInputLabel')}</label>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: t('common.title.password')
                      }
                    ]
                  })(<Input type="password" />)}
                </FormItemWrapper>{' '}
                <FormItem {...tailFormItemLayout}>
                  <CancelButton
                    type="primary"
                    ghost
                    htmlType="submit"
                  >
                    {t('common.title.cancel')}
                  </CancelButton>
                  <SaveButton
                    type="primary"
                    htmlType="submit"
                  >
                    {t('common.title.save')}
                  </SaveButton>
                </FormItem>
              </FormWrapper>
            </Content>
          </Wrapper>
        </AssignmentContentWrapper>
      </ProfileContentWrapper>
    );
  }
}

const ProfileForm = Form.create()(ProfileContent);

const enhance = compose(withNamespaces('profile'));

export default React.memo(enhance(ProfileForm));

ProfileContent.propTypes = {
  flag: PropTypes.bool.isRequired
};

const Wrapper = styled.div`
  padding: 1rem 0rem;
`;

const ProfileContentWrapper = styled(AssignmentsContent)`
  text-align: center;
`;

const ProfileImg = styled.img`
  margin: 2rem;
`;

const AssignmentDetail = styled.div`
  padding: 1.5rem 0rem;
  border-bottom: 1px solid #f2f2f2;
`;

const UserTitle = styled.p`
  font-weight: 700;
  color: #434b5d;
`;

const UserSubTitle = styled.p`
  font-size: 0.8rem;
  color: #434b5d;
`;

const Content = styled.div``;

const FormWrapper = styled(Form)`
  text-align: left;
`;

const FormItemWrapper = styled(FormItem)`
  width: 50%;
  display: inline-block;
  @media (max-width: 425px) {
    width: 100%;
    display: block;
  }
`;

const SaveButton = styled(Button)`
  width: 100px;
`;

const CancelButton = styled(SaveButton)`
  margin-right: 1rem;
`;
