import modelExtend from 'dva-model-extend'
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

            if (!notificationSetting instanceof Object) {
                notificationSetting = {
                    placement: 'bottomRight',
                    duration: 4.5,
                }

                yield localStorage.setItem(`${prefix}notificationSetting`, JSON.stringify(notificationSetting))
            }

            dispatch({ type: 'handleNotificationPlacement', payload: notificationSetting.placement })
            dispatch({ type: 'handleNotificationDuration', payload: notificationSetting.duration })
        },
        wsSetup ({ dispatch }) {
            ws.connect()
            
            window.onunload = () => {
                ws.close()
            }
        },
        wsListen ({ dispatch }) {
            ws.listen('notice',(res) => {
                dispatch({ type: 'app/globalNotice', payload: res.data })
            })
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