import React from 'react'
import PropTypes from 'prop-types'
import SpecificationsInput from './SpecificationsInput'
import { Form, Button, Icon } from 'antd'
import styles from '../Modal.css'

const FormItem = Form.Item

class ParamsInfoForm extends React.Component
{
	constructor(props) {
		super(props)
	}

	remove = (i) => {
	    const { form } = this.props
	    // can use data-binding to get
	    const params = form.getFieldValue('params')
	    // We need at least one passenger
	    if (params.length === 1) {
	      return;
	    }

	    // can use data-binding to set
	    form.setFieldsValue({
	      params: params.filter((key,idx) => idx !== i),
	    })
	}

	add = () => {
	    const { form } = this.props
	    // can use data-binding to get
	    const params = form.getFieldValue('params')
	    const nextParams = params.concat({name: '', detial:''})
	    // can use data-binding to set
	    // important! notify form to detect changes
	    form.setFieldsValue({
	      params: nextParams,
	    })
	}

	render() {
		const { item, formItemLayout, formItemLayoutWithOutLabel, form } = this.props
		const { getFieldDecorator, getFieldValue } = form

	    getFieldDecorator('params', { initialValue: item.properties });
	    const params = getFieldValue('params');
	    const formItems = params.map((k, index) => {
	      return (
	        <FormItem
	          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
	          label={index === 0 ? '规格参数' : ''}
	          required={false}
	          key={index}
	        >
	          {getFieldDecorator(`${index}`, {
	            initialValue: { name: k.name, detail: k.detail },
	            validateTrigger: ['onChange', 'onBlur'],
	            rules: [{
	              required: true,
	            }],
	          })(
	            <SpecificationsInput />
	          )}
	          {params.length > 1 ? (
	            <Icon
	              className="dynamic-delete-button"
	              type="minus-circle-o"
	              disabled={params.length === 1}
	              onClick={() => this.remove(index)}
	            />
	          ) : null}
	        </FormItem>
	      )
	    })

		return (
			<div>
				<div className={styles.steps_content}>
					<Form>
						{formItems}
				        <FormItem {...formItemLayoutWithOutLabel}>
				          <Button type="dashed" onClick={this.add}>
				            <Icon type="plus" /> 添加新的规格参数
				          </Button>
				        </FormItem>
				    </Form>
				</div>
			</div>
		)
	}
}

ParamsInfoForm.propTypes = {
  form: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object,
  item: PropTypes.object,
}

export default Form.create()(ParamsInfoForm)