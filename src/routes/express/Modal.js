import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Icon } from 'antd'
import { baseURL, api } from '../../utils/config'
import styles from './Modal.css'

const FormItem = Form.Item
const { TextArea } = Input
const { categoryTopic } = api.image
const uploadImageApi = `${baseURL}/${categoryTopic}`

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item,
  modalType,
  onOk,
  onError,
  onUploadSuccess,
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
        id: item.id,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="快递公司名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('express_name', {
            initialValue: item.express_name,
            rules: [
              {
                required: true,
                message: '请输入快递公司名称'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="快递价格" hasFeedback {...formItemLayout}>
          {getFieldDecorator('express_price', {
            initialValue: item.express_price,
            rules: [
              {
                required: true,
                message: '请输入快递价格'
              },
            ],
          })(<InputNumber style={{ width: '100%' }} min={0} step={0.01} />)}
        </FormItem>
        <FormItem label="快递包邮价格" hasFeedback {...formItemLayout}>
          {getFieldDecorator('express_limit', {
            initialValue: item.express_limit,
            rules: [
                { 
                  required: true, 
                  message: '请输入快递包邮价格' 
                },
            ],
          })(<InputNumber style={{ width: '100%' }} min={0} step={0.01} />)}
        </FormItem>
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
