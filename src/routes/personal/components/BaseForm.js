import React from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
import { Validate } from '../../../utils'

const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option
const { confirmPassword } = Validate

class BaseForm extends React.Component {
    
    state = {
        confirmDirty: false,
    };

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
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        const password = form.getFieldValue('password')
        confirmPassword(password, value, callback)
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { item, formItemLayout, tailFormItemLayout, buttonLoading } = this.props

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            真实姓名&nbsp;
                            <Tooltip title="成员应该怎么称呼你?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                    hasFeedback
                >
                    {getFieldDecorator('true_name', {
                        rules: [{ required: true, message: '请填写真实姓名!', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="邮件"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '无效的邮箱地址格式!',
                        }, {
                            required: true, message: '请填写邮箱地址!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机"
                >
                    {getFieldDecorator('phone', {
                        rules: [
                            { required: true, message: '请填写手机号码!' }, 
                            { pattern: /^1[34578]\d{9}$/, message: '联系电话格式不正确!'},
                        ],
                    })(
                        <Input type="number" style={{ width: '100%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            pattern: /^[A-Za-z0-9]{6,14}$/,
                            message: '密码长度必须为6-14位且英文加数字组合'
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password" placeholder="如需更改密码才填写" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码"
                    hasFeedback
                >
                    {getFieldDecorator('repassword', {
                        rules: [{
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} placeholder="如需更改密码才填写" />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={buttonLoading}>保存</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(BaseForm);