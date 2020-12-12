import { apiUpload } from "@/api/sys.pageconfig"

export default class UploadAdapter {
  
  constructor (loader) {
    this.loader = loader
  }

  async upload () {
    let param = new FormData()
    param.append('file', await this.loader.file)

    return new Promise(async (resolve, reject) => {
      const url = await apiUpload(param).catch(e => reject(e))
      resolve({default: url})
    })
  }

}
