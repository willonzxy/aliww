import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

/* 逻辑功能 */
// 核心功能
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
// 格式相关
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
// 段落
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
// 粘贴功能
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
// 文本转换
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
// 上传文件相关
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder'
// 图片相关
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage'
import ImageResizeEditing from '@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting'
import ImageResizeHandles from '@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles'

/* 在编辑器顶部有按钮的功能 */
// 自定义服务器上传
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter'
// 缩进
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
// 多媒体文件
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
// 标题
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
// 字体颜色
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor'
// 字体背景颜色
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor'
// 字体大小
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize'
// 字体种类
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily'
// 粗体
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
// 斜体
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
// 下划线
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
// 中划线
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
// 上角标
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript'
// 下角标
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript'
// 代码
import Code from '@ckeditor/ckeditor5-basic-styles/src/code'

// 超文本
import Link from '@ckeditor/ckeditor5-link/src/link'
// 列表
import List from '@ckeditor/ckeditor5-list/src/list'
// 引用文章
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
// 高亮
import HighLight from '@ckeditor/ckeditor5-highlight/src/highlight'

// 对齐
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
// 自动保存
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave'
// 分割线
import Horizontalline from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
// 分页符
import Pagebreak from '@ckeditor/ckeditor5-page-break/src/pagebreak'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'

import defaultConfig from './defaultConfig'

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
  // 如果没有别的特殊设计，这里就是把上面引入的功能插件全部传进去
  Essentials,
  Autoformat,
  UploadAdapter,
  List,
  BlockQuote,
  Paragraph,
  PasteFromOffice,
  TextTransformation,
  CKFinder,
  SimpleUploadAdapter,
  Indent,
  MediaEmbed,
  Heading,
  FontColor,
  FontBackgroundColor,
  FontSize,
  Image,
  // ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResize,
  LinkImage,
  ImageResizeEditing,
  ImageResizeHandles,
  // FontFamily,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  Link,
  HighLight,
  Alignment,
  Autosave,
  Horizontalline,
  Pagebreak,
  Table,
  TableToolbar,
  TableCellProperties,
  TableProperties
]

ClassicEditor.defaultConfig = defaultConfig
