const ValToten = artifacts.require("ValToten.sol");
const Exchange = artifacts.require("Exchange.sol");
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

const fromWei = (bn) =>{
    return web3.utils.fromWei(bn, "ether");
}
const toWei = (number) =>{
    return web3.utils.toWei(number.toString(), "ether");
}

const wait = (seconds) => {
    const milliseconds = seconds *1000;
    return new Promise((resolve) => setTimeout(resolve,milliseconds))
}
module.exports = async function(callback){
    console.log(11111);
    const valtoten = await ValToten.deployed();
    const exchange = await Exchange.deployed();
    const accounts = await web3.eth.getAccounts();
    //step1 accont0->1 10W
    await valtoten.transfer(accounts[1],toWei(100000),{
        from:accounts[0]
    })
    //step2 向交易所存入以太币
    await exchange.depositEther({
        from:accounts[0],
        value:toWei(100)
    })

    await valtoten.approve(exchange.address, toWei(100000),{
        from:accounts[0],
    })
    await exchange.depositToken(valtoten.address, toWei(100000),{
        from:accounts[0],
    })

    //订单
    let orderId =0;
    let res = 0;
    res = await exchange.makerOrder(valtoten.address,toWei(1000),ETHER_ADDRESS,toWei(0.1),{from:accounts[0]});
    orderId = res.logs[0].args.id;
    console.log("create firest order")
    await wait(1)

    res = await exchange.makerOrder(valtoten.address,toWei(2000),ETHER_ADDRESS,toWei(0.2),{from:accounts[0]});
    orderId = res.logs[0].args.id;
    console.log("create second order")
    await wait(1)
    orderId = 2;
    await exchange.fillOrder(orderId, {from:accounts[0]});
    console.log("finish second order")
    callback();
}