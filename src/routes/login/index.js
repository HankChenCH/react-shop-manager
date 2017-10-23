import React from 'react'
import PropTypes from 'prop-types'
import 'particles.js/particles';
import { connect } from 'dva'
import { Button, Row, Col, Avatar, Form, Input, Icon } from 'antd'
import { config, particlesConfig, Enum } from '../../utils'
import styles from './index.less'

const FormItem = Form.Item
const { EnumAdminStatus } = Enum
const particlesJS = window.particlesJS;

class Login extends React.Component
{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    particlesJS("particles-js", particlesConfig);
  }

  render(){
    const { dispatch } = this.props
    const { user } = this.props.app
    const { loginLoading } = this.props.login
    const { getFieldDecorator,validateFieldsAndScroll } = this.props.form
    const isLock = (user.status && user.status === EnumAdminStatus.LOCKED)
    
    const handleOk = () => {
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return
        }
        if (isLock) {
          dispatch({ type: 'login/login', payload: { login_name: user.login_name, ...values } })
        } else {
          dispatch({ type: 'login/login', payload: values })
        }
      })
    }

    const handleOther = () => {
      dispatch({ type: 'app/clearUser' })
    }

    return (
      <div id="particles-js" className={styles.particles}>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt={'logo'} src={config.logo} />
            <span>{config.name}</span>
          </div>
            { isLock ?
              <FormItem hasFeedback>
                <Row gutter={8}>
                  <Col span={6} offset={6}>
                    <Avatar shape="square" style={{ backgroundColor: '#292929', verticalAlign: 'middle', margin: '0 10px' }} icon="user" alt='用户头像'/>
                  </Col>
                  <Col span={12}>
                    {user.username}
                  </Col>
                </Row>
              </FormItem> 
              : 
              <FormItem hasFeedback>
                {getFieldDecorator('login_name', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" prefix={<Icon type='user'/>}/>)}
              </FormItem>
            }
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" prefix={<Icon type='lock'/>}/>)}
            </FormItem>
            <Row>
              <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
                登  录
              </Button>
            </Row>
            {isLock &&
              <Row style={{ marginTop: 10 }}>
                <Button size="large" onClick={handleOther}>
                  使用其他账号登录
                </Button>
              </Row>
            }
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ app, login }) => ({ app, login }))(Form.create()(Login))
