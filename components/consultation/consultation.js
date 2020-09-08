// 自定义组件逻辑 (custom.js)
Component({
    properties: {
        // 定义了name属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
        bool: {
            type: Boolean,
            value: true,
        }
    },
    data: {
        age: 1
    },
    methods: {
        takeTel(){
            swan.makePhoneCall({
                phoneNumber:'028-8511-1005',
                fail: err => {
                    swan.showModal({
                        title: '拨打失败',
                        content: '网络连接失败，稍后再试',
                        showCancel: false
                    });
                }
            });
        },
        contactCB(e) {
            // console.log(e.detail); // 输出：{errMsg: 'enterContact:ok'}
            // 进入客服会话页面成功，可进行自己的业务逻辑
            if (e.detail.errMsg === 'enterContact:ok') {
                swan.reportAnalytics('userMessage', {
                    visit: 1,
                    message: '进入客服页面PV'
                });
            }
            // 可进行一些进入失败的业务逻辑
            else {
                swan.reportAnalytics('userMessage', {
                    visit: 0,
                    message: '进入客服页面失败损失PV'
                });
            }
        },
    }
});