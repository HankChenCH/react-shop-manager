import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '../../components'
import { Form, Input, InputNumber, Modal, Steps, Button, Upload, Icon } from 'antd'
import { apiPrefix, api } from '../../utils/config'
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import styles from './Modal.css'

const FormItem = Form.Item
const Step = Steps.Step;
const { productMain } = api.image
const uploadImageApi = `${apiPrefix}/${productMain}`

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
  item = {},
  onOk,
  onUploadSuccess,
  currentStep,
  onChangeStep,
  onEditorStateChange,
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
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
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
      imageContent = item.main_img_url ? <img src={item.main_img_url} alt="" className={styles.img} /> : <img src={item.img.url} alt="" className={styles.img} />
    }
    return imageContent
  }

  const handleEditorStateChange = (editorState) => {
    console.log(editorState)
    onEditorStateChange(editorState)
  }

  return (
    <Modal width={900} {...modalOpts}>
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
                {getFieldDecorator('summary', {
                  initialValue: item.summary,
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
              <FormItem label="商品详情" hasFeedback {...formItemLayout}>
                {getFieldDecorator('detail', {
                  initialValue: item.detail,
                  rules: [
                    {
                      required: true,
                      message: '请填写商品详情'
                    },
                  ],
                })(<Input type="hidden"/>)}
                <Editor
                  wrapperStyle={{
                    minWidth: 660
                  }}
                  editorStyle={{
                    maxHeight: 370,
                    overFlow: 'hidden',
                    minWidth: 660,
                    backgroundColor: '#fff'
                  }}
                  editorState={item.detail}
                  onEditorStateChange={onEditorStateChange}
                />
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
                  <Input />
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
