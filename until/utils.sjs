
const baseUrl = 'https://gw.qmxip.com/' //正式服务器

const getImg= function(id,type){
  if(id && id != 'null'){
    if(id.indexOf('tm_img') >= 0){
        id = id.replace('.jpg',"")
    }
    if(type == 1){
		return `${baseUrl}api-f/files/viewFile?id=${id}&fileSource=ALIYUN&process=style/pc_notice_resize`   //大图
	} 
	if(type == 2){ //原图或者PDF
		return `${baseUrl}api-f/files/viewFile?id=${id}&fileSource=ALIYUN`
	} 
	return `${baseUrl}api-f/files/viewFile/process?id=${id}&fileSource=ALIYUN&process=style/pc_news_resize`
  }
  return ""
}
module.exports =  {
    getImg,
	baseUrl
};