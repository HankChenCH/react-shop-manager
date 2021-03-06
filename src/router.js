import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'product',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/product'))
              cb(null, require('./routes/product/'))
            }, 'product')
          },
        }, {
          path: 'product/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/product'))
              registerModel(app, require('./models/product/detail'))
              cb(null, require('./routes/product/detail/'))
            }, 'product-detail')
          },
        }, {
          path: 'theme',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/theme'))
              cb(null, require('./routes/theme/'))
            }, 'theme')
          }
        }, {
          path: 'category',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/category'))
              cb(null, require('./routes/category/'))
            }, 'category')
          },
        }, {
          path: 'express',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/express'))
              cb(null, require('./routes/express/'))
            }, 'express')
          },
        }, {
          path: 'order',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/express'))
              registerModel(app, require('./models/order'))
              cb(null, require('./routes/order/'))
            }, 'order')
          },
        }, {
          path: 'order/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/order'))
              registerModel(app, require('./models/express'))
              registerModel(app, require('./models/order/detail'))
              cb(null, require('./routes/order/detail'))
            }, 'order-detail')
          }
        }, {
          path: 'user',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user'))
              cb(null, require('./routes/user/'))
            }, 'user')
          },
        }, {
          path: 'user/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              // registerModel(app, require('./models/user/detail'))
              cb(null, require('./routes/unbuild/'))
              // cb(null, require('./routes/user/detail/'))
            }, 'user-detail')
          },
        }, {
          path: 'setting/menu',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/menu'))
              cb(null ,require('./routes/menu'))
            }, 'menu')
          }
        }, {
          path: 'setting/admin',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/admin'))
              registerModel(app, require('./models/role'))
              cb(null, require('./routes/admin'))
            }, 'admin')
          },
        }, {
          path: 'setting/group',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/group'))
              registerModel(app, require('./models/admin'))
              cb(null, require('./routes/group'))
            }, 'group')
          },
        }, {
          path: 'setting/permission/role',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/role'))
              registerModel(app, require('./models/resource'))
              cb(null, require('./routes/permission/role'))
            }, 'permission-role')
          },
        }, {
          path: 'setting/permission/resource',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/resource'))
              cb(null, require('./routes/permission/resource'))
            }, 'permission-resource')
          },
        }, {
          path: 'setting/personal',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/admin'))
              cb(null, require('./routes/personal'))
            },'personal')
          }
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
