export default {
    methods: {
        // 剔除函数式字段 有注入xss风险 但是好用
        getPlainJsonObjectFromInvalidString(val){
            // 切断一下引用 防止内存泄漏
            try {
                if(this.symbol){
                    delete window[this.symbol];
                }
                let symbol = 'curd_page_config_'+(~~((Math.random() + 1) * 1e6));
                this.symbol = symbol;
                // let script = document.createElement('script');
                let tpl = `window[${JSON.stringify(symbol)}] = ${val}`;
                eval(tpl)
                // script.innerHTML = tpl;
                // document.body.appendChild(script)
                // document.body.removeChild(script)
                val = window[symbol]
            } catch (error) {
                console.log(error)
            }
            return val
        }
    },
}