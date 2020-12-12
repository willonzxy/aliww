import colors from './colors'

const fontSize = {
  options: [
    8,
    9,
    10,
    11,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    36,
    48
  ]
}

// 加入 highlight 套件的設定
const highlight = {
  options: [{
      model: 'yellowMarker',
      class: 'marker-yellow',
      title: 'Yellow Marker',
      color: 'var(--ck-highlight-marker-yellow)',
      type: 'marker'
    },
    {
      model: 'greenMarker',
      class: 'marker-green',
      title: 'Green marker',
      color: 'var(--ck-highlight-marker-green)',
      type: 'marker'
    },
    {
      model: 'pinkMarker',
      class: 'marker-pink',
      title: 'Pink marker',
      color: 'var(--ck-highlight-marker-pink)',
      type: 'marker'
    },
    {
      model: 'blueMarker',
      class: 'marker-blue',
      title: 'Blue marker',
      color: 'var(--ck-highlight-marker-blue)',
      type: 'marker'
    },
    {
      model: 'redPen',
      class: 'pen-red',
      title: 'Red pen',
      color: 'var(--ck-highlight-pen-red)',
      type: 'pen'
    },
    {
      model: 'greenPen',
      class: 'pen-green',
      title: 'Green pen',
      color: 'var(--ck-highlight-pen-green)',
      type: 'pen'
    }
  ]
}

const heading = {
  options: [
    {
      model: 'paragraph',
      title: '段落',
      class: 'ck-heading_paragraph'
    },
    {
      model: 'heading1',
      view: 'h1',
      title: '标题1',
      class: 'ck-heading_heading1'
    },
    {
      model: 'heading2',
      view: 'h2',
      title: '标题2',
      class: 'ck-heading_heading2'
    },
    {
      model: 'heading3',
      view: 'h3',
      title: '标题3',
      class: 'ck-heading_heading3'
    },
    {
      model: 'heading4',
      view: 'h4',
      title: '标题4',
      class: 'ck-heading_heading4'
    },
    {
      model: 'heading5',
      view: 'h5',
      title: '标题5',
      class: 'ck-heading_heading5'
    },
    {
      model: 'heading6',
      view: 'h6',
      title: '标题6',
      class: 'ck-heading_heading6'
    }
  ]
}

// 编辑器菜单栏中的按钮项
const toolbar = {
  items: [
    'heading',
    '|',
    'fontsize',
    'fontColor',
    'fontBackgroundColor',
    'Highlight',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'subscript',
    'superscript',
    'code',
    '|',
    'bulletedList',
    'numberedList',
    'indent',
    'outdent',
    '|',
    'alignment',
    'link',
    'blockQuote',
    'horizontalline',
    '|',
    'imageUpload',
    'mediaEmbed',
    'insertTable',
    '|',
    'pagebreak',
    '|',
    'undo',
    'redo'
  ],
  shouldNotGroupWhenFull: true
}
// 图片的配置
const image = {
  toolbar: [
    'imageStyle:alignLeft',
    'imageStyle:alignCenter',
    'imageStyle:alignRight',
    '|',
    'imageResize',
    '|',
    'imageTextAlternative',
    '|',
    'linkImage'
  ],
  styles: [
    'alignLeft', 'alignCenter', 'alignRight'
  ],
  resizeUnit: 'px',
  resizeOptions: [
    {
      name: 'imageResize:original',
      label: '原图',
      value: null
    },
    {
      name: 'imageResize:10',
      label: '10%',
      value: '75'
    },
    {
      name: 'imageResize:25',
      label: '25%',
      value: '25'
    },
    {
      name: 'imageResize:50',
      label: '50%',
      value: '50'
    },
    {
      name: 'imageResize:75',
      label: '75%',
      value: '75'
    },
    {
      name: 'imageResize:90',
      label: '90%',
      value: '90'
    }
  ]
}

// 表格配置
const table = {
  contentToolbar: [
    'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
  ],
  tableCellProperties: {
    borderColors: colors,
    backgroundColors: colors
  },
  tableProperties: {
    borderColors: colors,
    backgroundColors: colors
  },
  tableToolbar: [
    'blockQuote'
  ]
}

const fontColor = {
  columns: 9,
  colors: colors
}

const fontBackgroundColor = {
  columns: 9,
  colors: colors
}

export default {
  fontSize,
  fontColor,
  fontBackgroundColor,
  highlight,
  heading,
  toolbar,
  image,
  table,
  // 这个language需要与webpack中配置的language保持一致
  language: 'zh-cn'
}
