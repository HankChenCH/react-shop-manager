import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Steps, Button, Upload, Icon } from 'antd'
import { apiPrefix, api } from '../../utils/config'
import styles from './Modal.css'

const FormItem = Form.Item
const Step = Steps.Step;
const Dragger = Upload.Dragger;
const { productMain } = api.image
const uploadImageApi = `${apiPrefix}/${productMain}`

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  onUploadSuccess,
  currentStep,
  onChangeStep,
  modalType,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }

  const handleNext = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      onChangeStep(1)
    })
  }

  const handlePrev = () => {
    onChangeStep(-1)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    footer: null
  }

  const steps = [{
    title: '商品信息',
    icon: <Icon type="solution" />
  }, {
    title: '商品详情',
    icon: <Icon type="file-jpg" />
  }, {
    title: '商品参数',
    icon: <Icon type="switcher" />
  }];

  const handleUploadMainImageChange = (info) => {
    if (info.file.status === 'done') {
      onUploadSuccess(info.file.response)
    } else if(info.file.status === 'error') {
      throw {
        success: false,
        message: response.msg
      }
    }
  }

  const renderUploader = (modalType) => {
    let imageContent
    if (modalType === 'create') {
      imageContent = item.main_img_url ?
      <img src={item.main_img_url} alt="" className={styles.img} /> : 
      <Icon type="plus" className={styles.img_uploader_trigger} />
    } else if(modalType === 'update') {
      imageContent = item.img_url ? <img src={item.img_url} alt="" className={styles.img} /> : <img src={item.img.url} alt="" className={styles.img} />
    }
    return imageContent
  }

  const DraggerProps = {
    name: 'detail_img',
    multiple: true,
    showUploadList: false,
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const addField = () => {

  }

  return (
    <Modal width={800} {...modalOpts}>
      <Form layout="horizontal">
        <Steps current={currentStep}>
          {steps.map(item => <Step key={item.title} title={item.title} icon={item.icon}/>)}
        </Steps>
        <div className={styles.steps_content}>
          {
            currentStep === 0
            &&
            <div>
              <FormItem label="商品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入商品名称'
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="商品描述" hasFeedback {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                  rules: [
                    {
                      required: true,
                      message: '请输入商品描述'
                    },
                  ],
                })(<Input type='textarea'/>)}
              </FormItem>
              <FormItem label="商品单价" hasFeedback {...formItemLayout}>
                {getFieldDecorator('price', {
                  initialValue: item.price,
                  rules: [
                    {
                      required: true,
                      message: '请输入商品单价'
                    },
                  ],
                })(<InputNumber style={{width: '100%'}} step={0.01} min={0}/>)}
              </FormItem>
              <FormItem label="商品库存" hasFeedback {...formItemLayout}>
                {getFieldDecorator('stock', {
                  initialValue: item.stock,
                  rules: [
                    {
                      required: true,
                      message: '请输入商品库存'
                    },
                  ],
                })(<InputNumber style={{width: '100%'}} min={0}/>)}
              </FormItem>
              <FormItem label="上传商品主图" hasFeedback {...formItemLayout}>
                {getFieldDecorator('img_id', {
                  initialValue: item.img_id,
                  rules: [
                    {
                      required: true,
                      message: '请上传商品图片'
                    },
                  ],
                })(
                  <Input type='hidden' />
                )}
                <Upload
                  className={styles.img_uploader}
                  name="mainImage"
                  showUploadList={false}
                  action={uploadImageApi}
                  onChange={handleUploadMainImageChange}
                >
                  {renderUploader(modalType)}
                </Upload>
              </FormItem>
            </div>
          }
          {
            currentStep === 1
            &&
            <div>
              <FormItem label="上传商品详情图片" hasFeedback {...formItemLayout}>
                {getFieldDecorator('product_img_id', {
                  initialValue: item.product_img_id,
                  rules: [
                    {
                      required: true,
                      message: '请上传商品详情图片'
                    },
                  ],
                })(
                  <Input type='hidden' />
                )}
                <Dragger {...DraggerProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                </Dragger>
              </FormItem>
            </div>
          }
          {
            currentStep === 2
            &&
            <div>
              <FormItem label="商品参数" hasFeedback {...formItemLayout}>
                {getFieldDecorator('product_property', {
                  initialValue: item.product_property,
                  rules: [
                    {
                      required: true,
                      message: '请填写商品参数'
                    },
                  ],
                })(
                  <Button type="dashed" onClick={addField} style={{ width: '60%' }}>
                    <Icon type="plus" /> 增加参数
                  </Button>
                )}
              </FormItem>
            </div>
          }
        </div>
        <div className={styles.steps_action}>
          {
            currentStep > 0
            &&
            <Button style={{ marginLeft: 8 }} onClick={handlePrev}>上一步</Button>
          }
          {
            currentStep < steps.length - 1
            &&
            <Button style={{ marginLeft: 8 }} type="primary" onClick={handleNext}>保存并下一步</Button>
          }
          {
            currentStep === steps.length - 1
            &&
            <Button style={{ marginLeft: 8 }} type="primary" onClick={handleOk}>完成</Button>
          }
        </div>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
