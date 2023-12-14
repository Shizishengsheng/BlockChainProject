const ValToten = artifacts.require("ValToten.sol");
// const Exchange = artifacts.require("Exchange.sol");

const fromWei = (bn) =>{
    return web3.utils.fromWei(bn, "ether");
}
const toWei = (number) =>{
    return web3.utils.toWei(number.toString(), "ether");
}

module.exports = async function(callback){
    console.log(11111);
    const valtoten = await ValToten.deployed();
    
    //转账VAT
    const accounts = await web3.eth.getAccounts();
    let res = await valtoten.balanceOf(accounts[0]);
    console.log(res);

    await valtoten.transfer(accounts[1],toWei(100000),{
        from:accounts[0]
    })
    let res1 = await valtoten.balanceOf(accounts[1]);
    console.log(res1);
    callback();
}