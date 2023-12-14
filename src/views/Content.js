import {useEffect} from 'react';
import Web3 from 'web3';
import tokenjson from '../build/ValToten.json';
import exchangejson from '../build/Exchange.json';
import Order from './Order';
import Balance from './Balance';
import { loadBalanceData } from '../redux/slices/balanceSlice';
import { loadAllOrderData, loadCancelOrderData, loadFillOrderData } from '../redux/slices/orderSlice';
import { useDispatch } from 'react-redux';

export default function Content(){
    const dispatch = useDispatch()
    useEffect(() =>{
        async function start(){
            //1.获取合约
            const web = await initWeb();
            //设置全局对象
            window.web = web;
            // console.log(web);
            //2.获取资产信息
            dispatch(loadBalanceData(web))
            //3.获取订单信息
            dispatch(loadCancelOrderData(web))
            dispatch(loadAllOrderData(web))
            dispatch(loadFillOrderData(web))
        }
        start()
    },[dispatch])

    async function initWeb(){
        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        //获取账户
        // window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log(accounts);

        // let accounts = await web3.eth.getAccounts();
        // console.log(accounts);

        // step1 获取token的json
        const tokenAbi = tokenjson.abi;
        //获取networkID
        const networkId = await web3.eth.net.getId();
        // 通过networkId获得address
        const tokenAddress = tokenjson.networks[networkId].address;
        const token = await new web3.eth.Contract(tokenAbi,tokenAddress);
        
        // step1 获取交易所的json
        const exchangeAbi = exchangejson.abi;
        const exchangeAddress = exchangejson.networks[networkId].address;
        const exchange = await new web3.eth.Contract(exchangeAbi,exchangeAddress);
        // console.log("tokenAddress",tokenAddress)
        return {
            web3,
            account:accounts[0],
            token,
            tokenAddress,
            exchange,
            exchangeAddress,
        }
    }

    return(
        <div>
            <Balance></Balance>
            <Order></Order>
        </div>
    )
}