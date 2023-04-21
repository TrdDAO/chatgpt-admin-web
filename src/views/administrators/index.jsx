import { 
  getAdministrators,
  getAdministratorDetail,
  addAdministrator,
  editAdministrator,
  setAdministratorDisable,
  setAdministratorEnable,
  deleteAdministrator,
} from '@/service/administrators';
import CustomTable from '@/components/CustomTable';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  message,
  notification,
  Switch,
} from "antd";
import { PlusOutlined, DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from "react";
import './index.less';


// TODO
// 1. 删除API暂时没有
// 2. 表格功能，可抽象出来作为公共组件，props传不同API即可，不用个页面都写一遍

const ScriptBot = (props) => {
  const formDataDefault = {
    username: '',
    password: '',
    phone: '',
    email: '',
  }
  // 表格引用，用于触发里面的方法
  const tableRef = useRef(null);
  // 提示框
  const [messageApi, contextHolder] = message.useMessage();
  // 对话框
  const [modalApi, ModalContextHolder] = Modal.useModal();
  // 通知栏
  const [notificationApi, notContextHolder] = notification.useNotification();
  // 弹出框操作
  const [openModal, setOpenModal] = useState(false);
  // 表格store，用于做表单验证赋值等操作
  const [form] = Form.useForm();
  // 表单数据
  const [formData, setFormData] = useState(Object.assign({}, formDataDefault));
  // 禁用表单
  const [formDisable, setFormDisable] = useState(false);
  // 表单Id
  const [formId, setFormId] = useState("");
  // 提交编辑按钮loading
  const [submitLoading, setSubmitLoading] = useState(false);
  // test加载
  const [testLoading, setTestLoading] = useState(false);


  // 添加规则
  const handleEditScript = async () => {
    // 先校验数据，再发起请求
    await form.validateFields();
    const formData = form.getFieldsValue();
    
    const requestData = {
      username: formData.username,
      password: formData.password,
      phoneNumber: formData.phone,
      emailAddress: formData.email,
      profile: {
        avatarUrl: formData.profile.avatarUrl || '',
        description: formData.profile.description || '',
        gender: formData.profile.gender || null,
        nickname: formData.profile.nickname || '',
        settings: formData.profile.settings ? formData.profile.settings.reduce((result, current) => {
          const {key, value} = current;
          result[key] = value;
          return result
        }, {}) : {},
      },
    }
    const requestFn = formId ? editAdministrator : addAdministrator;
    setSubmitLoading(true);
    await requestFn(requestData, formId)
      .then(() => {
        messageApi.open({
          type: "success",
          content: formId ? "编辑成功" : "添加成功",
        });
        setOpenModal(false);
        tableRef.current.initTable();
      })
      .catch((msg) => {
        console.log(msg)
        messageApi.open({
          type: "error",
          content: msg || "请求失败",
        });
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  /**
   * 重置表单默认值
   * 注意执行 form.resetFields 会使用 initialValues 里得值
   * 这里直接给 initialValues 的值置为默认
   */
  const initFormData = ()=> {
    setFormId("");
    setFormData(Object.assign({}, formDataDefault));
    form.setFieldsValue(Object.assign({}, formDataDefault));
  }

  // 编辑表单
  const handleEditForm = (record) => {
    getAdministratorDetail(record.administratorId).then((res) => {
      // let data = {};
      // for (let [key, value] of Object.entries(res.userInfo)) {
      //   data[key] = value;
      // }
      setFormId(record.administratorId);
      setFormData(res);
      form.setFieldsValue(res);
      setOpenModal(true);
    });
  };

  // 批量删除规则
  const handleDelete = (administratorId) => {
    // 增加一个confirm确认框是否删除
    // const ids = records.map((item) => item.administratorId);
    modalApi.confirm({
      title: '提示',
      content: '确认删除该用户？',
      onOk:() => {
        deleteAdministrator(administratorId).then(() => {
          messageApi.open({
            type: "success",
            content: "删除成功",
          });
        }).catch(() => {
          messageApi.open({
            type: "error",
            content: "请求失败",
          });
        })
      }
    })
  };

  /**
   * 表头
   * 最好指定宽度，最多留一列自适应
   */
  const columns = [
    {
      title: "管理员ID",
      dataIndex: "administratorId",
      key: "administratorId",
      width: 200,
      fixed: "left",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 100,
      fixed: "left",
    },
    // {
    //   title: "用户类型",
    //   dataIndex: "userInfo.userType",
    //   key: "userInfo.userType",
    //   width: 150,
    //   fixed: "left",
    // },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true,
      width: 150,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    // {
    //   title: "最后登录时间",
    //   dataIndex: "userInfo.latestLoginString",
    //   key: "userInfo.latestLoginString",
    //   width: 150,
    // },
    {
      title: "禁用",
      dataIndex: "disabled",
      key: "disabled",
      render: (_, record, index) => <Switch
        defaultChecked={record.disabled}
        checkedChildren="是"
        unCheckedChildren="否"
        onChange={(checked) => {
          const requestFn = checked ? setAdministratorDisable : setAdministratorEnable;
          requestFn(record.administratorId).then((res) => {
            console.log(res)
            messageApi.success('操作成功');
          }).catch((msg) => {
            // console.log(record, msg)
            messageApi.error(msg || '请求失败');
            record.disabled = !record.disabled;
          })
        }}
      />,
      width: 200,
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: 310,
      fixed: 'right',
      render: (text, record, index) => (
        <Space>
          <Button type="primary" size="middle" onClick={() => {handleEditForm(record); setFormDisable(true)}}>
            详情
          </Button>
          |
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              handleEditForm(record);
              setFormDisable(false);
            }}
          >
            编辑
          </Button>
          |
          <Button
            danger
            size="middle"
            onClick={() => {
              handleDelete([record])
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 表格渲染函数
  const renderForm = () => {
    return (
      <Form
        form={form}
        initialValues={formData}
        labelCol={{ span: 6 }}
        labelWrap
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        style={{ maxWidth: "100%" }}
        disabled={formDisable}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true }]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="密码"
              name="password"
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="手机"
              name="phone"
              rules={[{ required: true }]}
            >
              <Input disabled={formId ? true : false}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="邮箱"
              name="email"
            >
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              label="头像连接"
              name={['profile', 'avatarUrl']}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="描述"
              name={['profile', 'description']}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="性别"
              name={['profile', 'gender']}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="昵称"
              name={['profile', 'nickname']}
            >
              <Input/>
            </Form.Item>
          </Col>
        </Row>
            
        <Form.List name={['profile', 'settings']}>
          {(fields, { add, remove }) => (
            <>
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item
                    label="自定义属性"
                  >
                    <Button icon={<PlusOutlined />} onClick={() => add()}>添加规则</Button>
                  </Form.Item>
                </Col>
              </Row>
              {
                fields.map(({ key, name, ...restField }) => (
                  <Row gutter={24} key={key}>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="属性名"
                        name={[name, 'key']}
                        rules={[{ required: true }]}
                      >
                        <Input/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        label="值"
                        labelCol={{span: 3}}
                        wrapperCol={{ span: 21 }}
                        name={[name, 'value']}
                        rules={[{ required: true }]}
                      >
                        <Input/>
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))
              }
            </>
          )}
        </Form.List>
      </Form>
    )
  }

  return (
    <div className="app-container">
      {contextHolder}
      {notContextHolder}
      {ModalContextHolder}
      {/* <LineChart
        chartData={lineChartData}
        styles={{
          padding: 12,
          backgroundColor: "#fff",
          marginBottom: "25px",
        }}
      /> */}
      {/* 通用表格，只需要传入 getDataApi 即可，其他逻辑内部处理 */}
      <CustomTable
        columns={columns}
        getDataApi={({current, size})=>{
          return getAdministrators({current, size}).then((res) => {
            res.content = res.content.map((item) => {
              for(let [key, value] of Object.entries(item.profile)) {
                item[`profile.${key}`] = value;
              }
              // item['profile.latestLoginString'] = dayjs(item.userInfo.latestLogin).format('YYYY-MM-DD HH:mm:ss')
              item.key = item.userId;
              return item
            })
            return Promise.resolve(res)
          })
        }}
        showPagination
        // labelCol={{ span: 5 }}
        // wrapperCol={{ span: 19 }}
        // searchConditions={
        //   [
        //   {value: 'id', label: 'id', component: <Input/>},
        //   {value:'name', label: '名字', component: () => <Select>
        //     <Select.Option value="BINANCE">BINANCE</Select.Option>
        //     <Select.Option value="BINANCE_FUTURE">
        //       BINANCE_FUTURE
        //     </Select.Option>
        //     <Select.Option value="FUTU">FUTU</Select.Option>
        //   </Select>},
        //   {value: 'BgType', label: '业务类型', component: () => <InputNumber min={0} max={10}/>},
        //   {value: 'YearMonth', label: '预核算年月', component:() =>  <Select>
        //     <Select.Option value="JEXL">JEXL</Select.Option>
        //     <Select.Option value="MVEL">MVEL</Select.Option>
        //   </Select>},
        //   {value: 'aaaaaa', label: '测试场地地阿三', component:() =>  <Select>
        //     <Select.Option value="JEXL">JEXL</Select.Option>
        //     <Select.Option value="MVEL">MVEL</Select.Option>
        //   </Select>},
        //   {value: 'bbbb', label: '多发点', component:() =>  <Select>
        //     <Select.Option value="JEXL">JEXL</Select.Option>
        //     <Select.Option value="MVEL">MVEL</Select.Option>
        //   </Select>},
        //   {value: 'ccccc', label: '提高人体', component:() =>  <Select>
        //     <Select.Option value="JEXL">JEXL</Select.Option>
        //     <Select.Option value="MVEL">MVEL</Select.Option>
        //   </Select>}
        // ]}
        // showRowSelection
        title={() => (
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              initFormData();
              setFormDisable(false);
              setOpenModal(true);
            }}
          >
            新增
          </Button>
        )}
        ref={tableRef}
      />
      {/* 编辑窗口 */}
      {
        formDisable ? <Modal
        title={formId ? `${formData.name}` : "新增"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        {renderForm()}
      </Modal> : <Modal
          title={formId ? `编辑-${formData.name}` : "新增"}
          open={openModal}
          onOk={handleEditScript}
          confirmLoading={submitLoading}
          onCancel={() => setOpenModal(false)}
          width="90%"
          style={{ top: 20 }}
        >
          {renderForm()}
        </Modal>
      }
    </div>
  );
};

export default ScriptBot;
