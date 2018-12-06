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
                <AssignmentTitle>Welcome Zack</AssignmentTitle>
                <Assignment>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque eget mauris nunc.
                </Assignment>
              </AssignmentDetail>
              <img src={ProfileImage} alt="ahsgj" style={{ margin: '2rem' }} />
              <Form onSubmit={this.handleSubmit} style={{ textAlign: 'left' }}>
                <FormItemWrapper {...formItemLayout}>
                  <label>First Name</label>
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
                  <label>Last Name</label>
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
                  <label>Email</label>
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
                  <label>Password</label>
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
                  <Button
                    type="primary"
                    ghost
                    style={{ width: 100, marginRight: '1rem' }}
                    htmlType="submit"
                  >
                    {t('common.title.cancel')}
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: 100 }}
                    htmlType="submit"
                  >
                    {t('common.title.save')}
                  </Button>
                </FormItem>
              </Form>
            </Content>
          </Wrapper>
        </AssignmentContentWrapper>
      </ProfileContentWrapper>
    );
  }
}

const ProfileForm = Form.create()(ProfileContent);

const enhance = compose(withNamespaces('dashboard'));

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

const AssignmentTitle = styled.p`
  font-weight: 700;
  color: #434b5d;
`;

const Assignment = styled.p`
  font-size: 0.8rem;
  color: #434b5d;
`;
const AssignmentDetail = styled.div`
  padding: 1.5rem 0rem;
  border-bottom: 1px solid #f2f2f2;
`;

const Content = styled.div``;

const FormItemWrapper = styled(FormItem)`
  width: 50%;
  display: inline-block;
  @media (max-width: 425px) {
    width: 100%;
    display: block;
  }
`;
