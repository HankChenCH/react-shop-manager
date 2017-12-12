import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tree, Badge } from 'antd'
import { Enum, hasProp } from '../../../utils'

const TreeNode = Tree.TreeNode
const { EnumChatType } = Enum

class OnlineList extends React.Component
{
    constructor(props){
        super(props)
    }

    handleSelect = (key) => {
        const { dispatch } = this.props
        dispatch({
            type: 'chat/showChatRoom',
            payload: key[0]
        })
    }

    render() {
        const { members, groups, onlineMembers, onlineCount, chatMessageNewCount } = this.props.chat

        const memberOnlineNumber = `成员(${onlineCount}/${members.length})`
        const groupNumber = `群组(${groups.length})`

        const memberList = members.map(item => {
            const is_online = (onlineMembers.indexOf(item.id) !== -1) ? '在线' : '离线'
            const key = `${EnumChatType.Member}_${item.id}`
            const nodeTitle = <Badge key={`badge-${item.id}`} count={chatMessageNewCount[key] || 0}>{item.true_name}({is_online})</Badge>
            return (
                <TreeNode title={nodeTitle} key={key} />
            )
        })

        const groupList = groups.map(item => {
            const key = `${EnumChatType.Group}_${item.id}`
            const nodeTitle = <Badge key={`badge-${item.id}`} count={chatMessageNewCount[key] || 0}>{item.name}</Badge>
            return (
                <TreeNode title={item.name} key={key} />
            )
        })

        return (
            <section className={this.props.className} style={{padding: '0 50px'}}>
                <Tree onSelect={this.handleSelect}>
                    <TreeNode title={groupNumber} key='group' selectable={false}>
                        {groupList}
                    </TreeNode>
                    <TreeNode title={memberOnlineNumber} key='member' selectable={false}>
                        {memberList}
                    </TreeNode>
                </Tree>
            </section>
        )
    }
}

OnlineList.proptypes = {

}

export default connect(({ chat }) => ({ chat }))(OnlineList)