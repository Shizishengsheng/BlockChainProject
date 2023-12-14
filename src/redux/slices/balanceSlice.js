import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
const balanceSlice = createSlice({
    name:"balance",
    initialState:{
        //需要进行wei转换
        TokenWallet:"0",//钱包中的Token
        TokenExchange:"0",//交易所还剩下多少Token
        EtherWallet:"0",//钱包中的Ether
        EtherExchange:"0",//交易所还剩下多少Ether

    },
    //
    reducers:{
        setTokenWallet(state,action){
            state.TokenWallet = action.payload;
        },
        setTokenExchange(state,action){
            state.TokenExchange = action.payload;
        },
        setEtherWallet(state,action){
            state.EtherWallet = action.payload;
        },
        setEtherExchange(state,action){
            state.EtherExchange = action.payload;
        },
    }

})
export const{setTokenWallet,setTokenExchange,setEtherWallet,setEtherExchange}  = balanceSlice.actions
export default balanceSlice.reducer;

export const loadBalanceData = createAsyncThunk(
    "balance/fetchBalanceData",
    async(data, {dispatch})=>{
        const {
            web3,
            account,
            token,
            exchange,
        } = data;
        //获取钱包的token
        const TokenWallet = await token.methods.balanceOf(account).call();
        // console.log(TokenWallet);
        //更新状态
        dispatch(setTokenWallet(TokenWallet));

        //获取交易所token
        const TokenExchange = await exchange.methods.balanceOf(token.options.address, 
            account).call();
        dispatch(setTokenExchange(TokenExchange));

        //获取钱包的ether
        const EtherWallet = await web3.eth.getBalance(account);
        dispatch(setEtherWallet(EtherWallet));

        //获取交易所ether
        const EtherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
        dispatch(setEtherExchange(EtherExchange));
        // console.log(EtherExchange);
    }
)