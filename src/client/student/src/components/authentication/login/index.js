import React from 'react';
import { Row, Col, Form, Icon, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { loginAction } from '../../../actions/login';

const FormItem = Form.Item;

class Login extends React.Component {
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
      form: { getFieldDecorator },
      t
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 }
      },
      wrapperCol: {
        xs: { span: 24 }
      }
    };

    return (
      <div>
        <LoginWrapper className="registration-wrapper">
          <Row className="regs-head" type="flex" align="middle">
            <Col className="head-col1" span={12}><img src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png" alt="Edulastic" /></Col>
            <Col className="head-col2" span={12} align="right">
              <span>{t('common.donthaveanaccount')}</span>
              <Link to="/signup">{t('common.signupbtn')}</Link>
            </Col>
          </Row>
          <Row className="regs-body">
            <Col xs={18} sm={12} md={9} lg={8} xl={7} offset={3}>
              <FormWrapper>
                <Row className="form-head">
                  <h3 align="center"><b>{t('common.loginboxheading')}</b></h3>
                  <Col className="signIn-btns" span={20} offset={2}><Icon type="google" /> {t('common.googlesigninbtn')}</Col>
                  <Col className="signIn-btns" span={20} offset={2}><Icon type="loading" /> {t('common.office365signinbtn')}</Col>
                  <Col className="signIn-btns" span={20} offset={2}><Icon type="loading" /> {t('common.cleversigninbtn')}</Col>
                </Row>
                <Row className="form-body">
                  <Col span={20} offset={2}>
                    <h5 align="center">{t('common.formboxheading')}</h5>
                    <Form onSubmit={this.handleSubmit}>
                      <FormItem {...formItemLayout} label={t('common.loginidinputlabel')}>
                        {getFieldDecorator('email', {
                          rules: [
                            {
                              type: 'email',
                              message: t('common.validation.validemail')
                            },
                            {
                              required: true,
                              message: t('common.validation.emptyemailid')
                            }
                          ]
                        })(<Input prefix={<Icon type="mail" theme="filled" style={{ color: 'rgb(31,181,139)' }} />} />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label={t('common.loginpasswordinputlabel')}>
                        {getFieldDecorator('password', {
                          rules: [
                            {
                              required: true,
                              message: t('common.validation.emptypassword')
                            }
                          ]
                        })(<Input prefix={<Icon type="lock" theme="filled" style={{ color: 'rgb(31,181,139)' }} />} type="password" />)}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('remember', {
                          valuePropName: 'checked',
                          initialValue: true
                        })(
                          <Checkbox>{t('common.remembermetext')}</Checkbox>
                        )}
                        <a className="pull-right" href="#" style={{ marginTop: 1 }}>{t('common.forgotpasswordtext')}</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">{t('common.signinbtn')}</Button>
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
              </FormWrapper>
            </Col>
          </Row>
        </LoginWrapper>
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);

const enhance = compose(
  withNamespaces('login'),
  connect(
    null,
    { login: loginAction }
  )
);

export default enhance(LoginForm);

const LoginWrapper = styled.div`
  position: fixed;
  background: #999999 url('https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80');
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0px;
  padding: 0px;
  height: 100vh;
  width: 100%;
  .regs-head {
    padding: 10px 15px;
    background: rgba(0,0,0,.2);
    position: fixed;
    color: white;
    left: 0;
    right: 0;
    .head-col2 {
      & > span {
        font-size: 12px;
        margin-right: 20px;
      }
      a {
        padding: 5px 40px;
        border: 1px solid #2d84dc;
        text-decoration: none;
        color: white;
        border-radius: 4px;
      }
    }
  }
  .regs-body {
    padding-top: 50px;
    margin-top: 50px;
  }
`;

const FormWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 8px;
  .form-head {
    background: #157ad8;
    background: -moz-linear-gradient(left, #157ad8 0%, #157ad8 19%, #36a0e2 54%, #36a0e2 100%);
    background: -webkit-linear-gradient(left, #157ad8 0%,#157ad8 19%,#36a0e2 54%,#36a0e2 100%);
    background: linear-gradient(to right, #157ad8 0%,#157ad8 19%,#36a0e2 54%,#36a0e2 100%);
    padding: 15px;
    h3 {
      color: white;
      margin: 5px 0px 15px;
    }
    .signIn-btns {
      background: #ffffff;
      margin-top: 5px;
      border-radius: 4px;
      text-align: center;
      font-size: 10px;
      padding: 8px;
      cursor: pointer;
      i {
        float: left;
        font-size: 14px;
      }
    }
  }
  .form-body {
    padding: 15px;
    h5 {
      margin-bottom: 25px;
      margin-top: 10px;
      font-size: 13px;
    }
    form {
      .ant-form-item {
        margin-bottom: 15px;
      }
      .ant-form-item-label {
        text-align: left;
        line-height: normal;
        margin-bottom: 3px;
        label {
          font-size: 12px;
          &.ant-form-item-required {
            &:before, &:after {
              content: '';
            }
          }
        }
      }
      .ant-input:focus {
        border: 1px solid #1fb58b;
      }
      .has-error {
        .ant-form-explain, .ant-form-split { font-size: 10px; }
      }
      .ant-form-item-children {
        width: 100%;
        float: left;
        label, a {
          line-height: normal;
          font-size: 10px;
        }
        label { float: left; }
      }
      .login-form-button {
        width: 100%;
        background: #1fb58b;
        font-size: 13px;
        color: white;
        border: 1px solid #1fb58b;
        font-weight: 600;
        margin-top: 10px;
      }
    }
  }
`;
