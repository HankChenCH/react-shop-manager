import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber } from 'antd'
import ProductPriceInput from './ProductPriceInput'
import styles from '../Modal.css'

const FormItem = Form.Item;


class PriceForm extends React.Component
{
	constructor(props) {
        super(props)
        const total = this.snapItemsTotalPrice(this.props.item.snap_items)
        this.state = {
            total
        }
    }
    
    handleProductPriceChange = (value) => {
        const total = this.snapItemsTotalPrice(value.snap_items)
        this.setState({
            total
        })
    }

    snapItemsTotalPrice = (snapItems) => snapItems.reduce((preValue, curValue) => {
        return (preValue * 100 + curValue.totalPrice * 100) / 100
    }, 0)

    getSnapItems = (e) => {
        return e.snap_items.map(item => 
            ({ 
                id: item.id, 
                counts: item.counts, 
                price: parseFloat(item.price), 
                totalPrice: parseFloat(item.totalPrice) 
            })
        )
    }
	
	render() {
        const { item, modalType, formItemLayout, form } = this.props
        const { getFieldDecorator } = form

		return (
			<div className={styles.steps_content}>
				<Form>
                    <FormItem label="订单号" {...formItemLayout}>
                        {item.order_no}
                    </FormItem>
                    <FormItem label="订单原价" {...formItemLayout}>
                        ￥ {item.total_price}
                    </FormItem>
                    <FormItem label="商品价格" {...formItemLayout}>
                        {getFieldDecorator('product_price', {
                            initialValue: item.snap_items,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入商品价格'
                                }
                            ],
                            getValueFromEvent: this.getSnapItems
                        })(<ProductPriceInput onChange={this.handleProductPriceChange}/>)}
                    </FormItem>
                    <FormItem label="订单价格" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('discount_price', {
                            initialValue: this.state.total,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入订单总价'
                                },
                            ],
                        })(<InputNumber min={0} step={0.01} disabled />)}
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

export default Form.create({ wrappedComponentRef: true })(PriceForm)