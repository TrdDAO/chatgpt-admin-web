import { 
  getCustomers,
  getCustomerDetail,
  addCustomer,
  editCustomer,
  deleteCustomer,
  setCustomerDisable,
  setCustomerEnable,
} from '@/service/customer';
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
    phoneNumber: '',
    emailAddress: '',
    settings: {
      nickname: '',
      avatarUrl: '',
      description: '',
      gender: null,
      settings: [],
    }
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
    console.log(formData)
    let requestData = {
      username: formData.username.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      emailAddress: formData.emailAddress.trim(),
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
    if(!formId) {
      requestData.password = formData.password;
      requestData.disabled = false;
    }
    const requestFn = formId ? editCustomer : addCustomer;
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
    getCustomerDetail(record.customerId).then((res) => {
      const settings = []; 
      for(let [key, value] of Object.entries(res.profile.settings)) {
        settings.push({key, value})
      }
      res.profile.settings = settings;
      setFormId(record.customerId);
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
        deleteCustomer(administratorId).then(() => {
          messageApi.open({
            type: "success",
            content: "删除成功",
          });
          tableRef.current.initTable();
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
      title: "用户ID",
      dataIndex: "userId",
      key: "userId",
      width: 200,
      fixed: "left",
    },
    {
      title: "客户ID",
      dataIndex: "customerId",
      key: "customerId",
      width: 200,
      fixed: "left",
    },
    {
      title: "头像",
      dataIndex: "profile.avatarUrl",
      key: "profile.avatarUrl",
      width: 100,
      render: (_, record, index) => <img style={{maxWidth: '100px'}} src={record.profile.avatarUrl}/>
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 100,
    },
    {
      title: "昵称",
      dataIndex: "profile.nickname",
      key: "profile.nickname",
      width: 100,
    },
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ellipsis: true,
      width: 150,
    },
    {
      title: "性别",
      dataIndex: "profile.gender",
      key: "profile.gender",
      width: 100,
    },
    {
      title: "描述",
      dataIndex: "profile.description",
      key: "profile.description",
    },
    {
      title: "操作人",
      dataIndex: "operator",
      key: "operator",
      width: 150,
    },
    {
      title: "邮箱",
      dataIndex: "emailAddress",
      key: "emailAddress",
      width: 200,
    },
    {
      title: "禁用",
      dataIndex: "disabled",
      key: "disabled",
      render: (_, record, index) => <Switch
        defaultChecked={record.disabled}
        checkedChildren="是"
        unCheckedChildren="否"
        onChange={(checked) => {
          const requestFn = checked ? setCustomerDisable : setCustomerEnable;
          // console.log(tableRef.current)
          requestFn(record.customerId).then((res) => {
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
      width: 231,
      fixed: 'right',
      render: (text, record, index) => (
        <Space>
          <Button type="primary" size="middle" onClick={() => {
            handleEditForm(record);
            setFormDisable(true);
          }}>
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
              handleDelete(record.customerId)
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
          {
            formId ? null: <Col span={6}>
              <Form.Item
                label="密码"
                name="password"
              >
                <Input/>
              </Form.Item>
            </Col> 
          }
          <Col span={6}>
            <Form.Item
              label="手机"
              name="phoneNumber"
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="邮箱"
              name="emailAddress"
              rules={[{ required: true }]}
            >
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              label="昵称"
              name={['profile', 'nickname']}
            >
              <Input/>
            </Form.Item>
          </Col>
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
          return getCustomers({current, size}).then((res) => {
            res.content = res.content.map((item) => {
              item.key = item.customerId;
              for(let [key, value] of Object.entries(item.profile)) {
                item['profile.'+key] = value;
              }
              item.equities = item.equities.map((equitie, equitieIndex) => {
                equitie.key = equitieIndex;
                equitie.effectiveTime = dayjs(equitie.effectiveTime).format('YYYY-MM-DD HH:mm:ss');
                equitie.expiresTime = dayjs(equitie.expiresTime).format('YYYY-MM-DD HH:mm:ss');
                for(let [key, value] of Object.entries(equitie.limitation)) {
                  equitie['equitie.'+key] = value;
                }
                return equitie
              })
              return item
            })
            return Promise.resolve(res)
          })
        }}
        showPagination
        expandable={{
          expandedRowRender: (record) => {
            const columns = [
              {title: '权益名', dataIndex: 'equityName', key: 'equityName', width: 100},
              {title: '权益ID', dataIndex: 'equityId', key: 'equityId', width: 200},
              {title: '类型', dataIndex: 'equityType', key: 'equityType', width: 50},
              {title: '订阅周期', dataIndex: 'unit', key: 'unit', width: 100},
              {title: '周期个数', dataIndex: 'quantity', key: 'quantity', width: 100},
              {title: '生效时间', dataIndex: 'effectiveTime', key: 'effectiveTime'},
              {title: '结束时间', dataIndex: 'expiresTime', key: 'expiresTime'},
              {title: '单次限制', dataIndex: 'equitie.maxTokensPerRequest', key: 'equitie.maxTokensPerRequest'},
              {title: '每日限制', dataIndex: 'equitie.maxTokensPerDay', key: 'equitie.maxTokensPerDay'},
              {title: '每月限制', dataIndex: 'equitie.maxTokensPerMonth', key: 'equitie.maxTokensPerMonth'},
              {title: '模型', dataIndex: 'equitie.chatModels', key: 'equitie.chatModels', render:(_, limitation) => {
                return (<div>{_.join(' | ')}</div>)
              }},
            ]
            return <Table bordered columns={columns} dataSource={record.equities} pagination={false} />;
          },
          rowExpandable: (record) => record.equities.length,
        }}
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
        title={formId ? `${formData.customerId}` : "新增"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        {renderForm()}
      </Modal> : <Modal
          title={formId ? `编辑-${formData.customerId}` : "新增"}
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
