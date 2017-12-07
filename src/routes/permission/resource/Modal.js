import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Modal, Form, Input, Radio, Select, AutoComplete } from 'antd'
import { Enum, env } from '../../../utils'
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
                data.description = data.method + ' ' + data.description_data
                delete data.method
                delete data.description_data
            } else {
                data.description = data.description_view
                delete data.description_view
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
        let descriptionDom

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

        if (resource_type === '1') {
            const envArr = lodash.values(env)
            const envKeys = Object.keys(env)
            descriptionDom = (
                <Select
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {envKeys.map((item) => <Option key={item} value={env[item]}>{env[item]}</Option>)}
                </Select>
            )
        } else {
            descriptionDom = <Input addonBefore={descriptionBefore} style={{ width: '100%' }} />
        }

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
                        {
                        resource_type === '2' ?
                        getFieldDecorator('description_data', {
                            initialValue: modalType === 'update' && item.resource_type === '2' ? item.description.split(' ')[1] : item.description,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入资源权限描述'
                                },
                            ],
                        })(descriptionDom) :
                        getFieldDecorator('description_view', {
                            initialValue: modalType === 'update' && item.resource_type === '2' ? item.description.split(' ')[1] : item.description,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入资源权限描述'
                                },
                            ],
                        })(descriptionDom)
                        }
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