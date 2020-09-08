/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
		userInfo:{
		}
    },
    onLoad(option) {
		//缓存有 storage
		if(swan.getStorageSync('userInfo')){
			this.setData({
				userInfo:swan.getStorageSync('userInfo'),
			});
		}
		else{
			//没有storge,但是已登陆
			if(app.Junstroge.get('token')){
				this.axiosGetInfo()
			}
		}
    },
	onShow(){
		// app.$auth.getToken()
		// .then( res =>{
		// 	console.log('909091111111111', res )
		// })
		this.initSeo()
	},
	initPage(){
		
	},
	//登录授权
	getUserToken(){
		this.isHasToken( (msg)=>{
			// console.log('909091111111111', msg )
			msg && this.axiosGetInfo()
		})
	},
	//获取用户的信息并去修改
	getUserInfo(cb){
		swan.getUserInfo({
            success: res => {
                // 用户在首次使用小程序时拒绝授权，可使用此api在合适的业务时机提醒用户再次授权
                // swan.openSetting({});
				
                let userInfo = res.userInfo;
				swan.setStorageSync('userInfo',userInfo)
                this.setData({
					userInfo,
                    // nickname: userInfo.nickName,
                    // avatarUrl: userInfo.avatarUrl,
                    // nameColor: 'active'
                });
				// console.log(this.data.userInfo)
				this.updataInfo(userInfo)
				// console.log('掺乎', typeof cb )

				if( typeof cb == 'function')
					cb && cb()
            },
            fail: err => {
                console.log(err);
                swan.showToast({
                    title: '请先授权'
                });
				swan.openSetting({});
            }
        });
	},
	updataInfo(userInfo){
		let params  ={
			nickname:userInfo.nickName,
			sex:userInfo.gender,
			headImgUrl:userInfo.avatarUrl
		}
		app.$axios({url:'api-u/users/me?token?loading',data:params,type:"PUT"})
			.then( res =>{
				swan.showToast({
					title: '更新成功',
					icon: 'success'
				});
			})
	},
	axiosGetInfo(){
		app.$axios({url:"api-u/users/get/usermsg?token"})
			.then(res =>{
				// console.log('个人信息',res.data)
				if(res.code == 200){

					let userInfo = {
						nickName: res.data.headImgUrl ? res.data.nickname : '百度用户',
						avatarUrl: res.data.headImgUrl || '../../images/logo-icon.png',
						id: res.data.id
					};
					swan.setStorageSync('userInfo',userInfo)
					this.setData({
						userInfo
					});
				}
			})
	},
	takeTel(){
		app.takeTel()
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
	//点击列表前从这里过一次
	isHasToken(cb){
		app.$auth.getToken()
			.then( res =>{
				if(res){
					cb && cb(res)
				}
			})
	},
	//下拉刷新
	onPullDownRefresh(){
        // 若要触发用户手动下拉刷新，在json文件中设置 "enablePullDownRefresh": true
		this.getUserInfo( ()=>{
			swan.stopPullDownRefresh({
				success: res => {
					console.log('stopPullDownRefresh success');
				},
				fail: err => {
					console.log('stopPullDownRefresh fail', err);
				}
			});
		})
    },
    initSeo(){
        swan.setPageInfo({
            title: '个人中心-权明星',
            keywords: '商标注册查询网，商标分类，商标代理机构大全，商标初审公告，商标智能注册，商标代办，商标加急注册，权明星官网',
            description: '权明星致力于运营大数据技术、人工智能等技术重新定义知识产权生态链。目前权明星主营业务：商标注册、商标延伸服务等相关业务。商标注册300元（免服务费）'
        }) 
    }
})
