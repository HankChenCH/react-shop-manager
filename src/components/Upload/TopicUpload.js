import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon } from 'antd'
import styles from './MainUpload.css'

export default class TopicUpload extends React.Component
{
	constructor(props) {
		super(props);
		const { value } = this.props
		this.state = {
			img_id: value.img_id || 0,
			img_url: value.img_url || null,
		}
	}

	handleUploadMainImageChange = (info) => {
    const { response } = info.file
    if (info.file.status === 'done') {
      this.setState({
      	img_id: response.id,
      	img_url: response.url,
      })

      this.triggerChange({ 
	      img_id: response.id,
        img_url: response.url,
      })
    } else if(info.file.status === 'error') {
      const { onError } = this.props
      if (typeof onError === 'function'){
        onError({
          msg: response.msg
        })
      }
    }
  }

  triggerChange = (changedValue) => {
  	const onChange = this.props.onChange
  	if (onChange) {
  		onChange(Object.assign({}, this.state, changedValue))
  	}
  }

	render() {
		const { img_url } = this.state
    const { name, action } = this.props
		return (
			<Upload
        className={styles.img_uploader}
        name={name}
        showUploadList={false}
        action={action}
        onChange={this.handleUploadMainImageChange}
      >
        {
      		img_url ?
          <img src={img_url} alt="" className={styles.img} /> : 
          <Icon type="plus" className={styles.img_uploader_trigger} />
        }
      </Upload>
		)
	}
}

TopicUpload.propsTypes = {
	name: PropTypes.string.isRequired,
	action: PropTypes.string.isRequired,
}