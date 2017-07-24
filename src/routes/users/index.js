import React from 'react'
import { connect } from 'dva'

const User = () =>{
	return (
		<div>
			这里是用户页
		</div>
	)
}

export default connect()(User)