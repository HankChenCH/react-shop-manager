import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Upload, Icon } from 'antd'
import { apiPrefix, api } from '../../utils/config'
import styles from './Modal.css'

const FormItem = Form.Item
const { TextArea } = Input
const { categoryTopic } = api.image
const uploadImageApi = `${apiPrefix}/${categoryTopic}`

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
  createTempItem,
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
        key: item.key,
      }
      onOk(data)
    })
  }

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      onUploadSuccess(info.file.response)
    }
  }

  const renderUploader = (modalType) => {
    let imageContent
    if (modalType === 'create') {
      imageContent = createTempItem.img_url ?
      <img src={createTempItem.img_url} alt="" className={styles.avatar} /> : 
      <Icon type="plus" className={styles.avatar_uploader_trigger} />
    } else if(modalType === 'update') {
      imageContent = <img src={item.img.url} alt="" className={styles.avatar} />
    }
    return <div>{imageContent}</div>
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="分类名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
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
              },
            ],
          })(<Input type='textarea'/>)}
        </FormItem>
        <FormItem label="上传头图" hasFeedback {...formItemLayout}>
          {getFieldDecorator('topic_img_id', {
            initialValue: item.topic_img_id || createTempItem.topic_img_id,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Input type='hidden' />
          )}
          <Upload
            className={styles.avatar_uploader}
            name="topicImage"
            showUploadList={false}
            action={uploadImageApi}
            onChange={handleChange}
          >
            {renderUploader(modalType)}
          </Upload>
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
