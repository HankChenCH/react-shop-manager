import React from 'react'
import PropTypes from 'prop-types'
import { Timeline } from 'antd'

const TimelineItem = Timeline.Item

export default class OrderTimeLine extends React.Component
{
    constructor(props){
        super(props)
    }

    render() {
        const { data, count, onComplete,state } = this.props

        return (
            <Timeline pending={data.length !== count ? <span style={{ cursor: 'pointer' }} onClick={onComplete}>{state}</span> : false}>
                {data.map( (item, key) => 
                    <TimelineItem key={key}>
                        { key === 0 && 
                            <article>
                                创建订单 {item}
                            </article>
                        }
                        { key === 1 && 
                            <article>
                                支付订单 {item}
                            </article>
                        }
                        { key === 2 && 
                            <article>
                                订单发货 {item}
                            </article>
                        }
                    </TimelineItem>
                )}
            </Timeline>
        )
    }
}