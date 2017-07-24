import React from 'react'
import { connect } from 'dva'

const Home = () =>{
	return (
		<div>
			这里是首页
		</div>
	)
}

export default connect()(Home)