/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
		allTags:[],
		likeTagsArr:[],
		wordNumber:['1字','2字','3字','4字','5字'],
		tmTypeArr:['纯中文','纯英文（拼音）','纯数字','中文+英文（拼音）','图形','中文+数字'],
		isSHowDraw:false,
		listData:[],
		total:-1,
		pageNum:1,
		pageurl:"/",
		optionParams:{
			keys:'',//商标名
			t:'', //大类
			t2:'',//二类
			t3:'',//三类
			h:'',//喜好
			n:'',//字数
			c:'',//类型 中文+英文
			p1:'',//最低价
			p2:'',//最高价
			sort: '', //1：价格 2：时间 3：热度
			order:'' , //1: 升序  2：降序
		},
		description:''
    },
    onLoad(option) {
        // 监听页面加载的生命周期函数



		this.initpage(option)
    },
	onShow(){
		// this.initSeo()
	},
	initpage(option){

		function getTags(){ //所有标签

			let arr = swan.getStorageSync('tages');

            if(arr && arr.length > 0){
                return arr
            }
            else{
                return app.$axios('api-trans/trademark/transaction/info/front/hotTrademarkTypeInfo')
                .then( res=>{

                    let tages = res ? res.data : []

					swan.setStorageSync('tages',tages);

                    return  tages
                })
                .catch((msg)=>{
                    return []
                })
            }
		}
		function getLikeTag(){ //喜好类型

			let arr = swan.getStorageSync('likeTags');

            if(arr && arr.length > 0){
                return arr
            }
            else{
            
				return app.$axios('api-trans/trademark/transaction/trademarkLike/front/queryTrademarkLikeList')
						.then(res =>{

							let likeTags = res ? res.data : []

							swan.setStorageSync('likeTags',likeTags);

							return likeTags
						})
						.catch(res =>{
							return []
						})
			}		
        }
		// console.log('999',option)
		let pageNum = option.page || 1
		let requireObj={
            trademarkName:option.keys, //商标名
            applicationNumber:"" , //商标申请号
            firstNum: option.t || '' ,//商标分类
            isInternational:"0", //是否国际 0 否 1 是
            pageNo:pageNum-1,
            pageSize:30,
            priceType: (option.p1 || option.p2) ? 1 : '' ,
            priceMin:Number( option.p1 || 0 ), //价格区间-最小值
            priceMax:Number( option.p2 || 0 ), //价格区间-最大值
            trademarkLabelType: option.t2 || '',//商标标签分类  例 "fuzhuang"
            trademarkLabel:option.t3 || '', //商标标签 例 ["nvxie2","yifu"],
            trademarkLike: option.h || '', //喜好
            trademarkNameWordnum: option.n || '',  //字数 
            trademarkStructure: option.c || '', //商标结构(1、纯中文 2、纯英文（拼音） 3、纯数字 4、中文+英文（拼音） 5、图形 6、中文+数字 )
            sortBy: option.sort || '', //1：价格 2：时间 3：热度
            orderBy:option.order || '', //1: 升序  2：降序
        }
		Promise.all([
			app.$axios({url:'api-trans/trademark/transaction/es/front/queryPageList',data:requireObj}),
			getTags(),
			getLikeTag()
		]).then(res =>{

			// console.log(res[2])

			let listData = res[0].data.data

	
			listData.map( i =>{
				i.img = app.$getImg(i.trademarkPicId,1)
			})
		

			let pageurl = "/pages/list/index?"
				for(let i in option){
					if(option[i] && i != 'page' ) pageurl+=( i +'='+ option[i] + '&' )
				}
			// console.log("参数",pageurl,this.data.pageNum)
			this.setData({
				listData,
                total:res[0].data.total,
				pageurl,
				pageNum,
				optionParams:option,
				allTags : res[1],
				likeTagsArr:res[2]
			})
			
			this.initSeo()
			
		})
	},
	selectSorder(e){

		let optionParams = this.data.optionParams

		let idx = e.currentTarget.dataset.idx;

		this.setData({
			'optionParams.sort' : idx,
			'optionParams.order' : optionParams.sort == idx ? ( optionParams.order == 1 ? 2 : 1 ) : 2
		})
		
		let pageurl = "/pages/list/index?"
			for(let i in optionParams){
				if(optionParams[i] && i != 'page' ) pageurl+=( i +'='+ optionParams[i] + '&' )
			}

		swan.navigateTo({
			url: pageurl
		});
	},
	bindinputFunc(e){
        this.setData({
            'optionParams.keys':e.detail.value,
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
		var keys = (this.data.optionParams.keys || '').replace(/(^\s*)|(\s*$)/g, ""); 
		
            this.setData({
                'optionParams.keys':keys
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
	openDraw(){
  		this.setData({
            isSHowDraw:true,
        })
	},
	listener(){
		this.setData({
            isSHowDraw:false
        })
	},
	replaceImg(e){
		
        let idx = e.currentTarget.dataset.idx;
        let listData = JSON.parse(JSON.stringify(this.data.listData))
            listData[idx].img = '../../../images/error_s.jpg'
        this.setData({
            listData:listData
        })
    },
	initSeo(){

		let  optionParams = this.data.optionParams
		let  allTags = this.data.allTags
		let  likeTagsArr = this.data.likeTagsArr

		if(allTags.length == 0 ) return

		let cate = optionParams.t,
            cate2 = optionParams.t2,
            cate3 = optionParams.t3,
            like = optionParams.h,
            pageStr = optionParams.page > 1 ? `第${optionParams.page}页`: '',
            pageStr2 = optionParams.page > 1 ? `第${optionParams.page}页,`: '',
            pageStr3 = optionParams.page > 1 ? `第${optionParams.page}页：`: '',
            pageStr4 = optionParams.page > 1 ? `-第${optionParams.page}页`: '';
        var chNumArr = ['','一类','二类','三类','四类','五类','六类','七类','八类','九类','十类','十一类','十二类','十三类','十四类',
                '十五类','十六类','十七类','十八类','十九类','二十类','二十一类','二十二类','二十三类','二十四类','二十五类','二十六类',
                '二十七类','二十八类','二十九类','三十类','三十一类','三十二类','三十三类','三十四类','三十五类','三十六类','三十七类',
                '三十八类','三十九类','四十类','四十一类','四十二类','四十三类','四十四类','四十五类']

		let hasOther =   !!optionParams.n , //判断有无其他参数， 字数，类型 价格
			bcateStr = '',
            cateStr='',
            cate2Str='',
            cate3Str='',
            likeStr='',
            numStr = optionParams.n ? (optionParams.n +'字') : '',
            tmTypeStr='',
            tmPriceStr='';
        //获取标签名称
        if(cate){
            cate = cate - 1 + 1
            cateStr = cate+'类'+ allTags[cate-1].tradeMarkTypeName
            bcateStr = allTags[cate-1].tradeMarkTypeName
        }
        if(cate2){
            allTags[cate-1].bindLabelTypeList.forEach(i =>{
                if(i.labelTypeCode == cate2){
                    cate2Str = i.labelTypeName
                    if(cate3 && i.hotBindLabelDTOList){
                        i.hotBindLabelDTOList.forEach(i2 =>{
                            if(i2.labelCode == cate3){
                                cate3Str = i2.labelName
                                return
                            }
                        })
                    }
                    return
                }
            })
        }    
        //获取推荐类型
        if(like){
            likeTagsArr.forEach(i =>{
                if(like == i.code ){
                    likeStr = i.name
                }
            })
        }
        //获取商标类型
        if(optionParams.c){
			hasOther = true
            tmTypeStr = this.data.tmTypeArr[optionParams.c-1]
        }
        //获取商标价格
        if(optionParams.p1 || optionParams.p2){
			hasOther = true
            tmPriceStr = (optionParams.p1 || 0) +'-'+ (optionParams.p2 || '以上') +'元'
        }
      
        let t = '',d = '', k ='';
            //只有大类
		if(cate  && !cate2 && !cate3 && !like && !hasOther ){
			t = `[${cate}类商标购买]第${cate}类商标转让平台_${chNumArr[cate]}商标转让-权明星${chNumArr[cate]}商标交易网${pageStr4}`
			k = `${pageStr2}${cate}类商标购买,${chNumArr[cate]}商标购买,${cate}类商标转让,${chNumArr[cate]}类商标转让,${cate}类商标交易`
			d = `${pageStr3}权明星【第${cate}类商标转让平台】特价${cate}类商标购买,好听${cate}类商标转让,精品${cate}类商标交易网,${chNumArr[cate]}商标转让价格一览,${chNumArr[cate]}商标购买选权明星专业${cate}类商标转让服务。`
		}
		//大类和小分类
		else if(cate  && (cate2 || cate3)  && !like && !hasOther){
			let name = cate3Str || cate2Str
			
			t = `${name}商标转让_${name}商标购买_${name}商标出售_权明星${name}商标买卖交易网站${pageStr4}`
			k = `${pageStr2}${name}商标转让,${name}商标购买,购买${name}商标,${name}商标出售,${name}商标交易网站`
			d = `${pageStr3}权明星【${name}商标转让网站】是专业的${name}商标交易、买卖、转让平台；${cate}类${name}商标购买价格信息一览,购买${name}商标选权明星一对一商标转让服务。`
		}
		//喜好
		else if(!cate && like && !hasOther){  
			if(like == 1){
				t = `[特价商标买卖]_特价商标转让_低价便宜商标买卖与交易网站-权明星${pageStr4}`
				k = `特价商标买卖,特价商标转让,特价商标交易,低价商标转让,便宜商标转让,特价商标购买${pageStr}`
				d = `权明星【特价商标转让网】是专业的特价商标买卖、交易、转让平台；找提特价商标转让信息,购买低价便宜商标到权明星${pageStr}。`    
			}
			else if(like == 2){
				t = `[精品商标购买]_精品商标转让平台_优质精品商标买卖与交易网站-权明星${pageStr4}`
				k = `精品商标,精品商标购买,精品商标转让平台${pageStr}`
				d = `权明星【精品商标转让网】是专业的精品商标买卖、交易、转让平台；找提精品商标转让信息,购买优质精品商标到权明星${pageStr}。`    
			}
			else{
				t = `[好听商标购买]_好听商标转让平台_品质好听商标买卖与交易网站-权明星${pageStr4}`
				k = `好听商标购买,好听商标转让平台${pageStr}`
				d = `权明星【好听商标转让网】是专业的好听商标买卖、交易、转让平台；找提好听商标转让信息,购买品质好听商标到权明星${pageStr}。`   
			}

		}
			//大分类和喜好
		else if(cate  && !cate2 && like && !hasOther){
			
			let name = cate3Str || cate2Str
			
			t = `${likeStr}${cate}类商标转让_${cate}类${likeStr}商标购买-权明星${bcateStr}商标交易平台${pageStr4}`
			k = `${pageStr2}${likeStr}${cate}类商标转让,${cate}类${likeStr}商标购买,${bcateStr}商标交易`
			d = `${pageStr3}权明星【${cate}类${likeStr}商标交易平台】提供：${likeStr}${cate}类商标转让、${likeStr}${bcateStr}商标买卖；购买${cate}类${likeStr}商标上权明星${bcateStr}商标转让网站。`
		}
		//小分类和喜好
		else if(cate  && (cate2 || cate3)  && like && !hasOther){
			
			let name = cate3Str || cate2Str
			
			t = `${likeStr}${name}商标转让-${likeStr}${name}商标交易-${cate}类${likeStr}${name}商标买卖平台-权明星${pageStr4}`
			k = `${likeStr}${name}商标,${likeStr}${name}商标转让,${likeStr}${name}商标交易,${likeStr}${name}商标买卖${pageStr}`
			d = `权明星【${likeStr}${name}商标转让网】是专业的${cate}类${likeStr}${name}商标买卖、交易、转让平台；${likeStr}${name}商标转让信息大全,买卖${likeStr}${name}商标上权明星${name}商标交易平台。`
		}
		else{
			let name = tmPriceStr + tmTypeStr + numStr + likeStr + (cate3Str || cate2Str) + (cate ? cateStr : "" )+ (optionParams.keys || '')
				name = name ? name : ''
					
			t = `${name}商标转让${pageStr}-权明星商标转让网`
			k = `${pageStr2}${name}商标转让`
			d = `${pageStr3}权明星商标转让网提供：${name}商标转让商标转让信息；${name}商标购买到权明星。`
		}
	
		this.setData({
			description : d
		})

		// console.log('TTTT',t)
		// console.log('KKKK',k)
		// console.log('DDDD',d)

		swan.setPageInfo({
			title: t +`-${pageStr}权明星`,
			keywords: k,
			description:d
		}) 
	}
})
