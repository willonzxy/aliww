import { deep_clone } from '../../util/index'
export async function submit(verify = true){
    let result = {};
    async function  _post(){
        let data = deep_clone(this.formInline);
        for(let attr in data){
            if(this.beforeSubmit[attr]){
                data[attr] = await this.beforeSubmit[attr].call(this,data[attr],data)
            }
        }
        data = JSON.parse(JSON.stringify(data))
        this.$emit('submit',data)
        result = data;
    }
    verify ? this.$refs[this.config.title].validate(async (valid) => {
        if (valid) {
           await _post.call(this)
        } else {
            this.$message.error('表单校验失败')
            throw Error(this.config.title + '表单校验失败')
        }
    }) : await _post.call(this)
    return result
}