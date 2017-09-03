import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import styles from './Editor.less'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { request } from '../../utils'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html';

export default class HtmlEditor extends React.Component
{
	constructor (props) {
    	super(props)

    	let value = this.props.value
    	if (typeof value === 'string') {
    		const {contentBlocks, entityMap} = htmlToDraft(value);
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            value = EditorState.createWithContent(contentState);
    	}

    	this.state = {
      		value: value || '',
    	}
    }

   //  componentWillReceiveProps(nextProps) {
   //  	if ('value' in nextProps) {
   //  		const value = nextProps.value
   //          // console.log(value)
			// // this.setState({ 
   // //              ...value,
   // //          })
   //  	}
   //  }

    uploadRichTextImage = (image) => {
        const { action, fileName, onUploadError } = this.props
        if (action && fileName) {

            const data = new FormData();
            data.append(fileName, image);

            return fetch(action, {
                method: 'post',
                body: data
            }).then(function(res) {
                return res.json()
            }).then(function(res){
                if(res.hasOwnProperty('errorCode')) throw res
                return { data: { link: res.url } }  
            }).catch((err) => {
                if(res.hasOwnProperty('msg')) onUploadError(err.msg)
                else onUploadError("网络错误")
            })

        } else {
            return new Promise((resolve, reject) => {
                reject("请填写上传文件路径或上传文件名")
            })
        }
    }

    handleContentChange = (content) => {
        const rawContent = convertToRaw(content.getCurrentContent());
        const html = draftToHtml(rawContent)

    	if ('value' in this.props) {
    		this.setState({ 
    			value: content,
    		})
        }

    	this.triggerChange({ 
			value: html,
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
		    		editorState={this.state.value}
		    		onEditorStateChange={this.handleContentChange}
		    		toolbarClassName={styles.toolbar} 
		    		wrapperClassName={styles.wrapper} 
		    		editorClassName={styles.editor} 
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        link: { inDropdown: true },
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