import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { hasProp } from '../../../utils'

export default class TicketInput extends React.Component
{
    constructor(props) {
        super(props)

        const value = this.props.value || [this.props.addonBefore]
        this.state = {
            ticket: value.ticket
        }
    }

    handleTicketChange = (e, i) => {
        const { addonBefore } = this.props
        const ticketNo = e.target.value
        const { ticket } = this.state

        ticket[i] = addonBefore + ticketNo

        this.triggerChange({ ticket })
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props;

        if (onChange) {
          onChange({ ...this.state, ...changedValue });
        }
    }

    render() {
        const { addonBefore } = this.props

        const ticketInputs = this.state.ticket.map( (item, i) => {
            
            return (
                <Input 
                    addonBefore={addonBefore} 
                    onChange={ (e) => this.handleTicketChange(e, i) }
                />
            )
        })

        return(
            <div>
                {ticketInputs}
            </div>
        )

    }
}