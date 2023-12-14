// SPDX-License-Identifier: GPL-3.0
// 限定编译器版本
pragma solidity >=0.4.16 <0.9.0;
// import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
// import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "./SafeMath.sol";
//根据ethereum erc-20协议创建代币
contract ValToten {
    
    using SafeMath for uint256;
    string public name = "ValToten";
    //token标识
    string public symbol = "VAT";
    uint256 public decimals = 18;
    //总供应量
    uint256 public totalSupply;
    //自动生成getter方法
    
    //查询余额
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(){
        totalSupply = 1000000*(10**decimals);
        //创始人收费(部署应用的账号)
        balanceOf[msg.sender] = totalSupply;
    }


    //日志记录
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


    function transfer(address _to, uint256 _value) public returns (bool success){
        //代替了if
        require(_to != address(0)); //判断不为空
        _transfer(msg.sender, _to, _value);
        return true;
    }
    function _transfer(address _from,address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        //触发事件存入交易日志
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        //_spender 第三方交易所
        //msg.sender 当前登录的第一个账号
        //value授权的钱
        require(_spender!=address(0),"target address is null");
        allowance[msg.sender][_spender] = _value;//进行授权
        emit Approval(msg.sender, _spender, _value);//记录日志
        return true;
    }

    //被授权的交易所调用
    function transferFrom(address _from, address _to, uint256 _value) public returns 
    (bool success){
        //from 放款账号
        //to 收款账号
        //msg.sender此时为交易所的账号地址
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}