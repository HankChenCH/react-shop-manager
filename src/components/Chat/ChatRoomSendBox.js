import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input } from 'antd'

const FormItem = Form.Item

class ChatRoomBox extends React.Component
{
    constructor() {
        super()
    }

    handleSend = (e) => {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if (ctrlKey && keyCode == 13) {
            const { onSend } = this.props
            const { getFieldValue, resetFields } = this.props.form
    
            const data = getFieldValue('message')
    
            resetFields()
    
            onSend(data)
        }
    }

    render() {
        const { form } = this.props
        const { getFieldDecorator } = form

        return (
            <div>
                <Form>
                    <FormItem>
		                {getFieldDecorator('message')(<Input type='textarea' onKeyUp={this.handleSend} autosize={{ minRows: 4, maxRows: 4 }}/>)}
                    </FormItem>
                </Form>
                <Button style={{ float: 'right' }} type="primary" onClick={this.handleSend}>发送 / Ctrl + Enter</Button>
            </div>
        )
    }
}

ChatRoomBox.proptypes = {
    onSend: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
}

export default Form.create()(ChatRoomBox)
