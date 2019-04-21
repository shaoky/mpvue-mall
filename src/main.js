import Vue from 'vue'
import App from './App'
import store from './store'

import './assets/less/main.less'
import '../static/weui/weui.css'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
const app = new Vue(App)
app.$mount()

export default {
    // 这个字段走 app.json
    // config: {
    //     // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    //     pages: [
    //         'pages/login/index/main',
    //         'pages/index/main',
    //         /* 登录 */
    //         'pages/h5/main',
    //         '^pages/login/register/main',
    //         'pages/login/apply/main',
    //         'pages/login/forget/main',
    //         'pages/logs/main',
    //         /* 产品 */
    //         'pages/goods/list/main',
    //         'pages/goods/info/main',
    //         'pages/goods/confirm/main',
    //         'pages/goods/success/main',
    //         'pages/cart/main',
    //         'pages/user/index/main',
    //         'pages/user/order/main',
    //         'pages/user/order/info/main',
    //         'pages/user/address/main',
    //         'pages/user/address/add/main',
    //         'pages/user/refund/main',
    //         'pages/user/revisePassword/main',
    //         'pages/user/refund/info/main',
    //         'pages/common/region/main',
    //         'pages/user/information/main'
    //     ],
    //     'window': {
    //         'backgroundTextStyle': 'dark',
    //         'navigationBarBackgroundColor': '#ffffff',
    //         'navigationBarTitleText': 'WeChat',
    //         'navigationBarTextStyle': 'black'
    //     },
    //     tabBar: {
    //         'color': '#999999',
    //         'selectedColor': '#f70044',
    //         'backgroundColor': '#ffffff',
    //         'list': [
    //             {
    //                 'pagePath': 'pages/index/main',
    //                 'text': '首页',
    //                 'iconPath': '/static/images/common/footer-01.png',
    //                 'selectedIconPath': '/static/images/common/footer-011.png'
    //             },
    //             {
    //                 'pagePath': 'pages/goods/list/main',
    //                 'text': '全部商品',
    //                 'iconPath': '/static/images/common/footer-02.png',
    //                 'selectedIconPath': '/static/images/common/footer-022.png'
    //             },
    //             {
    //                 'pagePath': 'pages/cart/main',
    //                 'text': '购物车',
    //                 'iconPath': '/static/images/common/footer-03.png',
    //                 'selectedIconPath': '/static/images/common/footer-033.png'
    //             },
    //             {
    //                 'pagePath': 'pages/user/index/main',
    //                 'text': '我的',
    //                 'iconPath': '/static/images/common/footer-04.png',
    //                 'selectedIconPath': '/static/images/common/footer-044.png'
    //             }
    //         ]
    //     }
    // }
}
