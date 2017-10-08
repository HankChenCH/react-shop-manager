import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio } from 'antd'
import { ProductCardList } from '../../../components/ProductCardList'
import TicketInput from './TicketInput'
import styles from '../Modal.css'

const FormItem = Form.Item

class IssueForm extends React.Component
{
    constructor(props) {
        super(props)
    }

    renderTicketInput = (goods) => {
        console.log(goods)
        const countArray = new Array(goods.counts).fill(1)

        const item = countArray.map( v => {
            <FormItem label={`票号(${goods.name})`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('ticket_no',{
                    rule: [
                        { 
                            required: true,
                            message: '请填写票号'
                        }
                    ]
                })(<Input addonBefore={goods.batch_no} />)}
            </FormItem>
        })
            
        return item
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
            <div>
                <Form>
                    <FormItem label="订单号" hasFeedback {...formItemLayout}>
                        {item.order_no}
                    </FormItem>
                    <FormItem label="订单快照" hasFeedback {...formItemLayout}>
                        <ProductCardList data={orderItems} />
                    </FormItem> 
                    {
                        item.snap_items.map( goods => {
                            return (
                                <div>
                                    <FormItem label={`票号(${goods.name})`} hasFeedback {...formItemLayout}>
                                        {getFieldDecorator(`${goods.id}`,{
                                            initialValue: {
                                                ticket: goods.tickets || new Array(goods.counts).fill(goods.batch_no)
                                            },
                                            rules: [
                                                { 
                                                    required: true,
                                                    message: '请填写票号'
                                                }
                                            ]
                                        })(<TicketInput addonBefore={goods.batch_no} counts={goods.counts} />)}
                                    </FormItem>
                                </div>
                            )
                        })
                    }               
                </Form>
            </div>
        )
    }
}

export default Form.create()(IssueForm)