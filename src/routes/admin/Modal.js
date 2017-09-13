import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item

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
        const first = getFieldValue('password')
        if (first && value !== first) {
            callback('The second password should be same with first!')
        }

        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
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
              message: 'The password shoule be mixin number and letter,length between 6 and 14'
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
          {getFieldDecorator('sex', {
            initialValue: item.sex,
            rules: [
              {
                required: true,
                type: 'boolean',
              },
            ],
          })(
            <Radio.Group>
              <Radio value>男</Radio>
              <Radio value={false}>女</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="年龄" hasFeedback {...formItemLayout}>
          {getFieldDecorator('age', {
            initialValue: item.age,
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
            initialValue: item.phone,
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
            initialValue: item.email,
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
