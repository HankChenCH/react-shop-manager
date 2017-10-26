import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, TreeSelect, Icon } from 'antd'
import { arrayToTree } from '../../utils'
import styles from './Modal.less'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;

class InfoModal extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            idLength: 1
        }
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

    renderTreeNode = (treeList) => {
        const treeNode = treeList.map( item => 
                <TreeNode value={item.id} title={<div><Icon type={item.icon}/><span>{item.name}</span></div>} key={item.id}>
                    {item.children && this.renderTreeNode(item.children)}
                </TreeNode>
        )

        return treeNode
    }

    handleTreeSelectChange = (value) => {
        const { item, menuList } = this.props
        const selectedMenu = menuList.filter((item) => item.id === value)
        item.router = selectedMenu[0].router + '/'
        item.id = selectedMenu[0].id
        this.setState({
            idLength: item.router.replace('/').split('/').length
        })
    }

    render() {
        const { item, menuList, ...modalProps } = this.props
        const { getFieldDecorator } = this.props.form

        const treeList = arrayToTree(menuList, 'id', 'bpid')

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
                    <FormItem label="菜单ID" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('id', {
                            initialValue: item.id,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入菜单ID'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="菜单名" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('name', {
                            initialValue: item.name,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入菜单名'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="所属父级" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('bpid', {
                            initialValue: item.bpid || 1,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择父级菜单'
                                },
                            ],
                        })(
                            <TreeSelect 
                                showSearch
                                dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}
                                placeholder="请选择父级菜单"
                                allowClear
                                treeDefaultExpandAll
                                onChange={this.handleTreeSelectChange}
                            >
                                {this.renderTreeNode(treeList)}
                            </TreeSelect>
                        )}
                    </FormItem>
                    <FormItem label="路由" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('router', {
                            initialValue: item.router,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入路由'
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="图标名" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('icon', {
                            initialValue: item.icon,
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