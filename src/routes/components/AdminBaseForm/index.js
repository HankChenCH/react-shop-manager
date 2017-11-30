import React from 'react'
import { Form, Radio, Input, InputNumber, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
import { Validate } from '../../../utils'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const AutoCompleteOption = AutoComplete.Option
const { confirmPassword } = Validate

class BaseForm extends React.Component 
{
    constructor(props) {
        super(props)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.onSave(values)
            }
        });
    }

    handleConfirmPassword = (rule, value, callback) => {
        const form = this.props.form;
        const password = form.getFieldValue('password')
        confirmPassword(password, value, callback)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { item, modalType, formItemLayout, tailFormItemLayout, buttonLoading } = this.props

        const pwdMessage = modalType === 'create' ? '请输入密码' : '如不需要更改密码，请勿填写'

        return (
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
                    })(<Input type="password" placeholder={pwdMessage} />)}
                </FormItem>
                <FormItem label="确认密码" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('repassword', {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: modalType === 'create',
                            validator: this.handleConfirmPassword
                        }],
                    })(<Input type="password" placeholder={pwdMessage} />)}
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
                        initialValue: item.profile ? item.profile.gender : '1',
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    })(
                        <RadioGroup>
                            <Radio value="1">男</Radio>
                            <Radio value="2">女</Radio>
                        </RadioGroup>
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
                {
                    tailFormItemLayout &&
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.handleSubmit} type="primary" htmlType="submit" loading={buttonLoading}>保存</Button>
                    </FormItem>
                }
            </Form>
        );
    }
}

export default Form.create()(BaseForm);