import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import './index.less';
import { login, getUserInfo } from '@/store/actions';

const Login = (props) => {
  const { token, login } = props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleLogin = (data) => {
    // 登录完成后 发送请求 调用接口获取用户信息
    setLoading(true);
    login(data.phoneNumber, data.authCode, data.phoneArea)
      .then((res) => {
        // message.success('登录成功');
        handleUserInfo(res.token);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error);
      });
  };

  // 获取用户信息
  const handleUserInfo = (token) => {
    getUserInfo(token)
      .then((data) => {})
      .catch((error) => {
        message.error(error);
      });
  };

  const handleSubmit = async () => {
    // 阻止事件的默认行为
    // event.preventDefault();

    // 对所有表单字段进行检验
    try {
      const values = await form.validateFields();
      handleLogin({phoneNumber: values.username, authCode: values.password, phoneArea: '+86'});
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  if (token) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <DocumentTitle title={'用户登录'}>
      <div className="login-container">
        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <Form onFinish={handleSubmit} className="content"  requiredMark={false} layout="vertical" form={form}>
          <div className="title">
            <h2>用户登录</h2>
          </div>
          <Spin spinning={loading} tip="登录中...">
            <Form.Item
              name="username"
              label="Phone"
              rules={[
                { required: true, message: 'Please input your Phone!' },
              ]}>
              <Input
                className='username'
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}>
              <Input
                className='password'
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <div className='forgot-box'>
                <a className='password-reset' href="xxx">Forgot password?</a>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button">
                登录
              </Button>
              <Button
                type="default"
                htmlType="submit"
                className="create-form-button">
                Create an account
              </Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    </DocumentTitle>
  );
};

// const WrapLogin = Form.create()(Login);

export default connect((state) => state.user, { login })(Login);
