const ValToten = artifacts.require("ValToten.sol");
const Exchange = artifacts.require("Exchange.sol");
module.exports = async function(deployer){
    const accounts = await web3.eth.getAccounts();
    await deployer.deploy(ValToten);
    await deployer.deploy(Exchange,accounts[0], 10);
}