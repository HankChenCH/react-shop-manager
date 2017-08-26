import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import styles from './Editor.less'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { request } from '../../utils'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'

export default class HtmlEditor extends React.Component
{
	constructor (props) {
    	super(props)

    	var value = this.props.value
    	if (typeof value === 'string') {
    		const {contentBlocks, entityMap} = htmlToDraft(value);
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            value = EditorState.createWithContent(contentState);
    	}
    	
    	this.state = {
      		editorContent: value || null,
    	}
    }

    componentWillReceiveProps(nextProps) {
    	if ('value' in nextProps) {
    		const value = nextProps.value
			this.setState(value)
    	}
    }

    uploadRichTextImage = (image) => {
        const { action, fileName, onUploadError } = this.props
        if (action && fileName) {

            const data = new FormData();
            data.append(fileName, image);

            return fetch(action, {
                method: 'post',
                body: data
            }).then(function(res) {
                if (!res.ok) throw res
                return res.json()
            }).then(function(res){
                return { data: { link: res.url } }  
            }).catch((err) => {
                const { response } = err
                let msg
                let status
                let otherData = {}
                if (response) {
                  const { data, statusText } = response
                  otherData = data
                  status = response.status
                  msg = data.msg || statusText
                } else {
                  status = 600
                  msg = 'Network Error'
                }

                onUploadError(msg)
            })

        } else {
            return new Promise((resolve, reject) => {
                console.error("请填写上传文件路径或上传文件名")
                reject("请填写上传文件路径或上传文件名")
            })
        }
    }

    handleContentChange = (content) => {
    	if (!('value' in this.props)) {
    		this.setState({ 
    			editorContent: content,
    		})
    	}

    	this.triggerChange({ 
			editorContent: content,
		})
    }

    triggerChange = (changedValue) => {
    	const onChange = this.props.onChange
    	if (onChange) {
    		onChange(Object.assign({}, this.state, changedValue))
    	}
    }

    render() {
    	return  <Editor 
		    		editorState={this.state.editorContent}
		    		onEditorStateChange={this.handleContentChange}
		    		toolbarClassName={styles.toolbar} 
		    		wrapperClassName={styles.wrapper} 
		    		editorClassName={styles.editor} 
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { 
                            urlEnabled: false, 
                            uploadEnabled: true, 
                            uploadCallback: this.uploadRichTextImage
                        },
                    }}
		    		{...this.props} 
		    	/>
    }
}