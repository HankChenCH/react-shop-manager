import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { AuthButton } from '../../../components/Auth'
import { env } from '../../../utils'
import List from './List'
import Filter from './Filter'
import InfoModal from './Modal'

const Role = ({ location, dispatch, app, role, resource, loading }) => {
    const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = role
    const resourceList = resource.list
    const { userAuth } = app
    const { pageSize } = pagination

    const modalProps = {
        item: (modalType === 'create' ? {} : currentItem),
        resourceList: resourceList.map(i => ({ key: i.id, ...i })),
        modalType: modalType,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`role/${modalType}`],
        title: `${modalType === 'create' ? '创建角色' : '更新角色'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
          dispatch({
            type: `role/${modalType}`,
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
            type: 'role/hideModal',
          })
        },
    }

    const listProps = {
        dataSource: list,
        loading: loading.effects['role/query'],
        pagination,
        location,
        userAuth,
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
                type: 'role/delete',
                payload: id,
            })
        },
        onEditItem (item) {
            dispatch({
                type: 'role/showModal',
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
                    type: 'role/updateState',
                    payload: {
                        selectedRowKeys: keys,
                    },
                })
            },
        },
    }

    const filterProps = {
        userAuth,
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
                type: 'role/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        }
    }

    const handleDeleteItems = () => {
        dispatch({
          type: 'role/multiDelete',
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
                    {`选择了 ${selectedRowKeys.length} 条角色 `}
                    <Popconfirm title={'确定要删除选中的角色?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                        <AuthButton auth={env.roleRemove} userAuth={userAuth} type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</AuthButton>
                    </Popconfirm>
                </Col>
                </Row>
            }
            <List {...listProps} />
            {modalVisible && <InfoModal {...modalProps} /> }
        </div>
    )
}

export default connect(({ app, role, resource, loading }) => ({ app, role, resource, loading }))(Role)