import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '../../../components'
import { Form, Button, message } from 'antd'
import { apiPrefix, api } from '../../../utils/config'
import styles from '../Modal.css'

const FormItem = Form.Item
const HtmlEditor = Editor.HtmlEditor
const { productDetail } = api.image
const uploadDetailImageApi = `${apiPrefix}/${productDetail}`

class DetailInfoForm extends React.Component
{
	constructor(props) {
		super(props)
	}

	render() {
		const { item, formItemLayout, onDetailsOk, onChangeStep, form } = this.props
		const { getFieldDecorator, validateFields, getFieldsValue } = form

		const handleUploadError = (msg) => {
				message.error(msg)
		}

		const detail = (item.details !== null && ('detail' in item.details)) ? item.details.detail : ''

		return (
			<div>
				<div className={styles.steps_content}>
					<Form>
						<FormItem label="商品详情" hasFeedback {...formItemLayout}>
			                {getFieldDecorator('detail', {
			                  initialValue: detail,
			                  rules: [
			                    {
			                      required: true,
			                      message: '请填写商品详情'
			                    },
			                  ],
			                })(<HtmlEditor
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
			                    fileName="detailImage"
			                    action={uploadDetailImageApi}
			                    onUploadError={handleUploadError}
			                />)}
			            </FormItem>
					</Form>
				</div>
			</div>
		)
	}
}

DetailInfoForm.propTypes = {
  form: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object,
  item: PropTypes.object,
}

export default Form.create()(DetailInfoForm)