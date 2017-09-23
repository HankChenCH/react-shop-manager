import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon } from 'antd'
import styles from './MainUpload.css'

export default class ProductMainUpload extends React.Component
{
	constructor(props) {
		super(props);
		const { value } = this.props
		this.state = {
			img_id: value.img_id,
			main_img_url: value.main_img_url,
      from: value.from || 1
		}
	}

	handleUploadMainImageChange = (info) => {
    const { response } = info.file
    if (info.file.status === 'done') {
      this.setState({
      	img_id: response.id,
      	main_img_url: response.url,
        from: response.from
      })

      this.triggerChange({ 
	      img_id: response.id,
        main_img_url: response.url,
        from: response.from
      })
    } else if(info.file.status === 'error') {
      throw {
        success: false,
        message: response.msg
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
		const { main_img_url } = this.state
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
      		main_img_url ?
          <img src={main_img_url} alt="" className={styles.img} /> : 
          <Icon type="plus" className={styles.img_uploader_trigger} />
        }
      </Upload>
		)
	}
}

ProductMainUpload.propsTypes = {
	name: PropTypes.string.isRequired,
	action: PropTypes.string.isRequired,
}