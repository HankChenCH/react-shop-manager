import React from  'react'
import { Transfer } from 'antd'

export default class FormTransfer extends React.Component
{
    constructor(props){
        super(props)

        const { value } = this.props

        this.state = {
            targetKeys: value || []
        }
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({
                targetKeys: value
            });
        }
    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        // console.log(nextTargetKeys)
        if (!('value' in this.props)) {
            this.setState({ nextTargetKeys });
        }
        this.triggerChange({ nextTargetKeys });
    }

    triggerChange = (targetKeys) => {
        // Should provide an event to pass value to Form.
        // console.log(targetKeys)
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, targetKeys));
        }
    }

    render() {
        return (
            <Transfer
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange}
                {...this.props}
            />
        )
    }
}