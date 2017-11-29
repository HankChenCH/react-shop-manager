import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'
import { Validate } from '../../utils'

const FormItem = Form.Item
const { confirmPassword } = Validate

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
  modalType,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
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
        // key: item.key,
      }

      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const handleConfirmPassword = (rule, value, callback) => {
    const password = getFieldValue('password')
    confirmPassword(password, value, callback)
  }

  const pwdMessage = modalType === 'create' ? '请输入密码' : '如不需要更改密码，请勿填写'

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" hasFeedback {...formItemLayout}>
          {modalType === 'create' ? 
            getFieldDecorator('user_name', {
              initialValue: item.user_name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />) :
            <div>{item.user_name}</div>
          }
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [{
              required: modalType === 'create',
              pattern: /^[A-Za-z0-9]{6,14}$/,
              message: '密码长度必须为6-14位且英文加数字组合'
            }],
          })(<Input type="password" placeholder={pwdMessage}/>)}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('repassword', {
            validateTrigger: ['onChange','onBlur'],
            rules: [{
              required: modalType === 'create',
              validator: handleConfirmPassword
            }],
          })(<Input type="password" placeholder={pwdMessage}/>)}
        </FormItem>
        <FormItem label="真实姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('true_name', {
            initialValue: item.true_name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="性别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('gender', {
            initialValue: item.profile ? item.profile.gender : '',
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Radio.Group>
              <Radio value="1">男</Radio>
              <Radio value="0">女</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="年龄" hasFeedback {...formItemLayout}>
          {getFieldDecorator('age', {
            initialValue: item.profile ? item.profile.age : '',
            rules: [
              {
                required: true,
                type: 'number',
              },
            ],
          })(<InputNumber min={18} max={100} />)}
        </FormItem>
        <FormItem label="联系电话" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phone', {
            initialValue: item.profile ? item.profile.phone : '',
            rules: [
              {
                pattern: /^1[34578]\d{9}$/,
                message: '联系电话格式不正确!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="联系邮箱" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.profile ? item.profile.email : '',
            rules: [
              {
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: '联系邮箱格式不正确!',
              },
            ],
          })(<Input />)}
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
