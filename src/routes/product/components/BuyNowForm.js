import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Editor } from '../../../components'
import { apiPrefix, api } from '../../../utils/config'
import { Form, DatePicker, InputNumber, Input, message } from 'antd'

import styles from '../Modal.css'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Notice } = Layout
const HtmlEditor = Editor.HtmlEditor
const { buyNowRules } = api.image
const uploadRulesImageApi = `${apiPrefix}/${buyNowRules}`

class BuyNowForm extends React.Component
{
    constructor() {
        super()
    }

    disabledDate = (current) =>  {
        // Can not select days before today and today
        return current && current.valueOf() < (Date.now() - 3600 * 1000 * 24);
    }

    render() {
        const { item, modalType, formItemLayout, form } = this.props
        const { getFieldDecorator } = form

        const handleUploadError = (msg) => {
            message.error(msg)
        }

        return (
            <div className={styles.steps_content}>
                <Form>
                    <FormItem label="秒杀批次" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('batch_no', {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写秒杀批次'
                                }
                            ]
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="秒杀时段" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('buynow_time', {
                            rules: [
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
                            initialValue: 0.01,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写秒杀价格'
                                }
                            ]
                        })(<InputNumber style={{width: '100%'}} min={0.01} max={item.price} step={0.01}/>)}
                        <Notice>秒杀价格最低为0.01元，低于0.01元无法进行微信支付</Notice>
                    </FormItem>
                    <FormItem label="秒杀总量" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('stock', {
                            initialValue: 0,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写秒杀总量'
                                }
                            ]
                        })(<InputNumber style={{width: '100%'}} min={0} max={item.stock} />)}
                    </FormItem>
                    <FormItem label="限购数目" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('limit_every', {
                            initialValue: 0,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写限购数目'
                                }
                            ]
                        })(<InputNumber style={{width: '100%'}} min={0}/>)}
                        <Notice>每人限购数量，0则为不限</Notice>
                    </FormItem>
                    <FormItem label="抢购规则" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('rules')(
                            <HtmlEditor
			                    wrapperStyle={{
			                      minWidth: 200,
			                      maxWidth: 700
			                    }}
			                    editorStyle={{
			                      maxHeight: 300,
			                      minHeight: 300,
			                      overFlow: 'hidden',
			                      minWidth: 200,
			                      maxWidth: 700,
			                      backgroundColor: '#fff'
			                    }}
			                    fileName="rulesImage"
			                    action={uploadRulesImageApi}
			                    onUploadError={handleUploadError}
			                />
                        )}
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