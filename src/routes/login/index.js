import React from 'react'
import PropTypes from 'prop-types'
import 'particles.js/particles';
import { connect } from 'dva'
import { Button, Row, Col, Avatar, Form, Input, Icon } from 'antd'
import { config, particlesConfig, Enum, classnames } from '../../utils'
import styles from './index.less'

const FormItem = Form.Item
const { EnumAdminStatus } = Enum
const particlesJS = window.particlesJS;

class Login extends React.Component
{
  constructor(props){
    super(props)
    const { user } = this.props.app

    this.state = {
      showPassword: !(user.status && user.status === EnumAdminStatus.LOCKED),
      isLock: (user.status && user.status === EnumAdminStatus.LOCKED)
    }
  }

  componentDidMount(){
    particlesJS("particles-js", particlesConfig);
  }

  render(){
    const { dispatch } = this.props
    const { user } = this.props.app
    const { loginLoading } = this.props.login
    const { getFieldDecorator,validateFieldsAndScroll } = this.props.form
    
    const handleOk = () => {
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return
        }
        
        dispatch({ 
          type: 'login/login', 
          payload: this.state.isLock ? { login_name: user.login_name, ...values } : values 
        })
      })
    }

    const handleOther = () => {
      this.setState({
        isLock: false,
        showPassword: true,
      })
    }

    const handleChangePasswordInput = () => {
      this.setState({
        showPassword: !this.state.showPassword
      })
    }

    return (
      <div id="particles-js" className={styles.particles}>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt={'logo'} src={config.logo} />
            <span>{config.name}</span>
          </div>
            { this.state.isLock ?
              <FormItem hasFeedback>
                <Row gutter={8} onClick={handleChangePasswordInput} style={{ cursor: 'pointer' }}>
                  <Col span={6} offset={6}>
                    <Avatar size="large" shape="square" style={{ backgroundColor: '#292929', verticalAlign: 'middle' }} icon="user" alt='用户头像'/>
                  </Col>
                  <Col span={12}>
                    <span style={{ fontSize: 18 }}>{user.username}</span>
                  </Col>
                </Row>
              </FormItem> 
              : 
              <FormItem hasFeedback>
                {getFieldDecorator('login_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入登录账号'
                    },
                  ],
                })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" prefix={<Icon type='user'/>}/>)}
              </FormItem>
            }
            {this.state.showPassword &&
              <div className={classnames(styles.password, { [styles.passwordShow]: this.state.showPassword })}>
                <FormItem hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" prefix={<Icon type='lock'/>}/>)}
                </FormItem>
              </div>
            }
            <Row>
              <Button type="primary" size="large" onClick={handleOk} loading={loginLoading} disabled={!this.state.showPassword}>
                登  录
              </Button>
            </Row>
            {this.state.isLock &&
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
