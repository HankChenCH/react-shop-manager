import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '../../components'
import { BaseInfoForm, DetailInfoForm, ParamsInfoForm } from './components'
import { Form, Input, InputNumber, Modal, Steps, Button, Upload, Icon, message } from 'antd'
import { apiPrefix, api } from '../../utils/config'
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import styles from './Modal.css'

const FormItem = Form.Item
const Step = Steps.Step;
const HtmlEditor = Editor.HtmlEditor
const { productMain, productDetail } = api.image
const uploadMainImageApi = `${apiPrefix}/${productMain}`
const uploadDetailImageApi = `${apiPrefix}/${productDetail}`

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

export default class InfoModal extends React.Component
{
  constructor(props) {
    super(props);
  }

  render() {
    const { onOk, onDetailsOk, onParamsOk, onUploadSuccess, currentStep, onChangeStep, modalType, ...modalProps } = this.props
    const { item } = this.props

    const handleParamsOk = () => {
      const { validateFields, getFieldsValue } = this.refs.infoForm
      validateFields((errors) => {
        if (errors) {
          return
        }
        const formData = {
          ...getFieldsValue(),
        }

        const data = []
        for (let i in formData) {
          if (i === 'params') continue
          data.push(formData[i])
        }

        onParamsOk(data)
      })
    }

    const handleNext = () => {
      const { validateFields, getFieldsValue } = this.refs.infoForm
      validateFields((errors) => {
          if (errors) {
              return
          }
          const data = {
             ...getFieldsValue(),
          }
          
          if (currentStep === 1) {
            //修复偶尔会出现无法转换成html的bug
            if (typeof data.detail === 'object' && !('value' in data.detail)) {
              data.detail = draftToHtml(data.detail)
            }

            if (data.detail.hasOwnProperty('value')) {
              data.detail = data.detail.value
              delete data.detail.value
            }

            onDetailsOk(data)
          } else {
            onOk(data)
          }
      })
    }

    const handlePrev = () => {
        onChangeStep(-1)
    }

    const modalOpts = {
      ...modalProps,
      footer: null
    }

    const steps = [{
      title: '商品信息',
      icon: <Icon type="solution" />
    }, {
      title: '商品详情',
      icon: <Icon type="file-jpg" />
    }, {
      title: '商品参数',
      icon: <Icon type="switcher" />
    }];

    const baseFormProps = {
      item,
      modalType,
      ref: 'infoForm',
      formItemLayout,
      onUploadSuccess,
      onOk
    }

    const detailFormProps = {
      item,
      formItemLayout,
      ref: 'infoForm',
      onDetailsOk,
      onChangeStep
    }

    const paramsFormProps = {
      item,
      formItemLayout,
      formItemLayoutWithOutLabel,
      ref: 'infoForm',
      onOk,
      onChangeStep
    }

    return (
      <Modal width={900} {...modalOpts}>
        <Steps current={currentStep}>
          {steps.map(item => <Step key={item.title} title={item.title} icon={item.icon}/>)}
        </Steps>
          {
            currentStep === 0
            &&
            <BaseInfoForm {...baseFormProps}/>
          }
          {
            currentStep === 1
            &&
            <DetailInfoForm {...detailFormProps}/>
          }
          {
            currentStep === 2
            &&
            <ParamsInfoForm {...paramsFormProps}/>
          }
          {
            currentStep === 0
            &&
            <div className={styles.steps_action}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={handleNext}>保存并下一步</Button>
            </div>
          }
          {
            currentStep === 1
            &&
            <div className={styles.steps_action}>
              <Button style={{ marginLeft: 8 }} onClick={handlePrev}>上一步</Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={handleNext}>保存并下一步</Button>
            </div>
          }
          {
            currentStep === 2
            &&
            <div className={styles.steps_action}>
              <Button style={{ marginLeft: 8 }} onClick={handlePrev}>上一步</Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={handleParamsOk}>完成</Button>
            </div>
          }
    </Modal>
    )
  }
}


InfoModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

