import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber } from 'antd'
import { ProductCardList } from '../../../components/ProductCardList'
import styles from '../Modal.css'

const FormItem = Form.Item;


class PriceForm extends React.Component
{
	constructor(props) {
		super(props)
	}
	
	render() {
        const { item, modalType, formItemLayout, form } = this.props
        const { getFieldDecorator } = form
        
        
        const orderItems = item.snap_items.map( goods => {
            return {
            img_url: goods.main_img_url,
            title: goods.name,
            description: <div><p>已购 {goods.counts} 件</p><p>共 ￥ {goods.price * goods.counts} 元</p></div>
            }
        })

		return (
			<div className={styles.steps_content}>
				<Form>
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
			</div>
		)
	}
}

PriceForm.propTypes = {
  form: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object,
  item: PropTypes.object,
}

export default Form.create()(PriceForm)