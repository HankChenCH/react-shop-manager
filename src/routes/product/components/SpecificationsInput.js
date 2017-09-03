import React from 'react'
import { Input } from 'antd'

export default class SpecificationsInput extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      name: value.name || '',
      detail: value.detail || '',
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }
  handleNameChange = (e) => {
    const name = e.target.value
    if (!('value' in this.props)) {
      this.setState({ name });
    }
    this.triggerChange({ name });
  }
  handleDetailChange = (e) => {
    const detail = e.target.value
    if (!('value' in this.props)) {
      this.setState({ detail });
    }
    this.triggerChange({ detail });
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    const { size } = this.props;
    const state = this.state;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.name}
          onChange={this.handleNameChange}
          placeholder="规格参数名称"
          style={{ width: '40%', marginRight: '3%' }}
        />
        <Input
          type="text"
          size={size}
          value={state.detail}
          onChange={this.handleDetailChange}
          placeholder="规格参数细节"
          style={{ width: '40%', marginRight: '3%' }}
        />
      </span>
    );
  }
}