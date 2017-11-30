import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'
import styles from './Modal.less'

const FormItem = Form.Item

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
                    <FormItem label="角色名称" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('name', {
                            initialValue: item.name,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入角色名称'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="角色描述" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('description', {
                            initialValue: item.description,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入角色描述'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

InfoModal.propTypes = {

}

export default Form.create()(InfoModal)