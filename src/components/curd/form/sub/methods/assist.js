/** 
 *  映射出data字段中的配置
 */
export function mapAttrContent(source, key, content = 'label') {
    // console.log({source,key,content})
    let data = (!!source && Array.isArray(source) && source.length > 0) ? source.filter(i => i.value === key || i.attr === key)[0][content] : '';
    if (!data && (content === 'type')) {
        data = 'input'
    }
    return data;
}

export function getMediaType(str){
    let index = 0;
    if( /\.mp4$/.test(str) ){
        index = 1;
    }
    if( /\.(mp3|wav)$/.test(str) ){
        index = 2;
    }
    if( /\.(woff|ttf)$/.test(str) ){
        index = 3;
    }
    return ['pic','video','audio'][index];
}