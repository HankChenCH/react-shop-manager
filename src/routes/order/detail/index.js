import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin, Timeline, Card, Row, Col } from 'antd'
import { classnames, Enum } from '../../../utils'
import { DropOption } from '../../../components'
import { ProductCardList } from '../../../components/ProductCardList/'
import { Comments } from '../../dashboard/components'
import { OrderTimeLine } from '../components'
import styles from './index.less'

const { EnumOrderStatus } = Enum
const bodyStyle = {
    bodyStyle: {
      height: 432,
      background: '#fff',
    },
}

const Index = ({ dispatch, orderDetail, loading, location }) => {
    const { data } = orderDetail

    const orderItems = data.snap_items.map( goods => {
        return {
          img_url: goods.main_img_url,
          title: goods.name,
          description: <div><p>已购 {goods.counts} 件</p><p>共 ￥ {goods.price * goods.counts} 元</p></div>
        }
    })

    const timelineData = [
        data.create_time,
        data.pay_time,
        data.delivery_time
    ]

    const logsColumns = [
        {
            title: '操作日志',
            dataIndex: 'log',
            key: 'log'
        },
        {
            title: '操作时间',
            dataIndex: 'create_time',
            key: 'create_time'
        }
    ]

    const renderStatus = (status, prepay_id) => {
        switch (status){
            case EnumOrderStatus.CLOSED:
                return '已关闭'
            case EnumOrderStatus.UNPAY:
                return prepay_id ? '未支付（已申请第三方支付）' : '未支付'
            case EnumOrderStatus.UNDELIVERY:
                return '已付款待发货'
            case EnumOrderStatus.DELIVERY:
                return '已发货'
        }
    }

    const renderPrice = (orderPrice, discountPrice) => {
        return ( 
            <span>
                <strong style={{ textDecoration: discountPrice ? 'line-through' : 'none' }}>{orderPrice}</strong>
                {discountPrice}
            </span>
        )
    }

    const renderSnapExpress = (express) => {
        if (express == null) {
            return '-'
        }

        return (<div>{express.express_name}</div>)
    }

    return  (
        <div>
            <Spin spinning={loading}>
                <div className="content-inner">
                    <div className={styles.content}>
                        <Row gutter={8}>
                            <Col span={22}>
                                <h2>{data.order_no}</h2>
                            </Col>
                            <Col className={styles.center} style={{ height: '46px' }} span={2}>
                                <DropOption 
                                    onMenuClick={e => handleMenuClick(e)} 
                                    menuOptions={[{ key: '3', name: '返回列表'}]}
                                />
                            </Col>
                        </Row>
                        <Row gutter={8} justify="center" align="center">
                            <Col span={12}>
                                <ProductCardList data={orderItems} cardStyle={{ width:210 }}/>
                            </Col>
                            <Col span={12}>
                                <div>快递：</div>
                                <div>{renderSnapExpress(data.snap_express)}</div>
                                <div>收货地址：</div>
                                <div>{`${data.snap_address.province} ${data.snap_address.city} ${data.snap_address.country}`} {`${data.snap_address.detail}`} {`${data.snap_address.name}收 ${data.snap_address.mobile}`}</div>
                                <div>总价：</div>
                                <div>￥{renderPrice(data.total_price, data.discount_price)}</div>
                                <div>状态：</div>
                                <div>{renderStatus(data.status.toString(), data.prepay_id)}</div>
                            </Col>
                        </Row>
                    </div>                
                </div>
                <Row gutter={24} style={{ marginTop: 24 }}>
                    <Col lg={8} md={24}>
                        <Card bordered={false} {...bodyStyle}>
                            <OrderTimeLine data={timelineData.filter((i) => i)} count={3} />
                        </Card>
                    </Col>
                    <Col lg={16} md={24}>
                        <Card bordered={false} {...bodyStyle}>
                            <Comments columns={logsColumns} data={data.logs} />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    )
}

Index.propTypes = {
    loading: PropTypes.object.isRequired,
}

export default connect(({ orderDetail, loading }) => ({ orderDetail, loading: loading.models.orderDetail }))(Index)