// 自定义组件逻辑 (custom.js)
import codeJson from '../../until/code.json'
let codeArr = ['全部类型']
	for(let i of codeJson){
		codeArr.push(i.name)
	}
const app = getApp()
	
Component({
    properties: {
        // 定义了bool属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
        show: {
            type: Boolean,
            value: false,
		},
		likeTagsArr: {
            type: Array,
            value: [],
		},
		allTags: {
            type: Array,
            value: [],
		},
		obj:{
			type:Object,
			value:{}
		}
    },
    data: {
		codeJson:codeArr,
		arrIndex:0,
		option:{},
		params:{
			sbm:'',
			sqh:'',
			ann:'',
			type:"",
			sqr:'',
			dljg:""
		}
    },
	attached(){
		
		this.setData({
            statusBarHeight: app.$systemInfo.statusBarHeight,// 顶部状态栏高度，单位px
            navigationBarHeight: app.$systemInfo.navigationBarHeight,// 顶部导航栏高度，单位px
            blockHeight: app.$systemInfo.statusBarHeight + app.$systemInfo.navigationBarHeight  //全部高度
		});
	
	},
	observers:{
		'obj':function(obj){
			this.setData({
				option:obj
			})		
		}
	},
    methods: {
        onShow(){

		},
		selectorChange(e) {
			this.setData('arrIndex', e.detail.value);
		},
		cancel() {
			// swan.showToast({
			// 	title: '用户取消选择',
			// 	icon: 'none'
			// });
		},
		resetFrom(){
			this.setData({
				option:{}
			})
		},
		//选中
		selectOption(e){
			// console.log(111,e)
			let key = e.currentTarget.dataset.key,
				val = e.currentTarget.dataset.val;
			this.setData(`option.${key}`,val)
			if(key == 't'){
				this.setData(`option.t2`,'')
				this.setData(`option.t3`,'')
			}
		},
		selectOption2(e){
			this.setData(`option.t2`,e.currentTarget.dataset.val2)
			this.setData(`option.t3`,e.currentTarget.dataset.val3 || '')

			// console.log( this.data.option)
		},
		bindinputFunc(e){
			let key = e.target.dataset.key
			this.setData(
				`option.${key}`,e.detail.value,
			)
		},
		// bindinputFunc(e){
		// 	let obj = this.data.params
		// 		obj[e.target.dataset.key] = e.detail.value
		// 	this.setData(obj)
		// },
		goSearch(){
			let params = this.data.option
			let bool = true
			for(let k in params){
				if(params[k]){
					bool = false
				}
			}
			if(bool){
				swan.showToast({
					title: '请输入搜索关键字',
					icon: 'none',
					duration: 1000,
				});
				return;
			}

			// console.log(111,params)	
	
			let urlStr = '/pages/list/index?'
	
				if(!bool){
					for(let k in params){
						if(params[k])
							urlStr+=(k + '=' + params[k] +'&')
					}
				}
				// console.log(222,urlStr)	
				 
			swan.navigateTo({
                url: urlStr
            });	
		},
		closeDraw(){
			// var myEventDetail = {} // detail对象，提供给事件监听函数
            // var myEventOption = {bubbles:true} // 触发事件的选项
            this.triggerEvent('myevent');
		}
    }
});