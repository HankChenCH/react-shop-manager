import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Radio, Select } from 'antd'
import { Enum } from '../../../utils'
import styles from './Modal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { Option } = Select
const { EnumPermissionType, EnumResourceType } = Enum
const methodArr = ['GET', 'POST', 'PUT', 'DELETE']

class InfoModal extends React.Component
{
    constructor(props){
        super(props)
        const { item } = this.props

        this.state = {
            resource_type: item.resource_type || '2',
            descriptionBefore: null
        }
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

            if (this.state.resource_type === '2') {
                data.description = data.method + ' ' + data.description
                delete data.method
            }

            // console.log(data)
            onOk(data)
        })
    }

    handleResourceTypeChange = (e) => {
        this.setState({
            resource_type: e.target.value
        })
    }

    render() {
        const { item, modalType, ...modalProps } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { resource_type } = this.state

        const descriptionBefore = (
            resource_type === '1' ? 
            null : 
            getFieldDecorator('method', {
                initialValue: (item.description && methodArr.indexOf(item.description.split(' ')[0]) !== -1) ? item.description.split(' ')[0] : 'GET'
            })(
                <Select style={{ width: 80 }}>
                    {methodArr.map((item) =>
                        <Option key={item} value={item}>{item}</Option>
                    )}
                </Select>
            )
        )

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
                            initialValue: modalType === 'update' && item.resource_type === '2' ? item.description.split(' ')[1] : item.description,
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
                            <RadioGroup onChange={(e) => this.handleResourceTypeChange(e)}>
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