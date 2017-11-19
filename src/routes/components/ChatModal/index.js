import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { CommonChatRoom } from '../../../components/Chat'

const ChatModal = ({
  title,
  currentChatKey,
  currentChat,
  currentMessage,
  onlineMembers,
  onOk,
  ...ChatRoomModalProps
}) => {

  let modalTitle = title
  let key = currentChatKey.split('_')

  if (key[0] === 'member') {
    modalTitle += onlineMembers.indexOf(parseInt(key[1])) !== -1 ? '(在线)' : '(离线)'
  }

  const modalOpts = {
    ...ChatRoomModalProps,
    title: modalTitle,
    width: 780,
    footer: null,
  }

  return (
    <Modal {...modalOpts}>
      <CommonChatRoom message={currentMessage} onlineCount={key[0] === 'group' ? onlineMembers.length : 0} onSend={onOk}/>
    </Modal>
  )
}

ChatModal.propTypes = {
  onOk: PropTypes.func,
}

export default ChatModal