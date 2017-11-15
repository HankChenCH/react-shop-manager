import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs, Button, Icon, Spin, Modal, Card, Table } from 'antd'
import { DropOption } from '../../../components'
import { Sales } from '../../dashboard/components'
import BuyNowTable from './BuyNowTable'
import { connect } from 'dva'
import InfoModal from './Modal'
import styles from './index.less'

const TabPane = Tabs.TabPane
const confirm = Modal.confirm

const Detail = ({ app, productDetail, dispatch, loading }) => {
  const { list, pagination, selectedRowKeys, data, ticketList, prevProduct, nextProduct, productSales, modalType, modalVisible } = productDetail
  const { isNavbar } = app
  const { properties } = data
  
  const backToList = () => {
    dispatch({ type: 'productDetail/backList' })
  }

  const handleUpdate = (type) => {
    dispatch({ type: 'productDetail/showModal', payload: { modalType: type } })
  }

  const handleLocateProduct = (id) => {
    dispatch({ type: 'productDetail/locateTo', payload: id })
  }

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      handleUpdate('base')
    }

    if (e.key === '2') {
      if (data.is_on === '0') {
        confirm({
          title: '开启秒杀需要先上架商品，是否现在上架?',
          onOk () {
            dispatch({ type: 'productDetail/pullOn' })
            handleUpdate('buyNow')
          },
        })
      } else {
        handleUpdate('buyNow')
      }
    }

    if (e.key === '3') {
      backToList()
    }
  }

  const createModalTitle = (type) => {
    switch(type) {
      case 'buyNow': 
          return '开启秒杀'
        break
      case 'ticket':
          return '出票列表'
        break
      default:
          return '更新商品信息'
        break
    }
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  }
  
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 4 },
    },
  }

  const modalProps = {
    item: modalType !== 'ticket' ? data : ticketList,   
    modalType,
    visible: modalVisible,
    maskClosable: false,
    title: modalType && createModalTitle(modalType),
    wrapClassName: 'vertical-center-modal',
    formItemLayout,
    formItemLayoutWithOutLabel,
    onOk (data) {
      dispatch({
        type: 'productDetail/update',
        payload: {
          data: data
        }
      })
    },
    onCancel () {
      dispatch({ 
        type: 'productDetail/hideModal'
      })
    }
  }

  const buyNowTableProps = {
    item: data,
    dataSource: list,
    pagination,
    onShowTicketList(id) {
      dispatch({
        type: 'productDetail/showTicketModal',
        payload: {
          bid: id
        }
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'productDetail/deleteBuyNow',
        payload: id,
      })
    },
  }

  const propertiesTableProps = {
    dataSource: properties,
    columns: [
      {
        title: '规格名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '规格参数',
        dataIndex: 'detail',
        key: 'detail',
      }
    ],
    showHeader: false,
    pagination: false
  }

  const salesProps = {
    data: productSales,
    reflashable: false,
    style: {
      width: 'auto'
    }
  }

  return (
    <Spin spinning={loading}>
      <Card>
        <div className={styles.content}>
          <Row gutter={8} justify="center" align="center">
            <Col lg={22} md={24}>
              <h2>{data.name}</h2>
            </Col>
            <Col className={styles.center} style={{ height: '46px' }} lg={2} md={12}>
                <DropOption 
                  onMenuClick={e => handleMenuClick(e)} 
                  menuOptions={[{ key: '1', name: '更新基础信息' }, { key: '3', name: '返回列表'}]}
                />
            </Col>
          </Row>
          <Row gutter={8} justify="center" align="center" style={{ paddingTop: 40 }}>
            <Col style={{ textAlign: 'center' }} lg={12} md={24}>
              <img className={styles.main_img} src={data.main_img_url}/>
            </Col>
            <Col lg={12} md={24}>
              <div>简述：{data.summary}</div>
              <div>单价：￥{data.price}</div>
              <div>库存量：{data.stock}</div>
              <div>种类：{data.type === '1' ? '实体商品' : '卡卷商品'}</div>
              <div>状态：{data.is_on === '1' ? '上架' : '下架'}</div>
            </Col>
          </Row>
        </div>
      </Card>      
      <Card>
        <Row gutter={8} justify="center" align="center">
          <Tabs
            className={styles.ant_tabs}
            defaultActiveKey="1"
            tabPosition={isNavbar ? 'top' : 'left'}
          >
            <TabPane tab="商品详情" key="1">
              <Row gutter={8}>
                <Col span={4}>
                  <Button onClick={() => handleUpdate('detail')}>更新商品详情</Button>
                </Col>
                <Col span={24}>
                {
                  data.details instanceof Object && data.details.detail ? 
                  <div dangerouslySetInnerHTML={{ __html: data.details.detail }}></div> : 
                  '暂未录入详情'
                }
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="商品参数" key="2">
              <Row gutter={8}>
                <Col span={4}>
                  <Button onClick={() => handleUpdate('params')}>更新规格参数</Button>
                </Col>
                <Col span={24}>
                {
                  properties instanceof Array && properties.length > 0 ?
                    <Table {...propertiesTableProps} /> : 
                  '暂未录入规格参数'
                }
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="秒杀抢购" key="3">
                <Row gutter={8}>
                  <Col span={4}>
                    <Button onClick={() => handleUpdate('buyNow')}>开启秒杀</Button>
                  </Col>
                  <Col span={24}>
                    <BuyNowTable {...buyNowTableProps} />
                  </Col>
                </Row>
            </TabPane>
            <TabPane tab="商品销量" key="4">
              <Row gutter={8}>
                <Col span={22}>
                  {
                    productSales.length > 0 ?
                    <Card bordered={false} bodyStyle={{
                      padding: '24px 36px 24px 0',
                    }}>
                      <Sales {...salesProps}/>
                    </Card> : 
                    '暂无销售记录'
                  }
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Row>
        <Row className={styles.paganation} gutter={8}>
            <Col span={12}>
            {
              prevProduct.name && 
                <Button style={{ float: 'left' }} onClick={() => handleLocateProduct(prevProduct.id)}>
                  <Icon className={styles.page_icon} type="left"/>
                <span className={styles.text_clip} style={{ display: isNavbar ? 'none' : 'inline-block' }}>{prevProduct.name}</span>
                </Button>              
            }
            </Col>
            <Col span={12}>
            {
              nextProduct.name &&
                <Button style={{ float: 'right' }} onClick={() => handleLocateProduct(nextProduct.id)}>
                <span className={styles.text_clip} style={{ display: isNavbar ? 'none' : 'inline-block' }}>{nextProduct.name}</span>
                  <Icon className={styles.page_icon} type="right"/>
                </Button>           
            }
            </Col>
        </Row>
      </Card>
      <InfoModal {...modalProps}/>
    </Spin>
  )
}

Detail.propTypes = {
  productDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ app, productDetail, loading }) => ({ app, productDetail, loading: loading.models.productDetail }))(Detail)
