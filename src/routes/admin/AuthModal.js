import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'antd'
import { Transfer } from '../../components'
import { Validate } from '../../utils'

const FormItem = Form.Item
const { confirmPassword } = Validate
const { FormTransfer } = Transfer

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class AuthModal extends React.Component
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

      data.admin_role = data.admin_role.join(',')

      onOk(data)
    })
  }

  render(){
    const { item, roleList, modalType, ...modalProps } = this.props
    const { getFieldDecorator } = this.props.form

    const modalOpts = {
      ...modalProps,
      onOk: this.handleOk,
    }

    const baseFormProps = {
      item,
      modalType,
      formItemLayout
    }

    return (
      <Modal {...modalOpts}>
        <Form>
            <FormItem>
                {getFieldDecorator('admin_role', {
                    initialValue: item.roles ? item.roles.map(i => ({ key: i.id })) : []
                })(
                    <FormTransfer
                        dataSource={roleList}
                        showSearch
                        titles={['来源', '已选']}
                        render={(item) => ({ label: item.name, value: item.name })}
                    />
                )}
            </FormItem>
        </Form>
      </Modal>
    )
  }
}

AuthModal.propTypes = {
  modalType: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(AuthModal)