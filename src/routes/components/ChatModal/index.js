import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { CommonChatRoom } from '../../../components/Chat'

const ChatModal = ({
  currentMessage,
  onOk,
  ...ChatRoomModalProps
}) => {

  const modalOpts = {
    ...ChatRoomModalProps,
    width: 780,
    footer: null,
  }

  return (
    <Modal {...modalOpts}>
      <CommonChatRoom message={currentMessage} onSend={onOk}/>
    </Modal>
  )
}

ChatModal.propTypes = {
  onOk: PropTypes.func,
}

export default ChatModal