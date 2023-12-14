const ValToten = artifacts.require("ValToten.sol");
const Exchange = artifacts.require("Exchange.sol");
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

const fromWei = (bn) =>{
    return web3.utils.fromWei(bn, "ether");
}
const toWei = (number) =>{
    return web3.utils.toWei(number.toString(), "ether");
}

module.exports = async function(callback){
    console.log(11111);
    const valtoten = await ValToten.deployed();
    const exchange = await Exchange.deployed();
    const accounts = await web3.eth.getAccounts();
    
    //创建订单
    //0 - >1 10W VAT
    // await valtoten.transfer(accounts[1],toWei(100000),{
    //     from:accounts[0],
    // })
    let res0 = await valtoten.balanceOf(accounts[0]);
    console.log("acc[0] 钱包中VAT:", fromWei(res0));
    let res4 = await valtoten.balanceOf(accounts[1]);
    console.log("acc[1] 钱包中VAT:", fromWei(res4));
    let res1 = await exchange.tokens(ETHER_ADDRESS, accounts[1])
    console.log("acc[1] 在交易所的ETH:", fromWei(res1));
    let res2 = await exchange.tokens(valtoten.address, accounts[1])
    console.log("acc[1] 在交易所VAT:", fromWei(res2));


    callback();
}