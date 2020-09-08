
import * as until from './until.js'

var baseUrl = until.baseUrl //服务器

/*
* obj
* count:每次所选的数量，url路径，token：默认需要token，
* name：对应的key:如：file,默认为file ,formData:其他说需参数
* text:显示的loading 文字
*/
export function uploadOcrPress(obj,cb){
	 swan.chooseImage({
            count: obj.count || 1,
            sizeType: ['original'], // 可以指定是原图original还是压缩图compressed
            sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: async res => {
				// console.log('选照片',res);
				// console.log( swan.getImageInfo(res.tempFilePaths[0]) 
				swan.getImageInfo({
					src: res.tempFilePaths[0],
					success: res => {
						// console.log('getImageInfo success', res);
						canvasFill(res,obj,cb)
					},
					fail: err => {
						console.log('getImageInfo fail', err);
					}
				});

			}
	})
}		
/*
* obj
* count:每次所选的数量，url路径，token：默认需要token，
* name：对应的key:如：file,默认为file ,formData:其他说需参数
*/	
function canvasFill(imgMsg,obj,cb){

		let scale = imgMsg.width / imgMsg.height,
			len = obj.maxLength || 1200, //设置最长的一边为1200 
			w = 0,h = 0; 
			if(scale >= 1){  //宽图
				w = len
				h = (len / scale).toFixed(0)-1+1;
			}
			else{ //长图
				h = len ;
				w = (len * scale).toFixed(0)-1+1
			}

		var contex = swan.createCanvasContext('myCanvas')	

		contex.drawImage(imgMsg.path, 0, 0, w, h);
		let time = new Date().getTime()
		contex.draw(function(){
			console.log('耗时', new Date().getTime() - time)
			setTimeout(()=>{
				swan.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: w,
					height: h,
					destWidth: w,
					destHeight: h,
					canvasId: 'myCanvas',
					fileType:'jpg',
					quality:0.95,
					success: function(res){

						let path = res.tempFilePath
						swan.showLoading({ title:'上传中...'})
						swan.uploadFile({
							url: baseUrl+obj.url, 
							filePath:path,
							name: obj.name,
							header:{'content-type': 'multipart/form-data' },
							formData: obj.formData,
							success: msg => {
								swan.hideLoading()
								// console.log('上传后消息', msg);
								if(msg.data.code == 200){
									cb(msg.data.data || msg.data)
								}
								else{
									swan.showToast({
										title: msg.data.msg,
										icon: 'none',
										duration:5000,
										success: msg =>{
										}
									});
								}
							},
							fail: err => {
								swan.hideLoading()
								console.log('fail', err);
								cb('')
							},
							complete:msg =>{
								
							}
						})
					}
				})
			}, 200);
		})
}

/*
* obj
* count:每次所选的数量，url路径，token：默认需要token，
* name：对应的key:如：file,默认为file ,formData:其他说需参数
* text:显示的loading 文字
*/
export function uploadOcr(obj,cb){
	 swan.chooseImage({
            count: obj.count || 1,
            sizeType: ['original'], // 可以指定是原图original还是压缩图compressed
            sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: async res => {
				console.log('选照片',res);

					swan.showLoading({ title:'上传中...'})
					
					
					let header = {'content-type': 'multipart/form-data' }

					if(!obj.token){   //判断是否需要token  默认需要

						let token  = await until.$auth.getToken()
						
						if(token){
							header.Authorization = 'Bearer ' + token
						}
						else return ''
					}

					swan.uploadFile({
							url: baseUrl+obj.url, 
							filePath:res.tempFilePaths[0],
							name: obj.name,
							header,
							formData: obj.formData,
							success: msg => {
								swan.hideLoading()
								console.log('上传后消息', msg);
								if(msg.data.code == 200){
									cb(msg.data.data || msg.data ,res.tempFilePaths[0])
								}
								else{
									swan.showToast({
										title: msg.data.msg,
										icon: 'none',
										duration:5000,
										success: msg =>{
										}
									});
								}
							},
							fail: err => {
								swan.hideLoading()
								console.log('fail', err);
								cb('')
							},
							complete:msg =>{
								
							}
						})
            },
            fail: err => {
                console.log('取消选择：' + err.errMsg);
            }
        });	
}

export function downloadFile(str,cb){
	
		// let str = 'type=0&client=成都精英银河建筑装饰设计有限公司&idCard=510104000235540&postalCode=618200&clientAddress=成都市锦江区庆云南街69号红星国际3-3-313号'

	swan.showLoading({ title:'下载中'})
	
	swan.request({
		url:'https://baidudownload.qmxip.com/files/export/proxypdfbaiduApplet?'+str,
		// url:'http://192.168.0.171:12066/files/export/proxypdfbaiduApplet?'+str,
		method:'GET',
		dataType: 'json',
		data: {},
		header:'application/json',
		success: function (imgRes) {
			swan.hideLoading()
			if(imgRes.statusCode == 200){
				downloadImags(imgRes.data,cb)
			}
		},
		fail:function(msg){
			swan.hideLoading()
			swan.showToast({
				title: '下载失败'+msg,
				icon: 'none'
			});
		}
	  })	
}

//传入图片id，进行下载

export function downloadImags(id,cb){

	let url  = (baseUrl+'api-f/files/viewFile?id='+id+'&fileSource=ALIYUN').replace(/"/g,'')
	swan.downloadFile({
		url:url,
		header: {
			'content-type': 'application/json'
		},
		success: res => {

			let filePath = res.tempFilePath;
		
			swan.saveImageToPhotosAlbum({
				filePath, // 暂不支持网络图片地址，需与swan.downloadFile一起使用
				success: res => {
					swan.showToast({
						title: '已保存到本地相册',
						icon: 'none'
					});
					if( cb && typeof cb == 'function')  cb(id)
				},
				fail: err => {
					swan.showToast({
						title: '保存失败',
						icon: 'none'
					});
					// console.log('saveImageToPhotosAlbum fail', err);
				}
			});
		},
		fail: err => {
			console.log('下载失败',err)
		},
		complete: () => {
			swan.hideLoading()
		}
	});
}