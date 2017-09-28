import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws'
import { config } from '../utils'
import { message } from 'antd'
const { prefix } = config

export default modelExtend(model, {
    namespace: 'websocket',

    state: {

    },

    subscriptions: {
        setup ({ dispatch }) {
            ws.connect()
        },
        wsMessage ({ dispatch }) {
            ws.listen('notice',(res) => {
                dispatch({ type: 'globalNotice', payload: res.data })
            })
        }
    },

    effects: {
        *globalNotice ({ payload }, { put }) {
            
        }
    },

    reducers: {

    }
})