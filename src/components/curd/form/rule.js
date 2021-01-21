export const required = { required: true, message: '必填项', trigger: 'blur' };
export const validEnString = { pattern: /^[0-9a-zA-Z_\-\/]+$/,  message: '只允许输入数字、字母、下划线和-/杠', trigger: 'blur' };
export const numAndEn = { pattern: /^[0-9a-zA-Z]+$/,  message: '只允许输入数字、字母', trigger: 'blur' };

const validReserveVar = (rule, value, cb)  => {
  const reserveVars = [
    'id',
    'operator',
    'createTime',
    'updateTime',
    'publishTime',
    'weight',
    'status',
    'actionLog',
    'actionReview'
  ]
  if (reserveVars.indexOf(value) !== -1) {
    cb('该变量名是保留字，请替换~~')
    return
  }
  cb()
}

export const validVariableName = { validator: validReserveVar, trigger: 'blur' }