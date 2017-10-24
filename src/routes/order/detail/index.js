import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin, Timeline, Card, Row, Col, Modal } from 'antd'
import { classnames, Enum, hasProp } from '../../../utils'
import { DropOption } from '../../../components'
import { ProductCardList } from '../../../components/ProductCardList/'
import { Comments } from '../../dashboard/components'
import { OrderTimeLine } from '../components'
import ModalForm from '../ModalForm'
import styles from './index.less'

const confirm = Modal.confirm

const { EnumOrderStatus } = Enum

const bodyStyle = {
    bodyStyle: {
      minHeight: 432,
      background: '#fff',
    },
}

const Detail = ({ dispatch, express, orderDetail, loading }) => {
    const { data, modalVisible, modalType } = orderDetail
    const expresses = express.list

    const handleMenuClick = (e) => {
        switch (e.key) {
            case '1':
                confirm({
                    title: '确定要关闭订单 ' + data.order_no + ' ?',
                    onOk () {
                        dispatch({
                            type: 'order/delete',
                            payload: id
                        })
                    },
                })
                break
            case '2':
                break
            case '3':
                dispatch({
                    type: 'orderDetail/showModal',
                    payload: {
                        modalType: 'delivery'
                    }
                })
                break
            case '4':
                dispatch({
                    type: 'orderDetail/showModal',
                    payload: {
                        modalType: 'issue'
                    }
                })
                break
            case '5':
                dispatch({
                    type: 'orderDetail/backList',
                    payload: {
                        model: 'order',
                        url: 'order',
                        query: {
                            status: data.status
                        }
                    }
                })
                break
        }
    }

    const hanldeTimelineClick = (status) => {
        switch (status){
            case EnumOrderStatus.CLOSED:
                break
            case EnumOrderStatus.UNPAY:
                break
            case EnumOrderStatus.UNDELIVERY:
                if (data.type === '1') {
                    dispatch({
                        type: 'orderDetail/showModal',
                        payload: {
                            modalType: 'delivery'
                        }
                    })
                } else if (data.type === '2') {
                    dispatch({
                        type: 'orderDetail/showModal',
                        payload: {
                            modalType: 'issue'
                        }
                    })
                }
                break
            case EnumOrderStatus.DELIVERY:
                break;
        }
    }

    const renderStatus = (status, prepay_id) => {
        switch (status){
            case EnumOrderStatus.CLOSED:
                return '已关闭'
            case EnumOrderStatus.UNPAY:
                return prepay_id ? '未支付（已申请第三方支付）' : '未支付'
            case EnumOrderStatus.UNDELIVERY:
                if (data.type === '1') {
                    return '已支付待发货'
                } else if (data.type === '2') {
                    return '已支付待出票'
                }
            case EnumOrderStatus.DELIVERY:
                return '已发货'
        }
    }

    const renderPrice = (orderPrice, discountPrice) => {
        return ( 
            <span>
                <strong style={{ textDecoration: discountPrice ? 'line-through' : 'none', color: discountPrice ? 'red' : '#000' }}>{orderPrice}</strong>&nbsp;
                <strong>{discountPrice}</strong>
            </span>
        )
    }

    const renderSnapExpress = (express) => {
        if (express == null) {
            return '-'
        }

        return (<div>{express.express_name}</div>)
    }

    const orderItems = hasProp(data, 'snap_items') ? data.snap_items.map( goods => {
        return {
          title: goods.name,
          description: <div><p>已购 {goods.counts} 件</p><p>共 ￥ {goods.price * goods.counts} 元</p></div>
        }
    }) : []

    const timelineData = [
        data.create_time,
        data.pay_time,
        data.delivery_time
    ]

    const menuList = () => {
        const menu = []
        const status = data.status.toString()
        if (status === EnumOrderStatus.UNDELIVERY) {
            if (data.type === '1') {
                menu.push({ key: '3', name: '订单发货' })
            } else if (data.type === '2') {
                menu.push({ key: '4', name: '订单出票' })
            }
        } else if (status === EnumOrderStatus.UNPAY) {
            menu.push({ key: '1', name: '关闭订单' })
        }

        menu.push({ key: '5', name: '返回列表'})

        return menu;
    }

    const logsColumns = [
        {
            title: '操作日志',
            dataIndex: 'log',
            key: 'log',
            width: 50,
        },
        {
            title: '原因',
            dataIndex: 'reason',
            key: 'reason',
            width: 50,
        }
    ]

    const modalProps = {
        item: data,
        express: expresses,
        modalType,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`order/${modalType}Item`],
        title: modalType === 'delivery' ? '订单发货' : '订单出票',
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
          dispatch({
            type: `order/${modalType}Item`,
            payload: data
          })
        },
        onCancel () {
          dispatch({
            type: 'orderDetail/hideModal',
          })
        },
    }

    return  (
        <div>
            {data.id && 
                <Spin spinning={loading.models.orderDetail}>
                    <div className="content-inner">
                        <div className={styles.content}>
                            <Row gutter={8}>
                                <Col span={22}>
                                    <h2>订单编号：{data.order_no}</h2>
                                </Col>
                                <Col className={styles.center} style={{ height: '46px' }} span={2}>
                                    <DropOption 
                                        onMenuClick={e => handleMenuClick(e)} 
                                        menuOptions={(menuList)()}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={8} justify="center" align="center" style={{ paddingTop: 40 }}>
                                <Col span={10}>
                                    <OrderTimeLine data={timelineData.filter((i) => i)} count={3} state={renderStatus(data.status.toString(), data.prepay_id)} onComplete={() => hanldeTimelineClick(data.status.toString())} />
                                </Col>
                                <Col span={14}>
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
                        <Col lg={12} md={24}>
                            <Card bordered={false} {...bodyStyle}>
                                <h3>订单商品：</h3>
                                <ProductCardList data={orderItems} cardStyle={{ width:210 }}/>
                            </Card>
                        </Col>
                        <Col lg={12} md={24}>
                            <Card bordered={false} {...bodyStyle}>
                                <h3>订单日志：</h3>
                                <Comments columns={logsColumns} dataSource={data.logs} />
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            }
            {modalVisible && <ModalForm {...modalProps}/>}
        </div>
    )
}

Detail.propTypes = {
    loading: PropTypes.object.isRequired,
    orderDetail: PropTypes.object.isRequired,
}

export default connect(({ express, orderDetail, loading }) => ({ express, orderDetail, loading }))(Detail)