import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Icon, Button } from 'antd'
import { ProductMainUpload } from '../../../components/Upload'
import { apiPrefix, api } from '../../../utils/config'
import styles from '../Modal.css'

const FormItem = Form.Item;

const { productMain } = api.image
const uploadMainImageApi = `${apiPrefix}/${productMain}`

class BaseInfoForm extends React.Component
{
	constructor(props) {
		super(props)
	}

	checkMainImage = (rule, value, callback) => {
	    if (value.img_id > 0) {
	      callback();
	      return;
	    }
	    callback('请上传商品图片');
	  }

	render() {
		const { item, modalType, formItemLayout, form } = this.props
		const { getFieldDecorator, validateFields, getFieldsValue } = form
		const { img_id, main_img_url, from } = item

		return (
			<div className={styles.steps_content}>
				<Form>
					<FormItem label="商品名称" hasFeedback {...formItemLayout}>
		                {getFieldDecorator('name', {
		                  initialValue: item.name,
		                  rules: [
		                    {
		                      required: true,
		                      message: '请输入商品名称'
		                    },
		                  ],
		                })(<Input />)}
		              </FormItem>
		              <FormItem label="商品描述" hasFeedback {...formItemLayout}>
		                {getFieldDecorator('summary', {
		                  initialValue: item.summary,
		                  rules: [
		                    {
		                      required: true,
		                      message: '请输入商品描述'
		                    },
		                  ],
		                })(<Input type='textarea'/>)}
		              </FormItem>
		              <FormItem label="商品单价" hasFeedback {...formItemLayout}>
		                {getFieldDecorator('price', {
		                  initialValue: item.price,
		                  rules: [
		                    {
		                      required: true,
		                      message: '请输入商品单价'
		                    },
		                  ],
		                })(<InputNumber style={{width: '100%'}} step={0.01} min={0}/>)}
		              </FormItem>
		              <FormItem label="商品库存" hasFeedback {...formItemLayout}>
		                {getFieldDecorator('stock', {
		                  initialValue: item.stock,
		                  rules: [
		                    {
		                      required: true,
		                      message: '请输入商品库存'
		                    },
		                  ],
		                })(<InputNumber style={{width: '100%'}} min={0}/>)}
		              </FormItem>
		              <FormItem label="上传商品主图" hasFeedback {...formItemLayout}>
		                {getFieldDecorator('img', {
		                  initialValue: { img_id, main_img_url, from },
		                  rules: [
		                  	{ required: true, message: '请上传商品图片' },
		                  	{ validator: this.checkMainImage }
		                  ],
		                })(
		                  <ProductMainUpload
			                name="mainImage"
			                action={uploadMainImageApi}
			              />
		                )}
		             </FormItem>
				</Form>
			</div>
		)
	}
}

BaseInfoForm.propTypes = {
  form: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object,
  item: PropTypes.object,
}

export default Form.create()(BaseInfoForm)