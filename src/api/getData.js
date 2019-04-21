import request from '../config/request'

export const wxLogin = (data) => request('wx/register', {data})
/**
 * 首页
 */
export const getIndexData = (data) => request('h5/index/data', {data})

/**
 * 商品
 */
export const getGoodsList = (data) => request('h5/goods/list', {data})
export const getGoodsInfo = (data) => request('h5/goods/info', {data})
export const getGoodsCategory = (data) => request('h5/goodsCategory/list', {data})
export const getGoodsAll = (data) => request('h5/goodsAll/list', {data})

/**
 * 地址
 */
export const addAddress = (data) => request('h5/user/address/add', {data})
export const getAddressList = (data) => request('h5/user/address/list', {data})
export const delAddress = (data) => request('h5/user/address/delete', {data})
export const getAddressDefault = (data) => request('h5/user/address/default', {data})
export const setAddressDefault = (data) => request('h5/user/address/setDefault', {data})

/**
 * 购物车
 */
export const getCartList = (data) => request('h5/cart/list', {data})
export const addCart = (data) => request('h5/cart/add', {data})
export const delCart = (data) => request('h5/cart/delete', {data})
export const editCart = (data) => request('h5/cart/update', {data})
export const editSelectedCart = (data) => request('h5/cart/selected/update', {data})
export const editSelectedAllCart = (data) => request('h5/cart/selectedAll/update', {data})

/**
 * 订单
 */
export const getOrderGoodsPreview = (data) => request('app/order/goodsPreview', {data})
export const getOrderCartPreview = (data) => request('app/order/cartPreview', {data})
export const addOrder = (data) => request('app/order/add', {data})
export const orderStatusSet = (data) => request('app/user/order/status/update', {data})

/**
 * 订单列表
 */
export const getOrderList = (data) => request('h5/order/list', {data})
export const getOrderInfo = (data) => request('h5/order/info', {data})

/**
 * 获取code
 */
export const getLoginCode = (data) => request('wx/getlogincode', {data})

/**
 * 获取验证码
 */
export const getCode = (data) => request('common/checktel', {data})

/**
 * 验证验证码
 */
export const testCode = (data) => request('common/checktelcode', {data})

/**
 * 地区
 */
export const getRegion = (data) => request('common/regions', {data})

/**
 * 登陆
 */
export const mlogins = (data) => request('merchant/mlogins', {data})

/**
 * 获取客服热线
 */
export const getRexian = (data) => request('smalls/getrexian', {data})

/**
 * 获取当前登录用户的信息
 */
export const getUserInfo = (data) => request('merchant/minfos', {data})

/**
 * 申请查看
 */
export const applySee = (data) => request('smalls/apply', {data})

/**
 * 验证是否能查看
 */
export const checkApply = (data) => request('smalls/checksmall', {data})

/**
 * 注册
 */
export const mregister = (data) => request('merchant/perfect', {data})

/**
 * 找回密码
 */
export const forget = (data) => request('smalls/forget', {data})

/**
 * 修改密码
 */
export const revisePassword = (data) => request('merchant/mpasswords', {data})

/**
 * 首页
 */
export const getHomepage = (data) => request('smalls/homepage', {data})

/**
 * 推荐商品列表
 */
export const getRecommendGoodsList = (data) => request('smalls/recommendgoodslist', {data})

/**
 * 商品详情
 */
// export const getGoodsInfo = (data) => request('smalls/goodsitem', {data})

// 获取商品属性列表
export const getShopAttr = (data) => request('goodscommon/attrlist', {data})

/**
 * 购物车列表
 */
export const getShopCar = (data) => request('smalls/shopcar', {data})

/**
 * 购物车新增
 */
export const addShopCart = (data) => request('smalls/shopcaradd', {data})

/**
 * 购物车修改
 */
export const editCartNum = (data) => request('smalls/updatecars', {data})

/**
 * 购物车去结算
 */
export const setShopCartBalance = (data) => request('smalls/shopcar/balance', {data})

/**
 * 获取地址详情
 */
export const getAddressInfo = (data) => request('smalls/smallorderaddress/item', {data})

/**
 * 编辑地址
 */
export const editAddress = (data) => request('smallorderaddress/edit', {data})

/**
 * 删除地址
 */
export const delAddAddress = (data) => request('smallorderaddress/del', {data})

/**
 * 设置为默认地址
 */
export const setdefault = (data) => request('smallorderaddress/setdefault', {data})

/**
 * 确认收货
 */
export const confirmOrder = (data) => request('small/confrim/order', {data})

/**
 *  退货订单列表
 */
export const getBackOrderList = (data) => request('smalls/smallbackorders', {data})

/**
 *  退货订单详情
 */
export const getBackOrderInfo = (data) => request('smalls/smallbackorder/item', {data})

/**
 * 取消订单
 */
export const cancelorder = (data) => request('smalls/smallcancelorder', {data})

/**
 * 删除订单
 */
export const delorder = (data) => request('smalls/smalldelorder', {data})

/**
 * 退货申请
 */
export const backapply = (data) => request('smalls/orders/backapply', {data})
