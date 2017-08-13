import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Radio } from 'antd'
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
        <FormItem label="快递公司" hasFeedback {...formItemLayout}>
          {getFieldDecorator('express_company', {
            initialValue: item.express_company,
            rules: [
              {
                required: true,
                message: '请选择快递公司'
              },
            ],
          })(
            <RadioGroup defaultValue="顺丰">
              <RadioButton value="顺丰">顺丰</RadioButton>
              <RadioButton value="中通">中通</RadioButton>
              <RadioButton value="申通">申通</RadioButton>
              <RadioButton value="圆通">圆通</RadioButton>
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