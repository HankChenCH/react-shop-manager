import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { model } from './common'
import * as ws from '../services/ws'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {
    namespace: 'websocket',

    state: {
        notificationPlacement: '',
        notificationDuration: 4.5,
    },

    subscriptions: {
        setup ({ dispatch }) {
            let notificationSetting = JSON.parse(localStorage.getItem(`${prefix}notificationSetting`))

            if (!(notificationSetting instanceof Object)) {
                notificationSetting = {
                    placement: 'bottomRight',
                    duration: 4.5,
                }

                localStorage.setItem(`${prefix}notificationSetting`, JSON.stringify(notificationSetting))
            }

            dispatch({ type: 'setNotificationConfig', payload: notificationSetting })
        },
        wsSetup ({ dispatch }) {
            // ws.connect()

            // let timer = setInterval(() => {
            //     ws.trigger('heartbeatCheck')
            // }, 25000) 
            
            // window.onunload = () => {
            //     clearInterval(timer)
            //     ws.close()
            // }
        },
        wsListen ({ dispatch }) {
            // ws.listen('notice',(res) => {
            //     dispatch({ type: 'app/globalNotice', payload: res })
            // })
            // ws.listen('msg', (res) => {
            //     dispatch({ type: 'app/addNoticeCount' })
                // dispatch({ type: 'chat/receiveMsg', payload: res })
            // })
        },
    },

    effects: {
        *setNotificationConfig ({ payload }, { put }) {
            notification.config({ ...payload })

            yield put({ type: 'handleNotificationPlacement', payload: payload.placement })
            yield put({ type: 'handleNotificationDuration', payload: payload.duration })
        },
    },

    reducers: {
        handleNotificationPlacement (state, { payload }) {
            return {
                ...state,
                notificationPlacement: payload
            }
        },

        handleNotificationDuration (state, { payload }) {
            return {
                ...state,
                notificationDuration: payload
            }
        },
    }
})