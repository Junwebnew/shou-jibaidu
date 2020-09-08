/**
 * @file app.js
 * @author Jun   
 * 基础库 3.60.2
 */ 

/* globals swan */

import * as until from './until/until.js'

App({
    onLaunch(options) {
        // do something when launch
        // 添加到我的小程序引导，参见文档： http://smartprogram.baidu.com/docs/design/component/guide_add/
        
		if (swan.canIUse('showFavoriteGuide')) {
            swan.showFavoriteGuide({
                type: 'tip',
                content: '关注小程序，下次使用更便捷。',
                success(res) {
                    console.log('添加成功：', res);
                },
                fail(err) {
                    console.log('添加失败：', err);
                }
            });
        }
		swan.getSystemInfo({
            success: res => {
                // console.log("设备信息",res)
				this.$systemInfo = res
            },
            fail: err => {
                // swan.showToast({
                //     title: '获取失败'
                // });
            }
        });

		swan.removeStorageSync('sessionKey');
		Object.assign(this,until);
		// console.log("9999999999999999999999999")
    },
    onShow(options) {
        // console.log("111111111111111111")
    },
    onHide() {
        // do something when hide
    },
	//产品信息  商标智能注册:10  顾问注册:11  商标顾问注册+LOGO设计:13
	proArr:[],
	procduceMsg(){
		return new Promise( (resolve,reject)=>{
			if(this.proArr && this.proArr.length > 0){
				resolve(this.proArr)
			}
			else{
				until.$axios({url:'api-od/order/product/front/pageList?loading?belongSystem=2&productStatus=1&start=1&length=100'})
				.then( res=>{
					if(res.code == 200){
						this.proArr = res.data.pageList
						resolve(this.proArr)
					}
					else{
						resolve('')
					}
				})
				.catch(()=>{
					swan.showToast({
						title: '请求产品信息失败',
						icon:"none"
					});
				})
			}
		})
	}, 
	globalData:{},
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
    getAllClassify(){
        let res = swan.getStorageSync('clssify');
        if(res && !(res instanceof Error)){
            return res
        }
        else{
            return until.$axios({url:`api-tm/tradeMarkType/trademark/queryTradeMark?level=1`})
                    .then( res =>{
                        swan.setStorageSync('clssify',res.data);
                        return res.data
                    })
                    .catch(msg=>{
                        return []
                    })
        }
    }
});
