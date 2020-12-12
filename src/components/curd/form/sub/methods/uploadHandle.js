import { processUploadRes } from '../../../normalize'
export async function onUploadSuccess(attr,res) {
    console.log({attr,res})
    res = processUploadRes(res);
    let {
        statusCode,
        uri,
        reduceRatio,
        suffix_name
    } = res;
    try {
        if (statusCode !== 200) {
            return this.$message.error('上传失败')
        }
        this.formInline[attr] = uri;
        (this.getMediaType(suffix_name) === 'pic' && reduceRatio) ? this.$message.success('已上传、并成功压缩' + reduceRatio): this.$message.success('已上传');
    } catch (error) {
        console.log(error)
        this.onUploadError();
    }
}

export async function onArrayImgUploadSuccess(attr,index,res) {
    res = processUploadRes(res);
    let {
        statusCode,
        uri,
        reduceRatio,
        suffix_name
    } = res;
    try {
        if (statusCode !== 200) {
            return this.$message.error('上传失败')
        }
        this.formInline[attr] && this.formInline[attr].splice && this.formInline[attr].splice(index,1,uri);
        (this.getMediaType(suffix_name) === 'pic' && reduceRatio) ? this.$message.success('已上传、并成功压缩' + reduceRatio): this.$message.success('已上传');
    } catch (error) {
        console.log(error)
        this.onUploadError();
    }
}

export function onUploadError() {
    this.$message.error('上传失败')
}

export async function onObjectArrayImgUploadSuccess(attr, index, inner_attr, res) {
    res = processUploadRes(res);
    let {
        statusCode,
        uri,
        reduceRatio,
        suffix_name
    } = res;
    try {
        console.log(attr)
        if (statusCode !== 200) {
            return this.onUploadError();
        }
        this.formInline[attr][index][inner_attr] = uri;
        (this.getMediaType(suffix_name) === 'pic' && reduceRatio) ? this.$message.success('已上传、并成功压缩' + reduceRatio): this.$message.success('已上传');
    } catch (error) {
        console.log(error)
        this.onUploadError();
    }
}

export async function onObjectImgUploadSuccess(attr, inner_attr,res) {
    res = processUploadRes(res);
    let {
        statusCode,
        uri,
        reduceRatio,
        suffix_name
    } = res;
    try {
        if (statusCode !== 200) {
            return this.$message.error('上传失败')
        }
        this.formInline[attr][inner_attr] = uri;
        (this.getMediaType(suffix_name) === 'pic' && reduceRatio) ? this.$message.success('已上传、并成功压缩' + reduceRatio): this.$message.success('已上传');
    } catch (error) {
        console.log(error)
        this.onUploadError()
    }
}

export function beforeArrayImgUpload(attr, index, file_info) {
    let flag = true;
    return flag
}
export function beforeObjectArrayImgUpload(attr, index, inner_attr, file_info) {
    let flag = true;
    return flag;
}
export function beforeObjectImgUpload(attr, inner_attr, file_info) {
    let flag = true;
    return flag
}

export function beforeUpload(attr, file_info) {
    let flag = true;
    return flag
}