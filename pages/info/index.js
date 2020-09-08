/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
		stepsArr:['选择商品','签订合同','办理公证','办理手续','商标核对','转让完成'],
		showInfo:false,
		json:{},
		sellJson:{},
		tmName:'',
		nearArr:[],
		jingpinArr:[],
		pageNo:1,
		modeShow:false,
		keyword:''
    },
    onLoad(option) {
		//缓存有 storage
		this.initPage( option.id)
    },
	onShow(){
		this.initSeo()
	},
	initPage(id){
		id = id || '739217215407529984'
		app.$axios('api-trans/trademark/transaction/info/front/load?id='+id)
			.then(res =>{

				let json = res.data.trademarkDetail

				let tmName =  json.trademarkName == '图形' ? ('图形'+json.trademarkNumber) : (json.trademarkName || json.trademarkNumber)

				this.setData({
					json,
					sellJson:res.data.transactionDetail,
					tmName
				})
				this.initSeo()
				this.initOther(res.data.transactionDetail,tmName)
				this.getAsideTm()
			})
	},
	initOther(sellJson,tmName){
		
		Promise.all([
			app.$axios(encodeURI(`api-trans/trademark/transaction/es/front/nearTrademark?id=${sellJson.id}&trademarkName=${tmName}&pageSize=8`))
		]).then(res =>{
			this.setData({
				nearArr:res[0].data || []
			})
		})
	},
	showMoreFunc(e){

		let key = e.currentTarget.dataset.key
		this.setData(
			key, !this.data[key]
		)
	},
	getAsideTm(){
		let num = this.data.pageNo + 1

		let requireObj ={
			"pageNo": num-1,
			"pageSize": 8,
			'status':1,
			'trademarkLike':2,
			'firstNum':this.data.sellJson.firstNum
		}
		app.$axios({url:'api-trans/trademark/transaction/es/front/queryPageList',data:requireObj})
			.then( res =>{
				this.setData({
					jingpinArr : res.data.data,
					pageNo :  num >= Math.ceil(res.data.total/8) ? 0 : num
				})
			
			})
			.catch( res =>{
				return []
			})
	},
	bindinputFunc(e){
        this.setData({
            keyword:e.detail.value,
        })
	},
	leaveMessage(){
		// console.log('9999999999999999999')
		let key = this.data.keyword

		if (!/^1(3|4|5|7|8|9)\d{9}$/.test(key)) {
			swan.showToast({
                title: '请填写正确电话号码',
                icon: 'none',
                duration: 1000,
            });
			return;
		}

		let json = this.data.json
		let msg ='咨询商标名：'+json.trademarkName+'，注册号:'+json.trademarkNumber+'第'+json.typeOfTrademarkCode+'类'

		let obj= {
			'messagePerson':key,
			'messagePersonContent':msg,
			'messagePersonTel':key,
			'messageType':3
		}
		app.$axios({url:'api-trans/trademark/transaction/message/insert',data:obj})
		.then(res =>{   
			if(res.code == 200){
				swan.showToast({
					title: '提交成功!',
					icon: 'success',
					duration: 1000,
				});
				
				this.setData('modeShow',false)
				
			}
		})
		.catch(res=>{
		})
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
    initSeo(){

		let name = this.data.tmName
        let typeOfTrademarkCode = this.data.json.typeOfTrademarkCode,
			typeOfTrademarkName = this.data.json.typeOfTrademarkName;

			// console.log('88',app.$getImg(this.data.sellJson.trademarkPicId,1))
			
        swan.setPageInfo({
            title:`${name}商标转让-${name}第${typeOfTrademarkCode}类[${typeOfTrademarkName}]商标出售-权明星`,
            keywords: `${name}商标转让,${name}第${typeOfTrademarkCode}类商标出售`,
			description:  `[${name}商标转让]第${typeOfTrademarkCode}类${typeOfTrademarkName}商标转让，商标注册号为${this.data.json.trademarkNumber}的${name}商标转让价格及出售详情信息。`,
			image:app.$getImg(this.data.sellJson.trademarkPicId,1)
        }) 
    }
})
