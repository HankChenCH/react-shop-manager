import React from 'react'
import { Form, Switch, Radio, InputNumber, Button } from 'antd'
import { Validate } from '../../../utils'

const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { confirmPassword } = Validate

class NoticeSettingForm extends React.Component {

    constructor(props) {
        super(props)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.onSave(values)
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { item, formItemLayout, tailFormItemLayout, buttonLoading } = this.props

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="消息通知"
                >
                    {getFieldDecorator('on',{
                        initialValue: item.notificationOn
                    })(
                        <Switch defaultChecked={item.notificationOn} checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="通知位置"
                >
                    {getFieldDecorator('placement',{
                        initialValue: item.notificationPlacement
                    })(
                        <RadioGroup>
                            <RadioButton value="topLeft">左上</RadioButton>
                            <RadioButton value="topRight">右上</RadioButton>
                            <RadioButton value="bottomLeft">左下</RadioButton>
                            <RadioButton value="bottomRight">右下</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="停留时间"
                >
                    {getFieldDecorator('duration',{
                        initialValue: item.notificationDuration
                    })(
                        <InputNumber min={1} max={10} step={0.5}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={buttonLoading}>保存</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(NoticeSettingForm);