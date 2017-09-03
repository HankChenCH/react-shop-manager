import React from 'react'
import { Form, Icon, Button } from 'antd';
import SpecificationsInput from './SpecificationsInput'
const FormItem = Form.Item;

class DynamicFieldSet extends React.Component {
  remove = (i) => {
    const { form } = this.props;
    // can use data-binding to get
    const params = form.getFieldValue('params');
    // We need at least one passenger
    if (params.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      params: params.filter((key,idx) => idx !== i),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const params = form.getFieldValue('params');
    const nextParams = params.concat({name: '', detial:''});
    console.log(nextParams)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      params: nextParams,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { item } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
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
          {getFieldDecorator(`items${index}`, {
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
      );
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem wrapperCol={{xs: { span: 24, offset: 0 },sm: { span: 24, offset: 0 }}}>
          <Button type="dashed" onClick={this.add} style={{ width: '84%' }}>
            <Icon type="plus" /> 添加新的规格参数
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(DynamicFieldSet);