export function attrValueChange(attr,val){
    this.$emit('change',attr,val)
}
export function attrSelectChange(attr,val){
    this.$emit('select',attr,val)
}
export function attrObjectValueChange(attr,inner_attr,val){
    this.$emit('object-change',attr,inner_attr,val)
}
export function attrArrayValueChange(attr,index,val){
    this.$emit('array-change',attr,index,val)
}
export function attrObjectArrayValueChange(attr,index,inner_attr,val){
    this.$emit('object-array-change',attr,index,inner_attr,val)
}