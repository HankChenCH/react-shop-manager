import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from '../../../components'
import { Form, DatePicker, InputNumber, Input } from 'antd'
import styles from '../Modal.css'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Notice } = Layout

class BuyNowForm extends React.Component
{
    constructor() {
        super()
    }

    disabledDate = (current) =>  {
        // Can not select days before today and today
        return current && current.valueOf() < (Date.now() - 3600 * 1000 * 24);
    }

    getBatchNo = () => {
        return 'ABC'
    } 

    render() {
        const { item, modalType, formItemLayout, form } = this.props
        const { getFieldDecorator } = form

        return (
            <div className={styles.steps_content}>
                <Form>
                    <FormItem label="秒杀批次" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('batch_no', {
                            initialValue: this.getBatchNo(),
                            rule: [
                                {
                                    required: true,
                                    message: '请填写秒杀批次'
                                }
                            ]
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="秒杀时段" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('buynow_time', {
                            rule: [
                                {
                                    required: true,
                                    message: '请选择秒杀时段'
                                }
                            ]
                        })(
                            <RangePicker
                                style={{ float: 'left', width: '72%' }}
                                showTime={{ format: 'HH:mm' }}
                                disabledDate={this.disabledDate}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始时间', '结束时间']}
                            />
                        )}
                    </FormItem>
                    <FormItem label="秒杀价格" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('price', {
                            initialValue: 0,
                            rule: [
                                {
                                    required: true,
                                    message: '请填写秒杀价格'
                                }
                            ]
                        })(<InputNumber style={{width: '100%'}} min={0} max={item.price} step={0.01}/>)}
                    </FormItem>
                    <FormItem label="秒杀总量" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('stock', {
                            initialValue: 0,
                            rule: [
                                {
                                    required: true,
                                    message: '请填写秒杀总量'
                                }
                            ]
                        })(<InputNumber style={{width: '100%'}} min={0} max={item.stock} />)}
                        <Notice>开启秒杀后自动扣除当前总库存，秒杀结束后剩余量返回总库存</Notice>
                    </FormItem>
                    <FormItem label="限购数目" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('limit_every', {
                            initialValue: 0,
                            rule: [
                                {
                                    required: true,
                                    message: '请填写限购数目'
                                }
                            ]
                        })(<InputNumber style={{width: '100%'}} min={0}/>)}
                        <Notice>每人限购数量，0则为不限</Notice>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

BuyNowForm.proptypes = {
    form: PropTypes.object.isRequired
}

export default Form.create()(BuyNowForm)