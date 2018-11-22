import React from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
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

    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '0.5rem',
          padding: '2rem',
          boxShadow: '0 0.3rem 1rem rgba(0,0,0,0.1)'
        }}
      >
        <Header>Login</Header>
        <FormItem {...formItemLayout} label="E-mail" style={{ width: '25rem' }}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
          style={{ width: '25rem' }}
        >
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!'
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const LoginForm = Form.create()(Login);

export default connect(
  () => {},
  { login: loginAction }
)(LoginForm);

const Header = styled.h2`
  text-align: center;
`;
