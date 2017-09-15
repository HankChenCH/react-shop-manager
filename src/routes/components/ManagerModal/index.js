import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Transfer } from 'antd'
import styles from './ManagerModal.css'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const managerModal = ({
  productAll,
  currentProductKeyList,
  onOk,
  onChangeProductItem,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...managerModalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    onChangeProductItem(nextTargetKeys)
  }

  const modalOpts = {
    ...managerModalProps,
    onOk: handleOk,
    width: 780,
  }

  const renderItem = (item) => {
    const customLabel = (
      <span className={styles.transfer_item}>
        <img className={styles.transfer_item_img} src={item.main_img_url}/>
        {item.title}
      </span>
    );

    return {
      label: customLabel,  // for displayed item
      value: item.title,   // for title and filter matching
    };
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="vertical">
      	<FormItem label="选择商品" hasFeedback {...formItemLayout}>
          {getFieldDecorator('product_id', {
            initialValue: currentProductKeyList.join(',')
          })(<Input type='hidden'/>)}
          <Transfer
  	        dataSource={productAll}
            showSearch
  	        titles={['来源', '已选']}
  	        targetKeys={currentProductKeyList}
  	        onChange={handleChange}
  	        render={renderItem}
	        />
        </FormItem>
      </Form>
    </Modal>
  )
}

managerModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(managerModal)