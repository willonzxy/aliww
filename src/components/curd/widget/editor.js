import ClassicEditor from '../util/editor/index'
import CKEditor from '@ckeditor/ckeditor5-vue'
import UploadAdapter from '../util/editor/uploadAdapter'

export const widget_desc = {
  name: {value:'editor',label:'富文本编辑器'}
}

export default ({ props, listeners, data }) => {
  const params = {
    on: {
      ...listeners,
      ready: (editor) => {
        editor.plugins.get('FileRepository')
          .createUploadAdapter = (loader) => {
            return new UploadAdapter(loader)
          }
      }
    },
    model: data.model,
    style:data.style,
    staticStyle:data.staticStyle,
    class:data.class,
    staticClass:data.staticClass,
    inheritAttrs:false,
    attrs: {
      editor: ClassicEditor,
      config: {
        placeholder: ''
      },
      disabled: false,
      ...props
    }
  }

  return (<CKEditor.component {...params} />)
}
