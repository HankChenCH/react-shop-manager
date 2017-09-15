import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Icon } from 'antd'
import { TopicUpload } from '../../components/Upload'
import { apiPrefix, api } from '../../utils/config'
import styles from './Modal.css'

const FormItem = Form.Item
const { TextArea } = Input
const { themeTopic, themeHead } = api.image
const uploadTopicApi = `${apiPrefix}/${themeTopic}`
const uploadHeadApi = `${apiPrefix}/${themeHead}`

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
        <FormItem label="主题名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入主题名称'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: true,
                message: '请输入主题描述'
              },
            ],
          })(<Input type='textarea'/>)}
        </FormItem>
        <FormItem label="上传头图" hasFeedback {...formItemLayout}>
          {getFieldDecorator('head_img', {
            initialValue: item.head_img ? { img_id: item.head_img.id, img_url: item.head_img.url } : {},
            rules: [
              {
                required: true,
                message: '请上传头图'
              },
            ],
          })(
            <TopicUpload
              className={styles.avatar_uploader}
              name="headImage"
              action={uploadHeadApi}
            />
          )}
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
