import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, Row, Col, message } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getSystemProfile, updateSystemProfile } from "@/service/system.js";
import { uploadFile } from "@/service/file";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import 'react-lazy-load-image-component/src/effects/blur.css';

const { Dragger } = Upload;

const System: React.FC = (props) => {
  const [systemProfileForm] = Form.useForm();
  const [formData, setFormData] = useState({
    announcement: '',
    name: '',
		wechatGroupQRDarkImageFileId: '',
		wechatGroupQRLightImageFileId: '',
  });
	const [lightUrl, setLightUrl] = useState('');
	const [darkUrl, setDarkUrl] = useState('');
  const [lightLoading, setLightLoading] = useState(false);
  const [darkLoading, setDarkLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const initPage = () => {
    getSystemProfile()
      .then((res) => {
        setFormData(res);
        res.wechatGroupQRDarkImageFileId = res.wechatGroupQRDarkImage?.fileId;
        res.wechatGroupQRLightImageFileId = res.wechatGroupQRLightImage?.fileId;
				setLightUrl(res.wechatGroupQRLightImage?.url);
				setDarkUrl(res.wechatGroupQRDarkImage?.url)
        systemProfileForm.setFieldsValue(res);
      })
      .catch(() => {
        message.error("获取信息失败");
      });
  };

  useEffect(() => {
    initPage();
  }, []);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const handleUpload = (info, type) => {
    console.log(info, type);
    const formData = new FormData();
    formData.append("file", info);
    if (type === "light") {
      setLightLoading(true);
    }
    if (type === "dark") {
      setDarkLoading(true);
    }
    uploadFile(formData, {
      type: "IMAGE",
      scope: "PUBLIC",
    })
      .then((res) => {
        console.log(res);
        // {
        //   fileId: "1105329944281890816";
        //   filename: "wechat_light.jpeg";
        //   previewUrl: "https://chatadm-dev.miraclekang.com/api/open/common/files/1105329944281890816/preview";
        //   size: 280846;
        //   status: "UPLOADED";
        // }
        if (type === "light") {
          setFormData(Object.assign({}, formData, {
            wechatGroupQRLightImageFileId: res.fileId
					}));
          systemProfileForm.setFieldValue('wechatGroupQRLightImageFileId', res.fileId);
          setLightUrl(res.previewUrl);
        }
        if (type === "dark") {
          setFormData(Object.assign({}, formData, {
            wechatGroupQRDarkImageFileId: res.fileId
					}));
          systemProfileForm.setFieldValue('wechatGroupQRDarkImageFileId', res.fileId);
          setDarkUrl(res.previewUrl);
        }
      })
      .finally(() => {
        if (type === "light") {
          setLightLoading(false);
        }
        if (type === "dark") {
          setDarkLoading(false);
        }
      });
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    console.log(info);
  };

  const handleSave = async() => {
    await systemProfileForm.validateFields();
    const formData = systemProfileForm.getFieldsValue();
    setLoading(true);
    updateSystemProfile(formData).then(() => {
      message.success('更新成功');
    }).catch(() => {
      message.error('保存失败')
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <Form
      form={systemProfileForm}
      className="app-container"
      name="systemProfile"
      {...formItemLayout}
      style={{
        margin: "10px",
        background: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
      disabled={loading}
    >
      <Form.Item label="系统名称" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="公告" name="announcement" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Row gutter={24}>
        <Col span={8} offset={4}>
          <Form.Item
            name="wechatGroupQRLightImageFileId"
            label="微信群二维码(白)"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            rules={[{ required: true }]}
          >
            <Upload
              beforeUpload={(info) => {
                handleUpload(info, "light");
                return false;
              }}
              onDrop={(e) => {
                console.log(e);
              }}
              onChange={handleChange}
              showUploadList={false}
              disabled={lightLoading||loading}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            >
              {lightUrl ? (
                <div
                  className="ant-upload ant-upload-drag css-dev-only-do-not-override-htwhyh"
                  style={{ padding: "16px 20px" }}
                >
                  <LazyLoadImage
                    alt="微信白底"
                    src={lightUrl}
                    effect="blur"
                    style={{maxWidth: '100%'}}
                  />
                  {/* <img
                    src={lightUrl}
                    alt="微信白底"
                    style={{maxWidth: '100%'}}
                  /> */}
                </div>
              ) : (
                <div
                  className="ant-upload ant-upload-drag css-dev-only-do-not-override-htwhyh"
                  style={{ padding: "16px 20px" }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击此区域上传</p>
                  <p className="ant-upload-hint">
                    仅支持 jpg,jpeg,png,gif,webp
                  </p>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8} offset={0}>
          <Form.Item
            name="wechatGroupQRDarkImageFileId"
            label="微信群二维码(黑)"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            rules={[{ required: true }]}
          >
            <Upload
              beforeUpload={(info) => {
                handleUpload(info, "dark");
                return false;
              }}
              onDrop={(e) => {
                console.log(e);
              }}
              onChange={handleChange}
              showUploadList={false}
              disabled={darkLoading||loading}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            >
              {darkUrl ? (
                <div
                  className="ant-upload ant-upload-drag css-dev-only-do-not-override-htwhyh"
                  style={{ padding: "16px 20px" }}
                >
                  <img
                    src={darkUrl}
                    alt="微信黑底"
                    style={{maxWidth: '100%'}}
                  />
                </div>
              ) : (
                <div
                  className="ant-upload ant-upload-drag css-dev-only-do-not-override-htwhyh"
                  style={{ padding: "16px 20px" }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击此区域上传</p>
                  <p className="ant-upload-hint">
                    仅支持 jpg,jpeg,png,gif,webp
                  </p>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{ offset: 6, span: 12}}>
        <Button type="primary" onClick={handleSave} loading={loading}>保存</Button>
      </Form.Item>
    </Form>
  );
};

export default System;
