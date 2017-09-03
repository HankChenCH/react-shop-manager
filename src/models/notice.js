import { message } from 'antd'

export default {
  namespace: 'notice',
  state: {},
  subscriptions: {},
  reducers: {},
  effects: {
  	*messageSuccess ({ payload }) {
  		message.success(payload)
  	}
  },
};
