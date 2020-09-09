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
		navList:['为你推荐','商标服务','专利服务','版权服务'],
		detailArr:[
			[
				{
					tit:'',
					arr:[
						{
							img:"/images/service/1.png",
							name:'商标智能注册',
							desc:'智能系统快速提交，自助申请',
							price:'￥300',
							for:'适用于:熟悉商标注册流程的业内人员'
						},
						{
							img:"/images/service/2.png",
							name:'商标顾问注册',
							desc:'顾问服务，全程代办，提高通过率',
							price:'￥599',
							for:'适用于:不太了解商标或者时间成本高的经营者'
						},
						{
							img:"/images/service/3.png",
							name:'商标加急注册',
							desc:'加急提交，避免多耗时被抢注风险',
							price:'￥799',
							for:"适用于:经营者想降低盲期的风险概率"
						}
					]
				}
			],
			[
				{
					tit:'商标注册服务',
					arr:[
						{
							img:"/images/s3.png",
							name:'注册+logo设计套餐',
							desc:'专享加急注册+logo设计套餐',
							price:'￥1399'
						},
						{
							img:"/images/s3.png",
							name:'商标担保注册',
							desc:'专业审查建议，申请不成功退全款',
							price:'￥1699'
						},
						{
							img:"/images/s3.png",
							name:'商标1+1注册',
							desc:'专享加急注册，注册不成功，免费再注册一件',
							price:'￥1299'
						},{
							img:"/images/s3.png",
							name:'商标1+1注册',
							desc:'专享加急注册，注册不成功，免费再注册一件',
							price:'￥1299'
						},
						{
							img:"/images/s3.png",
							name:'资深顾问注册服务',
							desc:'专享加急注册，注册不成功，免费再注册一件',
							price:'￥1299'
						},
						{
							img:"/images/s3.png",
							name:'注册+版权套餐',
							desc:'专享加急注册+logo设计+版权登记保护套餐',
							price:'￥2399'
						}
					]
				},
				{
					tit:'商标信息变更',
					arr:[
						{
							img:"/images/s3.png",
							name:'商标变更',
							desc:'变更注册人名义、登记地址等注册事项',
							price:'￥1000'
						},
						{
							img:"/images/s3.png",
							name:'商标转让',
							desc:'注册人将商标转到他人名下',
							price:'￥900'
						},
						{
							img:"/images/s3.png",
							name:'商标续展',
							desc:'商标十年有效期满前12个月内应申请商标续展',
							price:'￥900'
						},{
							img:"/images/s3.png",
							name:'商标宽展',
							desc:'商标到期后6个月，希望继续保有该商标',
							price:'￥1200'
						},
						{
							img:"/images/s3.png",
							name:'商标许可备案',
							desc:'授权他人使用商标，许可备案并报送备案材料，有备无患',
							price:'￥500'
						}
					]
				},
				{
					tit:'商标案件',
					arr:[
						{
							img:"/images/s3.png",
							name:'商标驳回复审',
							desc:'商标注册被驳回后，还想再去争取此商标的权益',
							price:'￥2350'
						},
						{
							img:"/images/s3.png",
							name:'商标异议申请',
							desc:'对处于公示期的近似商标，提出异议申请，阻止注册',
							price:'￥2500'
						},
						{
							img:"/images/s3.png",
							name:'商标撤三申请',
							desc:'想撤销他人已注册三年及以上不使用的商标',
							price:'￥1500'
						},
						{
							img:"/images/s3.png",
							name:'商标无效宣告',
							desc:'商标被他人恶意注册，想申请商标无效',
							price:'￥2500'
						},
						{
							img:"/images/s3.png",
							name:'商标异议答辩',
							desc:'公示期被他人提出异议，在规定时效内申请答辩，挽回注册',
							price:'￥2500'
						},
						{
							img:"/images/s3.png",
							name:'商标撤三答辩',
							desc:'商标被他人申请撤销后，及时提交答辩申请以保留商标的使用权',
							price:'￥1700'
						},
						{
							img:"/images/s3.png",
							name:'商标无效答辩',
							desc:'注册商标被他人宣告无效后，及时提出答辩，维护自身商标权益',
							price:'￥2500'
						}
					]
				}
			],
			[
				{
					tit:'专利申请',
					arr:[
						{
							img:"/images/service/f1.png",
							name:'发明专利',
							desc:'为产品创新和方法创新提供保护',
							price:'面议'
						},
						{
							img:"/images/service/f2.png",
							name:'实用新型',
							desc:'为产品结构形状微创新等提供保护',
							price:'面议'
						},
						{
							img:"/images/s3.png",
							name:'外观专利',
							desc:'为产品的外形和包装提供保护',
							price:'面议'
						}
					]
				}
			],
			[
				{
					tit:'版权登记',
					arr:[
						{
							img:"/images/s3.png",
							name:'软件著作权',
							desc:'',
							price:'￥800起'
						},
						{
							img:"/images/s3.png",
							name:'软件著作权加急',
							desc:'',
							price:'面议'
						}
					]
				}
			],
		]
    },
    onLoad() {
        // 监听页面加载的生命周期函数
		// swan.getSystemInfo({
        //     success: res => {
        //         // console.log("设备信息1111111",res)
		// 		this.setData({
		// 			boxHeigt: res.windowHeight - 10 
		// 		})
        //     },
        //     fail: err => {
        //     }
        // });
    },
    onShow(){
        this.initSeo()
    },
	goto(e){
		// <navigator path="/pages/gg/index" target="miniProgram" version='release' app-id='FN6emYpplnfCfyS9ullQ5kc1OoORlxKX'>测试</navigator>
		// console.log(111,e)
		let tit = e.currentTarget.dataset.name 
		if(tit == '商标智能注册'){
			swan.navigateTo({
				'path': '/pages/productsmart/index',
				'target':'miniProgram',
				'version':'release',
				'app-id':'FN6emYpplnfCfyS9ullQ5kc1OoORlxKX'
			});
		}
		else if(tit == '商标顾问注册'){
			swan.navigateTo({
				'path': '/pages/product/index',
				'target':'miniProgram',
				'version':'release',
				'app-id':'FN6emYpplnfCfyS9ullQ5kc1OoORlxKX'
			});
		}
		else{
			// swan.showToast({
			// 	title: '其他留言'
			// });
			swan.navigateTo({
				url: '/pages/leavemsg/index?tit='+tit
			});
		}
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
