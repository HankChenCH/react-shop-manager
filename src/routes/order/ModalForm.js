import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal } from 'antd'
import { PriceForm, DeliveryForm, IssueForm } from './components/'
import styles from './Modal.css'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

export default class ModalForm extends React.Component
{
    constructor(props) {
        super(props)
    }

    render() {
        const { item, modalType, onOk, express, form, ...modalProps } = this.props

        const handleOk = () => {
            const { validateFields, getFieldsValue } = this.refs.infoForm
            
            validateFields((errors) => {
              if (errors) {
                return
              }
              const data = {
                ...getFieldsValue(),
              }
              
              onOk(data)
            })
        }
        
        const modalOpts = {
            ...modalProps,
            width: 700,
            onOk: handleOk,
        }
    
        const formProps = {
            item,
            modalType,
            express,
            ref: 'infoForm',
            formItemLayout,
        }

        return (
            <Modal {...modalOpts}>
                {
                    modalType === 'price'
                    &&
                    <PriceForm {...formProps} />
                }
                {
                    modalType === 'delivery'
                    &&
                    <DeliveryForm {...formProps} />
                }
                {
                    modalType === 'issue'
                    &&
                    <IssueForm {...formProps} />
                }
            </Modal>
        )
    }
}