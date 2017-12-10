import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tree } from 'antd'
import { Enum } from '../../../utils'

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
        const { members, groups, onlineMembers, onlineCount } = this.props.chat

        const memberOnlineNumber = `成员(${onlineCount}/${members.length})`
        const groupNumber = `群组(${groups.length})`

        const memberList = members.map(item => {
            const is_online = (onlineMembers.indexOf(item.id) !== -1) ? '在线' : '离线'
            const nodeTitle = `${item.true_name}(${is_online})`
            return (
                <TreeNode title={nodeTitle} key={`${EnumChatType.Member}_${item.id}`} />
            )
        })

        const groupList = groups.map(item => {
            return (
                <TreeNode title={item.name} key={`${EnumChatType.Group}_${item.id}`} />
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