import React from 'react'
import PropTypes from 'prop-types'
import { Table, InputNumber } from 'antd'
import { config } from '../../../utils'

const { imgStyle } = config

export default class ProductPriceInput extends React.Component
{
    constructor(props){
        super(props)

        const { value } = this.props

        this.state = {
            snap_items: value
        }
    }

    handlePriceChange = (value, id) => {
        const { snap_items } = this.state
        const newSnapItems = snap_items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    price: value,
                    totalPrice: value * item.counts
                }
            }

            return item
        })

        this.setState({
            snap_items: newSnapItems
        })

        this.triggerChange({ snap_items: newSnapItems })
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props;

        if (onChange) {
            onChange({ ...this.state, ...changedValue });
        }
    }

    render() {
        const columns = [
            {
                title: '商品',
                dataIndex: 'main_img_url',
                key: 'productImage',
                render: (text, record) => <section>
                        <img alt='productImage' width={32} src={text + imgStyle.product.thumb} style={{ verticalAlign: 'middle' }}/>
                        <span>{record.name}</span>
                    </section>,
            }, {
                title: '数量',
                dataIndex: 'counts',
                key: 'counts'
            }, {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => 
                        <InputNumber
                            style={{ width: '65px' }}
                            defaultValue={text}
                            min={0}
                            max={999}
                            step={0.01}
                            size='small'
                            onChange={(e) => this.handlePriceChange(e, record.id)}
                        />
            }
        ]

        return (
            <Table 
                dataSource={this.state.snap_items}
                columns={columns}
                simple
                pagination={false}
                rowKey={record => record.id}
            />
        )
    }
}