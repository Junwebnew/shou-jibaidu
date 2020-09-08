
const app = getApp()

Component({
    properties: {
        // 定义了bool属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
        show: {
            type: Boolean,
            value: true,
        }
    },
    data: {
		titleSize: 16,
    },
	attached(){
		// console.log(222,getCurrentPages())
		this.setData({
            statusBarHeight: app.$systemInfo.statusBarHeight,// 顶部状态栏高度，单位px
            navigationBarHeight: app.$systemInfo.navigationBarHeight,// 顶部导航栏高度，单位px
            blockHeight: app.$systemInfo.statusBarHeight + app.$systemInfo.navigationBarHeight,  //全部高度
			isShowBack:getCurrentPages().length > 1
        });
	},
    methods: {
		onHomeBtnTap(){
			swan.switchTab({
				url: '/pages/index/index'
			});
		},
		onBackBtnTap(){
			swan.navigateBack();
		}
    }
});