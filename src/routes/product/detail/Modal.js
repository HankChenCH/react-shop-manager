import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '../../../components'
import { BaseInfoForm, DetailInfoForm, ParamsInfoForm, BuyNowForm } from '../components'
import { Form, Input, InputNumber, Modal, Button, Upload, Icon, message } from 'antd'
import { apiPrefix, api } from '../../../utils/config'
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import styles from '../Modal.css'

const FormItem = Form.Item
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
    super(props)
  }

  render() {
    const { onOk, onCancel, onUploadSuccess, modalType, formItemLayout, formItemLayoutWithOutLabel, ...modalProps } = this.props
    const { item } = this.props

    const handleOk = () => {
      const { validateFields, getFieldsValue } = this.refs.infoForm
      validateFields((errors) => {
          if (errors) {
              return
          }
          const data = {
             ...getFieldsValue(),
          }
          
          if (modalType === 'detail') {
            //修复偶尔会出现无法转换成html的bug
            if (typeof data.detail === 'object' && !('value' in data.detail)) {
              data.detail = draftToHtml(data.detail)
            }

            if (data.detail.hasOwnProperty('value')) {
              data.detail = data.detail.value
              delete data.detail.value
            }

          } else if(modalType === 'params') {
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
      
            })
          } else if(modalType === 'buyNow') {

            if (typeof data.rules === 'object' && !('value' in data.rules)) {
              data.rules = draftToHtml(data.rules)
            }

            if (data.rules.hasOwnProperty('value')) {
              data.rules = data.rules.value
              delete data.rules.value
            }
          }
          
          onOk(data)          
      })
    }

    const handleCancel = () => {
        onCancel()
    }

    const modalOpts = {
      ...modalProps,
      onCancel,
      footer: null
    }

    const baseFormProps = {
      item,
      modalType,
      ref: 'infoForm',
      formItemLayout,
      onUploadSuccess,
      onOk,
    }

    const detailFormProps = {
      item,
      formItemLayout,
      ref: 'infoForm',
      onOk,
    }

    const paramsFormProps = {
      item,
      formItemLayout,
      formItemLayoutWithOutLabel,
      ref: 'infoForm',
      onOk,
    }

    const buynowFormProps = {
      item,
      formItemLayout,
      formItemLayoutWithOutLabel,
      ref: 'infoForm',
      onOk,
    }

    return (
      <Modal width={900} {...modalOpts}>
        {
          modalType === 'base'
          &&
          <BaseInfoForm {...baseFormProps}/>
        }
        {
          modalType === 'detail'
          &&
          <DetailInfoForm {...detailFormProps}/>
        }
        {
          modalType === 'params'
          &&
          <ParamsInfoForm {...paramsFormProps}/>
        }
        {
          modalType === 'buyNow'
          &&
          <BuyNowForm {...buynowFormProps}/>
        }
        <div className={styles.steps_action}>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>取消</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={handleOk}>确定</Button>
        </div>
    </Modal>
    )
  }
}


InfoModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

