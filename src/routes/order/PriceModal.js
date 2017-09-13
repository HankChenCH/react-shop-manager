import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal } from 'antd'
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
      onOk(data)
    })
  }

  const modalOpts = {
    ...priceModalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="订单号" hasFeedback {...formItemLayout}>
          {item.order_no}
        </FormItem>
        <FormItem label="订单快照" hasFeedback {...formItemLayout}>
          <div className={styles.snap_item_list}>
          {item.snap_items.map(
            (goods) => <div className={styles.goods_item}>
              <img className={styles.goods_img} src={goods.main_img_url} alt={goods.name}/>
              <span>{goods.name}</span>
              <span>已购{goods.counts}件</span>
              <span>{goods.price}元</span>
            </div>
          )}
          </div>
        </FormItem>
        <FormItem label="订单价格" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount_price', {
            initialValue: item.discount_price,
            rules: [
              {
                required: true,
                message: '请输入订单总价'
              },
            ],
          })(<InputNumber min={0} step={0.01} />)}
        </FormItem>
        <FormItem label="改价原因" hasFeedback {...formItemLayout}>
          {getFieldDecorator('reason', {
            initialValue: item.reason,
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