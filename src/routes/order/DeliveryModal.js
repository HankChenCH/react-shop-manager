import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Radio } from 'antd'
import { ProductCardList } from '../../components/ProductCardList'
import styles from './Modal.css'

const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const DeliveryModal = ({
  item,
  express,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...deliveryModalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      // console.log(data)
      onOk(data)
    })
  }

  const modalOpts = {
    ...deliveryModalProps,
    width: 700,
    onOk: handleOk,
  }

  const orderItems = item.snap_items.map( goods => {
    return {
      img_url: goods.main_img_url,
      title: goods.name,
      description: <div><p>已购 {goods.counts} 件</p><p>共 ￥ {goods.price * goods.counts} 元</p></div>
    }
  })

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="订单号" hasFeedback {...formItemLayout}>
          {item.order_no}
        </FormItem>
        <FormItem label="订单快照" hasFeedback {...formItemLayout}>
          <ProductCardList data={orderItems} />
        </FormItem>
        <FormItem label="快递公司" hasFeedback {...formItemLayout}>
          {getFieldDecorator('express_name', {
            initialValue: "顺丰",
            rules: [
              {
                required: true,
                message: '请选择快递公司'
              },
            ],
          })(
            <RadioGroup>
              {
                express.map( item =>  
                  <RadioButton value={item.express_name}>{item.express_name}</RadioButton>
                )
              }
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="快递单号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('express_no', {
            initialValue: item.express_no,
            rules: [
              {
                required: true,
                message: '请输入快递单号'
              },
            ],
          })(<Input/>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

DeliveryModal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.object.func,
  item: PropTypes.object.isRequired,
}

export default Form.create()(DeliveryModal)