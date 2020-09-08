// 自定义组件逻辑 (custom.js)

const app = getApp()
	
Component({
    properties: {
        // 定义了bool属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
		url:{
			type:String,
			value:'/'
		},
		totalPage: {
            type: Number,
            value: 1
        },
        pageSize: {
            type: Number,
            value: 10
        },
        pageNum: {
            type: Number,
            value: 1
        }
    },
	observers:{
		'url':function(url){

			let _that = this.data,
				allPage = Math.ceil((_that.totalPage> 10000 ? 10000 : _that.totalPage) / _that.pageSize),
				upUrl = url+'page='+( _that.pageNum - 1 ),
				downUrl = url+'page='+( _that.pageNum -1 + 2 );
			this.setData({
				allPage,
				downUrl,
				upUrl
			})		
		}
	},
    data: {
		// downUrl:this.data.url,
		// upUrl:'',
		// allPage: Math.ceil((this.data.totalPage> 10000 ? 10000 : this.data.totalPage) / this.data.pageSize)
    },
	ready(){
		
	// 	let _that = this.data,
	// 		allPage = Math.ceil((_that.totalPage> 10000 ? 10000 : _that.totalPage) / _that.pageSize),
	// 		upUrl = _that.url+'page='+( _that.pageNum - 1 ),
	// 		downUrl = _that.url+'page='+( _that.pageNum + 1 );

	// 		console.log('组件',_that.url)

	// 	// this.setData({
	// 	// 	allPage,
	// 	// 	downUrl,
	// 	// 	upUrl
	// 	// })		
		// let timer  = setInterval(()=>{
		// 	console.log('组件2',this.data.url)
		// 	if(this.data.url.length > 5){
		// 	clearInterval(timer);}
		// }, 30);
		
	},
	lifetimes: {
        // ready: function() {
		// 	let timer = setInterval(()=>{
		// 		if()
		// 	},30)
           
		// 	setTimeout(()=>{
		// 		let _that = this.data,
		// 		allPage = Math.ceil((_that.totalPage> 10000 ? 10000 : _that.totalPage) / _that.pageSize),
		// 		upUrl = _that.url+'page='+( _that.pageNum - 1 ),
		// 		downUrl = _that.url+'page='+( _that.pageNum + 1 );
		// 		this.setData({
		// 			allPage,
		// 			downUrl,
		// 			upUrl
		// 		})		
		// 			console.log('组件',_that)
		// 	}, 500);
        // },
	},
    methods: {
		changeURL(o,n){
			console.log('执行了',o,n)
		},
		jumpPage(e){ //展开不同的图层
			let page =  e.currentTarget.dataset.page
			// console.log('层级',type)
			let url = this.data.url 

			if(page != 1){
				url =  this.data.url  + 'page=' + this.data.allPage
			}
			else if(page == 1){
				url = this.data.url.replace(/\&$/,'')
			}

			swan.redirectTo({
				url:url
			});

		},
    }
});