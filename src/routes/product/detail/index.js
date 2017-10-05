import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs, Button, Icon, Spin, Modal } from 'antd'
import { DropOption } from '../../../components'
import { Sales } from '../../dashboard/components'
import { connect } from 'dva'
import InfoModal from './Modal'
import styles from './index.less'

const TabPane = Tabs.TabPane
const confirm = Modal.confirm

const Detail = ({ productDetail, dispatch, loading }) => {
  const { data, prevProduct, nextProduct, productSales, modalType, modalVisible } = productDetail
  const { properties } = data

  let productProp = []
  
  if (properties instanceof Array && properties.length > 0) {
    productProp = properties.map( item => 
      <Col className={styles.item} span={24}>
        <div>{item.name}</div>
        <div>{item.detail}</div>
      </Col>
    )
  }
  
  const backToList = () => {
    dispatch({ type: 'productDetail/backList' })
  }

  const handleUpdateBase = () => {
    dispatch({ type: 'productDetail/showModal', payload: { modalType: 'base' } })
  }

  const handleUpdateDetail = () => {
    dispatch({ type: 'productDetail/showModal', payload: { modalType: 'detail' } })
  }

  const handleUpdateParams = () => {
    dispatch({ type: 'productDetail/showModal', payload: { modalType: 'params' } })
  }

  const handlePrevProduct = () => {
    dispatch({ type: 'productDetail/locateTo', payload: prevProduct.id })
  }

  const handleNextProduct = () => {
    dispatch({ type: 'productDetail/locateTo', payload: nextProduct.id })
  }

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      handleUpdateBase()
    }

    if (e.key === '2') {
      if (data.is_on === '0') {
        confirm({
          title: '开启秒杀需要先上架商品，是否现在上架?',
          onOk () {
            dispatch({ type: 'productDetail/pullOn' })
            dispatch({ type: 'productDetail/showModal', payload: { modalType: 'buyNow' } })
          },
        })
      } else {
        dispatch({ type: 'productDetail/showModal', payload: { modalType: 'buyNow' } })
      }
    }

    if (e.key === '3') {
      backToList()
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
    item: data,    
    modalType,
    visible: modalVisible,
    title: modalType !== 'buyNow' ? '更新商品信息' : '开启秒杀',
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

  const salesProps = {
    data: productSales,
    reflashable: false,
    style: {
      width: 'auto'
    }
  }

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <Spin spinning={loading}>
        <Row gutter={8} justify="center" align="center">
          <Col span={22}>
            <h2>{data.name}</h2>
          </Col>
          <Col className={styles.center} style={{ height: '46px' }} span={2}>
              <DropOption 
                onMenuClick={e => handleMenuClick(e)} 
                menuOptions={[{ key: '1', name: '更新基础信息' }, { key: '2', name: '开启秒杀' }, { key: '3', name: '返回列表'}]}
              />
          </Col>
        </Row>
        <Row gutter={8} justify="center" align="center">
          <Col style={{ textAlign: 'center' }} span={24}>
            <img className={styles.main_img} src={data.main_img_url}/>
          </Col>
        </Row>
        <Row>
          <Col className={styles.item} span={24}>
            <article>{data.summary}</article>
          </Col>
        </Row>
        <Row gutter={8} justify="center" align="center">
          <Col className={styles.item} span={12}>
            <div>单价</div>
            <div>￥{data.price}</div>
          </Col>
          <Col className={styles.item} span={12}>
            <div>库存量</div>
            <div>{data.stock}</div>
          </Col>
        </Row>
        <Row gutter={8} justify="center" align="center">
          <Col className={styles.item} span={12}>
            <div>种类</div>
            <div>{data.type === '1' ? '实体商品' : '卡卷商品'}</div>
          </Col>
          <Col className={styles.item} span={12}>
            <div>状态</div>
            <div>{data.is_on === '1' ? '上架' : '下架'}</div>
          </Col>
        </Row>
        <hr style={{ margin: '20px' }}/>
        <Row gutter={8} justify="center" align="center">
          <Tabs
            className={styles.ant_tabs}
            defaultActiveKey="1"
            tabPosition='left'
          >
            <TabPane tab="商品详情" key="1">
              <Row gutter={8}>
                <Col span={20}>
                {
                  data.details instanceof Object && data.details.detail ? 
                  <div dangerouslySetInnerHTML={{ __html: data.details.detail }}></div> : 
                  '暂未录入详情'
                }
                </Col>
                <Col span={4}>
                  <Button onClick={handleUpdateDetail}>更新商品详情</Button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="商品参数" key="2">
              <Row gutter={8}>
                <Col span={20}>
                {
                  properties instanceof Array && properties.length > 0 ?
                  <Row gutter={8} justify="center" align="center">
                    <Col className={styles.item} span={24}>
                      <div>规格名</div>
                      <div>规格参数</div>
                    </Col>
                    {productProp}
                  </Row> : 
                  '暂未录入规格参数'
                }
                </Col>
                <Col span={4}>
                  <Button onClick={handleUpdateParams}>更新规格参数</Button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="商品销量" key="3">
              <Row gutter={8}>
                <Col span={22}>
                  {
                    productSales.length > 0 ?
                    <Sales {...salesProps}/> : 
                    '暂无销售记录'
                  }
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Row>
        <Row className={styles.paganation} gutter={8}>
          <Col span={24}>
            {
              prevProduct.name && 
              <Button style={{ float: 'left' }} onClick={handlePrevProduct}><Icon type="left"/>{prevProduct.name}</Button>              
            }
            {
              nextProduct.name &&
              <Button style={{ float: 'right' }} onClick={handleNextProduct}>{nextProduct.name}<Icon type="right"/></Button>           
            }
          </Col>
        </Row>
        <InfoModal {...modalProps}/>
        </Spin>
      </div>
    </div>
  )
}

Detail.propTypes = {
  productDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ productDetail, loading }) => ({ productDetail, loading: loading.models.productDetail }))(Detail)
