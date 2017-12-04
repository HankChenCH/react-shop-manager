import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'
import { Transfer } from '../../../components'
import { Enum } from '../../../utils'
import styles from './Modal.less'

const FormItem = Form.Item
const { FormTransfer } = Transfer
const { EnumResourceType, EnumPermissionType } = Enum

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
            }

            data.role_resource = data.role_resource.join(',')

            onOk(data)
        })
    }

    renderPermission = (record) => {
        const resourceType = []
        resourceType[EnumResourceType.View] = '视图'
        resourceType[EnumResourceType.Data] = '数据'

        const permissionType = []
        permissionType[EnumPermissionType.Public] = '公共'
        permissionType[EnumPermissionType.Protected] = '保护'
        permissionType[EnumPermissionType.Private] = '私人'

        const title = `[${resourceType[record.resource_type]}/${permissionType[record.permission_type]}] - ${record.name}`

        const label = (
            <span>
                {title}
            </span>
        )

        return {
            label: label,
            value: title
        }
    }

    render() {
        const { item, resourceList, ...modalProps } = this.props
        const { getFieldDecorator } = this.props.form

        const role_resource = item.resources ? item.resources.map(i => i.id) : []

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
            width: 900,
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
                    <FormItem label="角色资源" hasFeedback {...formItemLayout} >
                        {getFieldDecorator('role_resource',{
                            initialValue: role_resource
                        })(
                            <FormTransfer
                                dataSource={resourceList}
                                showSearch
                                listStyle={{
                                    width: 225,
                                    height: 250,
                                }}
                                titles={['来源', '已选']}
                                render={this.renderPermission}
                            />
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