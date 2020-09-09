/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
		userInfo:{
		},
		slectIdx:0,
		cateArr:[]
    },
    onLoad(option) {
		this.initPage()
		swan.getSystemInfo({
            success: res => {
                // console.log("设备信息1111111",res)
				// this.setData({
				// 	boxHeigt: res.windowHeight
				// })
            },
            fail: err => {
                // swan.showToast({
                //     title: '获取失败'
                // });
            }
        });
    },
	onShow(){
	
		this.initSeo()
	},
	initPage(){
		app.$axios('api-trans/trademark/transaction/hotClassify/front/getHotClassifyBindLabelList?position=1')
			.then(res =>{
				console.log(res.data)
				this.setData({
					cateArr:res.data
				})
			})
	},
	slectIdxFunc(e){
        let idx =  e.currentTarget.dataset.idx
        this.setData({
            slectIdx: idx
        })
    },
	goPage(e){
		// console.log(e)
		let url = e.currentTarget.dataset.url
		this.isHasToken( ()=>{
			swan.navigateTo({
				url
			});
		})
	},
	goOtherPage(e){
		swan.navigateTo({
			url:e.currentTarget.dataset.url
		});
	},
    initSeo(){
        swan.setPageInfo({
            title: '个人中心-权明星',
            keywords: '商标注册查询网，商标分类，商标代理机构大全，商标初审公告，商标智能注册，商标代办，商标加急注册，权明星官网',
            description: '权明星致力于运营大数据技术、人工智能等技术重新定义知识产权生态链。目前权明星主营业务：商标注册、商标延伸服务等相关业务。商标注册300元（免服务费）'
        }) 
    }
})
