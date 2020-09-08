

// export const baseUrl = 'http://192.168.0.160:12004/' //正式服务器
export const baseUrl = 'https://gw.qmxip.com/' //正式服务器


//封装请求
export const $axios = async (obj)=>{

	let type = 'GET', url = '', data = {}, text = '获取中', hearObj={  'content-type': 'application/json'};

	if( typeof obj == 'string'){
		url = obj
	}
	else{
		type =  obj.type || 'POST'
		data =  obj.data || {}
		text = obj.text || '获取中'
		url =  obj.url

		hearObj = { 'content-type': obj.isFrom ? 'application/x-www-form-urlencoded' : 'application/json'  }

	}

	if(url.indexOf('?token') > 0){   //判断是否需要token  有就需要

		let token  = await $auth.getToken()
		
		if(token){
			hearObj.Authorization = 'Bearer ' + token

			// hearObj.Authorization = 'Bearer 3199ef75-0373-497c-bdb7-573996d16d10' 
			
		}
		else return 

		url = url.replace('?token','')
	}

    var loading = null;

	if(!loading && url.indexOf('?loading') === -1){    //判断是否需要loading
		
		loading = true
		swan.showLoading({ title: text || '获取中'})

	}
	else{
		url = url.replace('?loading','')
	}

    return new Promise( (resolve,reject)=>{
            swan.request({
                url: baseUrl+url,
                method: type ? type :'GET',
                dataType: 'json',
                data: data || {},
                header:hearObj,
                success: function (res) {
                    if(loading){
                        swan.hideLoading()
                        loading = null
                    }

					// console.log("返回数据",res)

					if(res.statusCode === 401){
					
						swan.removeStorageSync('token')
						swan.navigateTo({
							url: '/pages/getUserPhone/index'
						});
						resolve('')
					}
                    resolve(res.data)
                },
                fail: function (err) {
					console.log("333",err)
               
					swan.hideLoading()
					swan.showToast({
						title: '网络连接失败，请稍后再试!',
						icon: 'none'
					});

                    console.error('错误码：' + err.errCode);
                    console.error('错误信息：' + err.errMsg);
                }
            });
    })

}
//历史记录
export const $history = {
    get:function(key){
      let arr =   swan.getStorageSync(key)
        return arr
    },
    set:function(key,value){

      let arr = swan.getStorageSync(key)

      if(arr){

          if(arr.indexOf(value) >=0 ){
            arr.splice(arr.indexOf(value),1)
          }
          if(arr.length >= 10){
            arr = arr.slice(0,8)
          }
          arr.unshift(value)
          swan.setStorageSync(key,arr)
      }
      else{
        swan.setStorageSync(key,[value])
      }
    },
    remove:function(key){
      swan.removeStorageSync(key)
    }
}
//获取图片
export const $getImg=(id,type)=>{
  if(id && id != 'null'){
    if(id.indexOf('tm_img') >= 0){
        id = id.replace('.jpg',"")
    }
    if(type == 1){
		return `${baseUrl}api-f/files/viewFile?id=${id}&fileSource=ALIYUN&process=style/pc_notice_resize`   //大图
	} 
    // return `${baseUrl}api-f/files/viewFile/process?id=${id}&fileSource=ALIYUN&process=style/pc_trade_resize`

	 if(type == 2){ //原图或者PDF
	 	return `${baseUrl}api-f/files/viewFile?id=${id}&fileSource=ALIYUN`
	 } 

	return `${baseUrl}api-f/files/viewFile/process?id=${id}&fileSource=ALIYUN&process=style/pc_news_resize`
  }
  return ""

}
//判断输入为空，没有特殊符号
export const $verifiyStr=(str)=>{

    if (!str) {
        swan.showToast({
            title: '关键字不能为空',
            icon: 'none',
            duration: 1000,
        });
        return true;
    }
    
    if (/[`~!@#$%^&*_\-+=<>?:"\/'\\[\]·~！@#￥%……&*——\-+=？：.]/im.test(str)) {
            swan.showToast({
            title: '关键字不能包含特殊字符',
            icon: 'none',
            duration: 1000,
        });
        return true;
    }

    return false
}

//重装数据，商标名为空 为null的处理
export const $repeatName = (arr,typebool,hasNum) =>{

    if(!arr || arr.length == 0){
        return []
    }
    arr  = JSON.parse(JSON.stringify(arr))
    if(typebool){
        arr = arr.map(item =>{
            return item.source
        })
    }
 
    for(let i = 0 ;i< arr.length;i++){
        let name = arr[i].trademarkName
        let bool = true
        if(name == '图形' || name == 'null' || !name){
            name = arr[i].trademarkName =  (arr[i].trademarkNumber || arr[i].applicationNumber)
        }
        if(!hasNum){
            for(let j= i+1 ;j< arr.length ; j ++){
                if(name ==  arr[j].trademarkName){
                    
                    if(bool){
                   
                        arr[i].trademarkName =  arr[i].trademarkName +'第'+arr[i].typeOfTrademarkCode+'类'
                        bool = false
                    }
                    arr[j].trademarkName =  arr[j].trademarkName +'第'+arr[j].typeOfTrademarkCode+'类'
                }
            }
        }
    }

    return arr
}   
//获取时间格式
export function $getDateJson(time) {
    let now = time ? time : new Date();
    let y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate(),
        week = now.getDay();
    return {
        fullDate: y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString()
            .substr(0, 8),
        date: y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d),
        week,
        y,
        m: (m < 10 ? "0" + m : m),
        d:(d < 10 ? "0" + d : d),
        min: now.toTimeString().substr(0, 8)
    }
}
/*
*获取用户的 openid 和 session_key 
* bool 默认 false   为 true时，不是必须登录
*/

export function $getSessionKey( bool ) {

    return new Promise( (resolve,reject)=>{

		let  obj  = swan.getStorageSync('sessionKey')

		swan.checkSession({
            success: res => {
				// console.log('走111',obj)
				if(obj || bool){
					resolve( obj || {} )
					return
				}
				else{
					swan.login({
						success: res => {
							// console.log("login",res)
							swan.request({
								url: 'https://spapi.baidu.com/oauth/jscode2sessionkey',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: {
									// swan.login()返回的 code
									code: res.code,
									client_id: 'FN6emYpplnfCfyS9ullQ5kc1OoORlxKX', //App key
									sk: 'f26qX7PGt4839jchTBsVN72OMkaSkKHl' // 密钥
								},
								success: res => {
									if (res.statusCode === 200 && res.data.openid) {
										swan.setStorageSync('sessionKey',res.data)
										resolve(res.data)
									}
									else{
										console.log("获取失败",res)
										resolve({})
									}
								}
							});
						}
					});
				}
            },
            fail: err => {
				console.log('走22222',err)
				if(bool){
					resolve( {} )
					return
				}
				swan.login({
					success: res => {
						// console.log("login",res)
						swan.request({
							url: 'https://spapi.baidu.com/oauth/jscode2sessionkey',
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: {
								// swan.login()返回的 code
								code: res.code,
								client_id: 'FN6emYpplnfCfyS9ullQ5kc1OoORlxKX', //App key
								sk: 'f26qX7PGt4839jchTBsVN72OMkaSkKHl' // 密钥
							},
							success: res => {
								if (res.statusCode === 200) {
									swan.setStorageSync('sessionKey',res.data)
									resolve(res.data)
								}
								else{
									console.log("获取失败",res)
									resolve({})
								}
							}
						});
					}
				});
			}
		 })	
    })
}

//获取当前页面路径

export function $getPagePath( index = 1 ) {
	const pageStack = getCurrentPages();
            // console.log(pageStack)
	const currentPage = pageStack[pageStack.length - index];
	const privateProperties = currentPage.privateProperties || {};
	return privateProperties.accessUri || currentPage.uri;
}


//自定义封装stroage过期时间
/**
*key
*val
*time 默认单位为天 不传或者为0则没有超时时间
 */

export const Junstroge={
	set(key,val,time){
		let now =  time  ? (new Date().getTime() +  time*24*60*60*1000 ) : 0
		swan.setStorageSync(key,{val:val,t: now })
	},
	get(key){
		let res = swan.getStorageSync(key);

		if (!(res instanceof Error)) {
			let now = new Date().getTime()

			if(res.t === 0 || res.t >= now){
				return res.val
			}
			else{
				this.remove(key)
				return ''
			}
		}
		else{
			return ''
		}
	},
	remove(key){
		swan.removeStorageSync(key);
	}
}

//授权的一系列操作
export const $auth ={
	//获取token
	getToken(){

		return new Promise( (resolve,reject)=>{
		
			let token = Junstroge.get('token')
			if(token){
				resolve ( token )
			}
			else{

				$getSessionKey().then( res =>{
					// console.log("仔细",res)
					//请求获取token
					return this.axiosGetToken(res.openid)
				})
				.then(res =>{
					resolve( res )
				})
			}
		})
	},
	//获取电话
	getUserTel(){
		let tel = swan.getStorageSync("userTel")
		if(tel){
			return tel
		}
		else{
			swan.navigateTo({
				url: '/pages/getUserPhone/index'
			});
			return ''
		}
	},
	//请求获取token 需要openid
	axiosGetToken(openid){

		return new Promise( (resolve,reject)=>{
			$axios({url:'sys/login/wechat-focus',data:{unionid:openid,extensionParams:0},type:"POST",isFrom:true})
			.then( res =>{
				if( res ){
					Junstroge.set('token',res.access_token,1)
					resolve (res.access_token)
				}
			})
			.catch(res =>{
				console.log("获取token失败",res)
				resolve('')
			})

		})
	}
}

//获取手机号
export function getUserTel(){
	let tel = swan.getStorageSync('userTel')
		if(!tel){
			swan.navigateTo({
				url: '/pages/getUserPhone/index'
			});
		}
		else{
			return tel
		}
}
