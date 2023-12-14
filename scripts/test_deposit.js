const ValToten = artifacts.require("ValToten.sol");
const Exchange = artifacts.require("Exchange.sol");

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
    // await exchange.withdrawEther(toWei(5),{
    //     from:accounts[0],
    // });
    console.log(accounts[1])
    // await exchange.depositEther({
    //     from:accounts[1],
    //     value:toWei(100)
    // });
    // console.log(fromWei(res1));

    //授权
    await valtoten.approve(exchange.address,toWei(100000),{
        from:accounts[1],
    });
    //depositToken(address _token, uint256 _amount)
    await exchange.depositToken(valtoten.address,toWei(100000), {
        from:accounts[1],
    });
    let res = await exchange.tokens(valtoten.address,accounts[0]);
    console.log(fromWei(res));
    callback();
}