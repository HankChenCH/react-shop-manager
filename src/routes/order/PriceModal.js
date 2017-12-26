import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal } from 'antd'
import { ProductCardList } from '../../components/ProductCardList'
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

const PriceModal = ({
  item,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...priceModalProps
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
      // onOk(data)
    })
  }

  const modalOpts = {
    ...priceModalProps,
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
        <FormItem label="订单号" {...formItemLayout}>
          {item.order_no}
        </FormItem>
        <FormItem label="订单原价" {...formItemLayout}>
          ￥ {item.discount_price || item.total_price}
        </FormItem>
        <FormItem label="订单快照" {...formItemLayout}>
          <ProductCardList data={orderItems} />
        </FormItem>
        <FormItem label="订单价格" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount_price', {
            initialValue: item.discount_price || item.total_price,
            rules: [
              {
                required: true,
                message: '请输入订单总价'
              },
            ],
          })(<InputNumber min={0} step={0.5} />)}
        </FormItem>
        <FormItem label="改价原因" hasFeedback {...formItemLayout}>
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                message: '请输入改价原因'
              },
            ],
          })(<Input type='textarea'/>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

PriceModal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.object.func,
  item: PropTypes.object.isRequired,
}

export default Form.create()(PriceModal)