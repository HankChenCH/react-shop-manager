import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio } from 'antd'
import { ProductCardList } from '../../../components/ProductCardList'
import styles from '../Modal.css'

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DeliveryForm extends React.Component
{
	constructor(props) {
		super(props)
	}
	
	render() {
        const { item, express, modalType, formItemLayout, form } = this.props
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
                    <FormItem label="订单号" hasFeedback {...formItemLayout}>
                        {item.order_no}
                    </FormItem>
                    <FormItem label="订单快照" hasFeedback {...formItemLayout}>
                        <ProductCardList data={orderItems} />
                    </FormItem>
                    <FormItem label="快递公司" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('express_name', {
                            initialValue: item.snap_express.express_name,
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
			</div>
		)
	}
}

DeliveryForm.propTypes = {
  form: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object,
  item: PropTypes.object,
}

export default Form.create({ wrappedComponentRef: true })(DeliveryForm)