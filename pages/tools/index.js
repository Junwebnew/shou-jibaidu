/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        tradeList:'',
        allList:'',
        slectIdx:0,
    },
	hasRequest:true,
	onInit(){
		if(this.hasRequest){
			this.hasRequest = false
			this.initpage()	
		}
	},
    onLoad() {
        // 监听页面加载的生命周期函数
		swan.getSystemInfo({
            success: res => {
                // console.log("设备信息1111111",res)
				this.setData({
					boxHeigt: res.windowHeight - 10 
				})
            },
            fail: err => {
                // swan.showToast({
                //     title: '获取失败'
                // });
            }
        });
        if(this.hasRequest){
			this.hasRequest = false
			this.initpage()	
		}	
    },
    onShow(){
        this.initSeo()
    },
    getUserInfo(e) {
    },
    initpage(){
        app.$axios({url:`api-tm/tradeMarkType/trademark/queryTradeMark`,data:{level:1}})
            .then(res =>{
                this.setData({
                    tradeList:res.data,
                })
            })
        app.$axios({url:'api-tm/tradeMarkType/query/page/detail',type:'Post',data:{"pageSize": "45","pageNum": "1"}})
            .then(res=>{
                this.setData({
                    allList:res.data
                })
            })

        // Promise.all([
        //     app.$axios({url:`api-tm/tradeMarkType/trademark/queryTradeMark`,data:{level:1}}),
        //     app.$axios({url:'api-tm/tradeMarkType/query/page/detail',type:'Post',data:{"pageSize": "45","pageNum": "1"}})
        // ]).then(res => {
        //         swan.showLoading({ title: '加载中'})    
        //         let { data } = res[0];
        //         //不存在数据
        //         this.setData({
        //             tradeList:data,
        //             allList:res[1].data
        //         })
        //        setTimeout(()=>{
        //             swan.hideLoading()
        //        },1000)
              
        //         // console.log(111,res)
        //     })
        //     .catch(() => {
        //         // error({ statusCode: 500, message: "参数错误" });
        //     });
    },
    slectIdxFunc(e){
        let idx =  e.currentTarget.dataset.idx
        this.setData({
            slectIdx: idx
        })
    },
    initSeo(){
	
        swan.setPageInfo({
            title: "商标分类表2020版-最新商标分类表-商标分类查询-权明星",
            keywords: "商标分类表2020版，最新商标分类表，商标分类查询，尼斯分类",
            description:  "权明星官网为你提供商标分类表2020版，商标分类标最新，商标分类查询等商标查询信息；"
        }) 
    }
})
