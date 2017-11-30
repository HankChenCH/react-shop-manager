import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'
import BaseForm from '../components/AdminBaseForm'
import { Validate } from '../../utils'

const FormItem = Form.Item
const { confirmPassword } = Validate

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

// const modal = ({
//   item = {},
//   modalType,
//   onOk,
//   form: {
//     getFieldDecorator,
//     validateFields,
//     getFieldsValue,
//     getFieldValue,
//   },
//   ...modalProps
// }) => {
//   const handleOk = () => {
//     validateFields((errors) => {
//       if (errors) {
//         return
//       }
//       const data = {
//         ...getFieldsValue(),
//         // key: item.key,
//       }

//       onOk(data)
//     })
//   }

//   const modalOpts = {
//     ...modalProps,
//     onOk: handleOk,
//   }

//   const baseFormProps = {
//     item,
//     modalType,
//     formItemLayout
//   }

//   return (
//     <Modal {...modalOpts}>
//       <BaseForm ref="adminBaseForm" {...baseFormProps} />
//     </Modal>
//   )
// }

class InfoModal extends React.Component
{
  constructor(props){
    super(props)
  }

  handleOk = () => {
    const { onOk } = this.props
    const { adminBaseForm } = this.refs
    const { validateFields, getFieldsValue } = adminBaseForm

    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        // key: item.key,
      }

      onOk(data)
    })
  }

  render(){
    const { item={}, modalType, ...modalProps } = this.props

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
        <BaseForm ref="adminBaseForm" {...baseFormProps} />
      </Modal>
    )
  }
}

InfoModal.propTypes = {
  modalType: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default InfoModal
