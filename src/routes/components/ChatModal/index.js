import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { CommonChatRoom } from '../../../components/Chat'

const ChatModal = ({
  title,
  currentChatKey,
  currentChat,
  currentMessage,
  currentPagination,
  scrollBottom,
  onlineMembers,
  onOk,
  onLoadMore,
  confirmLoading,
  messageLoading,
  ...ChatRoomModalProps
}) => {

  let modalTitle = title
  let key = currentChatKey.split('_')

  if (key[0] === 'member') {
    modalTitle += onlineMembers.indexOf(parseInt(key[1])) !== -1 ? '(在线)' : '(离线)'
  }

  const modalOpts = {
    title: modalTitle,
    width: 780,
    footer: null,
    ...ChatRoomModalProps,
  }

  const chatRoomProps = {
    message: currentMessage,
    pagination: currentPagination,
    onlineCount: key[0] === 'group' ? onlineMembers.length : 0,
    onSend: onOk,
    onLoadMore: onLoadMore,
    scrollBottom,
    confirmLoading,
    messageLoading,
  }

  return (
    <Modal {...modalOpts}>
      <CommonChatRoom {...chatRoomProps}/>
    </Modal>
  )
}

ChatModal.propTypes = {
  onOk: PropTypes.func,
}

export default ChatModal