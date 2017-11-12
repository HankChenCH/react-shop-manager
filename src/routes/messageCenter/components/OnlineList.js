import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tree } from 'antd'

const TreeNode = Tree.TreeNode;

class OnlineList extends React.Component
{
    constructor(props){
        super(props)
    }

    handleSelect = (key) => {
        console.log(key)
        const { dispatch } = this.props
        dispatch({
            type: 'chat/showChatRoom',
            payload: key[0]
        })
    }

    render() {
        const { members, onlineMembers, onlineCount } = this.props.chat

        const memberOnlineNumber = `成员(${onlineCount}/${members.length})`

        const memberList = members.map(item => {
            const is_online = (onlineMembers.indexOf(item.id) !== -1) ? '在线' : '离线'
            const nodeTitle = `${item.true_name}(${is_online})`
            return (
                <TreeNode title={nodeTitle} key={`member_${item.id}`}></TreeNode>
            )
        })

        return (
            <section className={this.props.className} style={{padding: '0 50px'}}>
                <Tree onSelect={this.handleSelect}>
                    <TreeNode title='群组' key='group' selectable={false}>
                        <TreeNode title='讨论组' key='group_0'></TreeNode>
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