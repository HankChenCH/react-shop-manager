import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import InfoModal from './Modal'
import { Layout } from '../../../components'

const { Notice } = Layout

const Resource = ({ location, dispatch, resource, loading }) => {
    const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = resource
    const { pageSize } = pagination

    const modalProps = {
        item: (modalType === 'create' ? {} : currentItem),
        modalType: modalType,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`resource/${modalType}`],
        title: `${modalType === 'create' ? '创建资源权限' : '更新资源权限'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
          dispatch({
            type: `resource/${modalType}`,
            payload: data,
          })
        },
        onError (data) {
          dispatch({
            type: `app/messageError`,
            payload: data
          })
        },
        onCancel () {
          dispatch({
            type: 'resource/hideModal',
          })
        },
    }

    const listProps = {
        dataSource: list,
        loading: loading.effects['resource/query'],
        pagination,
        location,
        onChange (page) {
            const { query, pathname } = location
            dispatch(routerRedux.push({
                pathname,
                query: {
                    ...query,
                    page: page.current,
                    pageSize: page.pageSize,
                },
            }))
        },
        onDeleteItem (id) {
            dispatch({
                type: 'resource/delete',
                payload: id,
            })
        },
        onEditItem (item) {
            dispatch({
                type: 'resource/showModal',
                payload: {
                    modalType: 'update',
                    currentItem: item,
                },
            })
        },
        rowSelection: {
            selectedRowKeys,
            onChange: (keys) => {
                dispatch({
                    type: 'resource/updateState',
                    payload: {
                        selectedRowKeys: keys,
                    },
                })
            },
        },
    }

    const filterProps = {
        filter: {
            ...location.query,
        },
        onFilterChange (value) {
            dispatch(routerRedux.push({
                pathname: location.pathname,
                query: {
                    ...value,
                    page: 1,
                    pageSize,
                },
            }))
        },
        onAdd () {
            dispatch({
                type: 'resource/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        }
    }

    const handleDeleteItems = () => {
        dispatch({
          type: 'resource/multiDelete',
          payload: {
            ids: selectedRowKeys,
          },
        })
      }

    return (
        <div className="content-inner">
            <Filter {...filterProps} />
            {
            selectedRowKeys.length > 0 &&
                <Row style={{ marginBottom: 18, textAlign: 'right', fontSize: 13 }}>
                <Col>
                    {`选择了 ${selectedRowKeys.length} 条资源权限 `}
                        <Popconfirm title={'确定要删除选中的资源权限?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                    <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
                    </Popconfirm>
                </Col>
                </Row>
            }
            <List {...listProps} />
            <Notice>切勿随意修改或删除视图资源，这可能导致页面显示错误，如需修改请联系超级管理员</Notice>
            {modalVisible && <InfoModal {...modalProps} /> }
        </div>
    )
}

export default connect(({ resource, loading }) => ({ resource, loading }))(Resource)