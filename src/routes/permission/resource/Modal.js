import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Radio, Select } from 'antd'
import { Enum } from '../../../utils'
import styles from './Modal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { Option } = Select
const { EnumPermissionType, EnumResourceType } = Enum

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
            const fieldsValue = getFieldsValue()
            const data = {
                ...fieldsValue,
            }

            console.log(data)
            onOk(data)
        })
    }

    addDescriptionBefore = () => {
        const { getFieldValue, getFieldDecorator } = this.props.form

        if (getFieldValue('resource_type') === '1') {
            return null
        }

        return getFieldDecorator('method',{
            initialValue: 'GET /'
        })(
            <Select style={{ width: 80 }}>
                <Option value="GET /">GET</Option>
                <Option value="POST /">POST</Option>
                <Option value="PUT /">PUT</Option>
                <Option value="DELETE /">DELETE</Option>
            </Select>
        )
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

        const descriptionBefore = this.addDescriptionBefore()

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
                        })(<Input addonBefore={descriptionBefore} style={{ width: '100%' }} />)}
                    </FormItem>
                    <FormItem label="资源类型" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('resource_type', {
                            initialValue: item.resource_type || '2',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择资源类型'
                                },
                            ],
                        })(
                            <RadioGroup>
                                <Radio value={EnumResourceType.View} >视图</Radio>
                                <Radio value={EnumResourceType.Data} >数据</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="权限类型" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('permission_type', {
                            initialValue: item.permission_type || '1',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择权限类型'
                                },
                            ],
                        })(
                            <RadioGroup>
                                <Radio value={EnumPermissionType.Public} >公共资源</Radio>
                                <Radio value={EnumPermissionType.Protected} >保护资源</Radio>
                                <Radio value={EnumPermissionType.Private} >私人资源</Radio>
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