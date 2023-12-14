import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
const orderSlice = createSlice({
    name:"order",
    initialState:{
        CancelOrders:[],
        FillOrders:[],
        AllOrders:[],
    },
    //
    reducers:{
        setCancelOrders(state,action){
            state.CancelOrders = action.payload;
        },
        setFillOrders(state,action){
            state.FillOrders = action.payload;
        },
        setAllOrders(state,action){
            state.AllOrders = action.payload;
        },
    }

})
export const{setCancelOrders,setFillOrders,setAllOrders}  = orderSlice.actions
export default orderSlice.reducer;

export const loadCancelOrderData = createAsyncThunk(
    "order/fetchCancelOrderData",
    async(data, {dispatch})=>{
        const {exchange} = data;
        // console.log("exchange in the orderslies",exchange.methods.order(1).call())
        const res = await exchange.getPastEvents("Cancel", {
            fromBlock:0,
            toBlock:"latest",
        });
        const cancelOrders = res.map(item => item.returnValues);
        dispatch(setCancelOrders(cancelOrders));
        // console.log(res);
    }
)

export const loadAllOrderData = createAsyncThunk(
    "order/fetchAllOrderData",
    async(data, {dispatch})=>{
        const {exchange} = data;
        const res = await exchange.getPastEvents("Order", {
            fromBlock:0,
            toBlock:"latest",
        });
        const allOrders = res.map(item => item.returnValues);
        dispatch(setAllOrders(allOrders));
    }
)

export const loadFillOrderData = createAsyncThunk(
    "order/fetchFillOrderData",
    async(data, {dispatch})=>{
        const {exchange} = data;
        const res = await exchange.getPastEvents("Trade", {
            fromBlock:0,
            toBlock:"latest",
        });
        const fillOrders = res.map(item => item.returnValues);
        dispatch(setFillOrders(fillOrders));
    }
)


// export const loadBalanceData = createAsyncThunk(
//     "balance/fetchBalanceData",
//     async(data, {dispatch})=>{
//         const {
//             web3,
//             account,
//             token,
//             exchange,
//         } = data;
//         //获取钱包的token
//         const TokenWallet = await token.methods.balanceOf(account).call();
//         // console.log(TokenWallet);
//         //更新状态
//         dispatch(setTokenWallet(TokenWallet));

//         //获取交易所token
//         const TokenExchange = await exchange.methods.balanceOf(token.options.address, 
//             account).call();
//         dispatch(setTokenExchange(TokenExchange));

//         //获取钱包的ether
//         const EtherWallet = await web3.eth.getBalance(account);
//         dispatch(setEtherWallet(EtherWallet));

//         //获取交易所ether
//         const EtherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
//         dispatch(setEtherExchange(EtherExchange));
//         console.log(EtherExchange);
//     }
// )