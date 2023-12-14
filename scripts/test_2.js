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
    
    //交易所存款ETH
    // const valueInWei = toWei("10");
    // await exchange.depositEther({
    //     from:accounts[0],
    //     value:valueInWei
    // });

    //交易所存款VAT
    //先授权
    await valtoten.approve(exchange.address, toWei(100000),{
        from: accounts[0]
    }) 
    //再交易
    await exchange.depositToken(valtoten.address, toWei(100000),{
        from: accounts[0]
    })


    callback();
}