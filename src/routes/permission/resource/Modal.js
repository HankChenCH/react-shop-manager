import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Radio } from 'antd'
import styles from './Modal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class InfoModal extends React.Component
{
    constructor(props){
        super(props)
    }

    handleOk = () => {
        const { onOk } = this.props
        const { validateFields, getFieldsValue } = this.props.form
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

    render() {
        const { item, ...modalProps } = this.props
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        }

        const modalOpts = {
            ...modalProps,
            onOk: this.handleOk,
        }

        return (
            <Modal {...modalOpts}>
                <Form layout="horizontal">
                    <FormItem label="资源权限名称" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('name', {
                            initialValue: item.name,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入资源权限名称'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="资源权限描述" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('description', {
                            initialValue: item.description,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入资源权限描述'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="资源权限类型" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('type', {
                            initialValue: item.type || '1',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择资源权限类型'
                                },
                            ],
                        })(
                            <RadioGroup>
                                <Radio value="1">公共资源</Radio>
                                <Radio value="2">权限资源</Radio>
                                <Radio value="3">私人资源</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

InfoModal.propTypes = {

}

export default Form.create()(InfoModal)