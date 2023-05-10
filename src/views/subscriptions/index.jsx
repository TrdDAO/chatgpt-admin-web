import { 
  getSubscriptions,
  getSubscriptionDetail,
  addSubscription,
  editSubscription,
  grantSubscription,
} from '@/service/subscription';
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
    name: '',
    type: '',
    level: '',
    disabled: false,
    chatModels:[],
    maxTokensPerDay: null,
    maxTokensPerMonth: null,
    maxTokensPerRequest: null,
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
  // 
  const [openGrantModal, setOpenGrantModal] = useState(false);
  // 表格store，用于做表单验证赋值等操作
  const [form] = Form.useForm();
  // 授权用户表单
  const [grantForm] = Form.useForm();
  // 表单数据
  const [formData, setFormData] = useState(Object.assign({}, formDataDefault));
  // 禁用表单
  const [formDisable, setFormDisable] = useState(false);
  // 表单Id
  const [formId, setFormId] = useState("");
  // 提交编辑按钮loading
  const [submitLoading, setSubmitLoading] = useState(false);
  // 授权
  const [grantLoading, setGrantLoading] = useState(false);
  // test加载
  const [testLoading, setTestLoading] = useState(false);


  // 添加规则
  const handleEditScript = async () => {
    // 先校验数据，再发起请求
    await form.validateFields();
    const formData = form.getFieldsValue();
    const requestFn = formId ? editSubscription : addSubscription;
    setSubmitLoading(true);
    await requestFn(formData, formId)
      .then(() => {
        messageApi.open({
          type: "success",
          content: formId ? "编辑成功" : "添加成功",
        });
        setOpenModal(false);
        tableRef.current.initTable();
      })
      .catch((msg) => {
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
    getSubscriptionDetail(record.subscriptionId).then((res) => {
      setFormId(record.subscriptionId);
      setFormData(res);
      form.setFieldsValue(res);
      setOpenModal(true);
    });
  };

  const handleGrant = async() => {
    await grantForm.validateFields();
    setGrantLoading(true);
    grantSubscription(formId, grantForm.getFieldsValue()).then(() => {
      messageApi.open({
        type: "success",
        content: '授权成功',
      });
      setOpenGrantModal(false);
    }).catch(() => {
      messageApi.open({
        type: "error",
        content: '授权失败',
      });
    }).finally(() => {
      setGrantLoading(false);
    })
  }

  // 批量删除规则
  const handleDelete = (administratorId) => {
    // 增加一个confirm确认框是否删除
    // const ids = records.map((item) => item.administratorId);
    modalApi.confirm({
      title: '提示',
      content: '确认删除该用户？',
      onOk:() => {
        // deleteCustomer(administratorId).then(() => {
        //   messageApi.open({
        //     type: "success",
        //     content: "删除成功",
        //   });
        // }).catch(() => {
        //   messageApi.open({
        //     type: "error",
        //     content: "请求失败",
        //   });
        // })
      }
    })
  };

  /**
   * 表头
   * 最好指定宽度，最多留一列自适应
   */
  const columns = [
    {
      title: "订阅ID",
      dataIndex: "subscriptionId",
      key: "subscriptionId",
      width: 200,
      fixed: "left",
    },
    {
      title: "订阅名称",
      dataIndex: "name",
      key: "name",
      width: 100,
      fixed: "left",
    },
    {
      title: "订阅周期",
      dataIndex: "type",
      key: "type",
      width: 100,
      fixed: "left",
    },
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      width: 150,
    },
    {
      title: "模型",
      dataIndex: "level",
      key: "level",
      width: 150,
      render: (text, record, index) => (<div>{
        record.chatModels.join('、')
      }</div>)
    },
    {
      title: "最大请求",
      dataIndex: "maxTokensPerRequest",
      key: "maxTokensPerRequest",
      ellipsis: true,
      width: 150,
    },
    {
      title: "每日最大",
      dataIndex: "maxTokensPerDay",
      key: "maxTokensPerDay",
      width: 150,
    },
    {
      title: "每月最大",
      dataIndex: "maxTokensPerMonth",
      key: "maxTokensPerMonth",
      width: 150,
    },
    {
      title: "禁用",
      dataIndex: "disabled",
      key: "disabled",
      render: (_, record, index) => <Switch
        defaultChecked={record.disabled}
        checkedChildren="是"
        unCheckedChildren="否"
        disabled
      />,
      width: 100,
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: 310,
      fixed: 'right',
      render: (text, record, index) => (
        <Space>
          {/* <Button type="primary" size="middle" onClick={() => {
            handleEditForm(record);
            setFormDisable(true);
          }}>
            详情
          </Button>
          | */}
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
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              setOpenGrantModal(true);
              setFormId(record.subscriptionId);
              grantForm.setFieldsValue({userId: '', quantity: ''})
            }}
          >
            授权给用户
          </Button>
        </Space>
      ),
    },
  ];

  // 
  const rendeGrantrForm = () => (
    <Form 
      form={grantForm}
      labelCol={{ span: 4 }}
      labelWrap
      wrapperCol={{ span: 20 }}
    >
      <Form.Item label="用户ID" name="userId" rules={[{ required: true }]}>
        <Input/>
      </Form.Item>
      <Form.Item label="数量" name="quantity" rules={[{ required: true }]}>
        <InputNumber/>
      </Form.Item>
    </Form>
  )

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
              label="订阅名称"
              name="name"
              rules={[{ required: true }]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="类型"
              name="type"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="DAILY">每日</Select.Option>
                <Select.Option value="WEEKLY">每周</Select.Option>
                <Select.Option value="MONTHLY">每月</Select.Option>
                <Select.Option value="YEARLY">每年</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="级别"
              name="level"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="ORDINARY">普通会员</Select.Option>
                <Select.Option value="ADVANCED">高级会员</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="禁用"
              name="disabled"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              label="可用模型"
              name="chatModels"
            >
              <Select mode="multiple">
                <Select.Option value="GPT3_5">GPT3_5</Select.Option>
                <Select.Option value="GPT4">GPT4</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="单次最大"
              name="maxTokensPerRequest"
            >
              <InputNumber/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="每日最大"
              name="maxTokensPerDay"
            >
              <InputNumber/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="每月最大"
              name="maxTokensPerMonth"
            >
              <InputNumber/>
            </Form.Item>
          </Col>
        </Row>
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
          return getSubscriptions({current, size}).then((res) => {
            res.content = res.content.map((item) => {
              item.key = item.customerId;
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
      <Modal
        title="授权给用户"
        open={openGrantModal}
        onOk={handleGrant}
        confirmLoading={grantLoading}
        onCancel={() => setOpenGrantModal(false)}
      >
        {rendeGrantrForm()}
      </Modal>
      
    </div>
  );
};

export default ScriptBot;
