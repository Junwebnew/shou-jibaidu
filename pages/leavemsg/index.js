/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
		userInfo:{
		},
		msg:{
			tit:'商标',
			name:"",
			tel:""
		}
    },
    onLoad(option) {
		this.setData(
            `msg.tit`,option.tit
        )
    },
	onShow(){
		this.initSeo()
	},
	takeTel(){
		app.takeTel()
	},
	bindinputFunc(e){
		let key = e.currentTarget.dataset.key
        this.setData(
            `msg.${key}`,e.detail.value,
        )
	},
	goSubmit(){
		let msg = this.data.msg

		if (!/^1(3|4|5|7|8|9)\d{9}$/.test(msg.tel)) {
			swan.showToast({
                title: '请填写正确电话号码',
                icon: 'none',
                duration: 1000,
            });
			return;
		}

		let lmessage ='手百咨询：'+msg.tit

		let obj= {
			'messagePerson':msg.name,
			'messagePersonContent':lmessage,
			'messagePersonTel':msg.tel,
			'messageType':1
		}
		app.$axios({url:'api-trans/trademark/transaction/message/insert',data:obj})
		.then(res =>{   
			if(res.code == 200){
				swan.showToast({
					title: '提交成功!',
					icon: 'success',
					duration: 1000,
				});
				setTimeout(()=>{
					swan.navigateBack();
				}, 500);
			}
		})
		.catch(res=>{
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
