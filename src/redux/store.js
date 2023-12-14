import {configureStore} from '@reduxjs/toolkit'
import balanceSlice from './slices/balanceSlice'
import orderSlice from './slices/orderSlice'

const store = configureStore({
    reducer:{
        //余额
        balance:balanceSlice,
        //订单
        order:orderSlice,
    },
    middleware:getDefaultMiddleware => getDefaultMiddleware({
        //关闭redux序列化检测
        serializableCheck:false
    })

})
export default store