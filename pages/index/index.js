/**
 * @file index.js
 * @author swan
 */
const app = getApp()
Page({
    data: {
		keyWord:'',
		hotTmArr:[
			{name:"化妆日用",url:'t=3',src:'https://sbzr.qmxip.com//img/03.png'},
			{name:"电子电器",url:'t=9',src:'https://sbzr.qmxip.com//img/09.png'},
			{name:"珠宝钟表",url:'t=14',src:'https://sbzr.qmxip.com//img/14.png'},
			{name:"皮革皮具",url:'t=18',src:'https://sbzr.qmxip.com//img/18.png'},
			{name:"服装鞋帽",url:'t=25',src:'https://sbzr.qmxip.com//img/25.png'},
			{name:"食品鱼肉",url:'t=29',src:'https://sbzr.qmxip.com//img/29.png'},
			{name:"方便食品",url:'t=30',src:'https://sbzr.qmxip.com//img/30.png'},
			{name:"啤酒饮料",url:'t=32',src:'https://sbzr.qmxip.com//img/32.png'},
			{name:"酒",url:'t=33',src:'https://sbzr.qmxip.com//img/33.png'},
			{name:"餐饮住宿",url:'t=43',src:'https://sbzr.qmxip.com//img/43.png'}
		],
		jingpinArr:[],
		tuijianArr:[],
		haotingArr:[],
		specilArr:[],
		hotCateArr:[],
		bigBanner: [],
		listTmbrand:[],
		showReg:true
    },
	hasRequest:true,
	onInit(){
		// if(this.hasRequest){
		// 	this.hasRequest = false
		// 	this.initPage()
        // 	this.initNewest()
		// }
	},
    onLoad() {
        // 监听页面加载的生命周期函数
        // if(this.hasRequest){
			this.initPage()
        // 	this.initNewest()
		// }
		// app.procduceMsg()
    },
    onShow(){
        this.initSeo()
    },
    initPage(){
		Promise.all([
			app.$axios('api-trans/trademark/transaction/advertise/front/queryAdvertiseList?advertisePosition=1_1_sj?loading')
		]).then(res => {

			res[0].map(item =>{
				item.imgs = app.$getImg(item.picId,1)
			})

			this.setData({
				bigBanner:res[0]
			})
		})
		this.initOthers()
    },
    initOthers(){

		var getTmList=(cate,type)=>{
            let requireObj ={
                    "orderBy": "1",
                    "pageNo": 0,
                    "pageSize": 6,
                    "sortBy": "5",
                    'status':1,
                    'trademarkLike':type
                }
                if(cate == 'recommend'){
                    requireObj = {
                        "pageNo": 0,
                        "pageSize": 10,
                        "recommendedLocation":1,
                        "sortBy": "5",
                        'orderBy':'1'
                    }
                }
            return app.$axios({url:'api-trans/trademark/transaction/es/front/queryPageList?loading',data:requireObj})
            .then((res)=>{
                return res.data.data
            })
            .catch((msg)=>{
                return []
            })
        }


	   	Promise.all([
				getTmList('xihao','2'),getTmList('xihao','1'),getTmList('xihao','3'),getTmList('recommend'),
				app.$axios('api-trans/trademark/transaction/index/recommend/front/getIndexRecommend?recommendPosition=1&pageNo=1&pageSize=4')
				// app.$axios({url:'api-w/newsInfo/query/page/list?loading',type:'Post',data:requireObj}),
				// app.$axios({url:'api-e/historysearch/query_hot?loading',data:{pageSize:9},isFrom:true}),
		  ]).then(res => {
		
			  	let listTmbrand = res[4] ? res[4].data : []    
				listTmbrand.map( i =>{
					i.trademarkLabelCode = i.trademarkLabelCode.split(',')
					i.trademarkLabelName = i.trademarkLabelName.split(',')
				})
	
				this.setData({
					jingpinArr:res[0],
					tuijianArr:res[1],
					haotingArr:res[2],
					specilArr:res[3],
					listTmbrand
				})
		  })
	},
	//产品详情列表
	goProduct(){
		swan.navigateTo({
			url: '/pages/product/index'
		});
	},
    bindinputFunc(e){
        this.setData({
            keyword:e.detail.value,
        })
    },
    replaceImg(e){
        let idx = e.currentTarget.dataset.idx;
        let newsList = JSON.parse(JSON.stringify(this.data.newsList))
            newsList[idx].newsInfo.newsIco = '../../images/error_s.jpg'
        this.setData({
            newsList:newsList
        })
    },
    goSearch(){
        var keys = this.data.keyword.replace(/(^\s*)|(\s*$)/g, ""); 
            this.setData({
                keyword:keys
            })
        if (!keys) {
            swan.showToast({
                title: '关键字不能为空',
                icon: 'none',
                duration: 1000,
            });
            return;
        }

        if (/[`~%^*_\+=<>?:"\/'\\[\]·~！%……*——\-+=？：.]/im.test(keys)) {
             swan.showToast({
                title: '关键字不能包含特殊字符',
                icon: 'none',
                duration: 1000,
            });
            return false;
        }
		
        swan.navigateTo({
            url: '/pages/list/index?keys='+keys
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
	onPageScroll(e){
		if(!this.data.showReg){
			app.globalData.timer && clearTimeout(app.globalData.timer);

			app.globalData.timer = setTimeout(()=>{
				this.setData('showReg',true)
			}, 500);
		}
		else{
			this.setData('showReg',false)
		}
	},
    initSeo(){
        swan.setPageInfo({
            title: '商标注册查询网-商标注册流程-权明星',
            keywords: '商标注册查询网，商标分类，商标代理机构大全，商标初审公告，商标智能注册，商标代办，商标加急注册，权明星官网',
            description: '权明星致力于运营大数据技术、人工智能等技术重新定义知识产权生态链。目前权明星主营业务：商标注册、商标延伸服务等相关业务。商标注册300元（免服务费）',
            image:'https://sj.qmxip.com/_nuxt/assets/images/banner_img.png'
        }) 
    }
})
