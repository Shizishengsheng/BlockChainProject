// SPDX-License-Identifier: GPL-3.0
// 限定编译器版本
pragma solidity >=0.4.16 <0.9.0;
import "./SafeMath.sol";
import "./ValToten.sol";

contract Exchange {
    using SafeMath for uint256;

    //收费
    address public feeAccount;
    //费率
    uint256 public feePercent;
    address constant ETHER = address(0);

    mapping(address => mapping(address => uint256)) public tokens;

    //创建订单结构体
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;

        address tokenGive;
        uint256 amountGive;

        uint256 timeStap;
    }

    // _Order[] orderList;
    //存储订单所用数组
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    //删除订单所用数组
    //如，1号订单删除，可以表示为 1:true
    mapping(uint256 => bool) public orderCancel;
    //创建订单所用数组
    mapping(uint256 => bool) public orderFill;

    constructor(address _feeAccount, uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
    //记录日志
    event Deposit(address token, address user, uint256 amount, uint balance);
    event WithDraw(address token, address user, uint256 amount, uint balance);
    //创建订单事件
    event Order(uint256 id,address user,address tokenGet,uint256 amountGet,
    address tokenGive,uint256 amountGive,uint256 timeStap);
    //取消订单事件
    event Cancel(uint256 id,address user,address tokenGet,uint256 amountGet,
    address tokenGive,uint256 amountGive,uint256 timeStap);
    //填充订单事件
    event Trade(uint256 id,address user,address tokenGet,uint256 amountGet,
    address tokenGive,uint256 amountGive,uint256 timeStap);


    //存储以太币
    function depositEther() payable public{
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        // 存入的地址，存入者，存入了多少，当前存入者的余额
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    //存储其他货币
    function depositToken(address _token, uint256 _amount) public{
        require(_token != address(0));
        //首先向当前交易所转钱
        //this指当前合约所在地址，也就是交易行
        require(ValToten(_token).transferFrom(msg.sender, address(this), _amount));
        //接着向挂在当前交易所下的账号添加钱
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        //记录
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //提取以太币
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        //记录
        emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    //提取其他货币
    function withdrawToken(address _token, uint256 _amount) public{
        require(_token != address(0));
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        //进行转账
        require(ValToten(_token).transfer(msg.sender, _amount));
        //记录
        emit WithDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //查询用户在当前交易所的余额
    function balanceOf(address _token, address _user) public view returns (uint256){
        return tokens[_token][_user];
    }
    /*
        流动池
    */
    //makeorder
    function makerOrder(address _tokenGet, uint256 _amountGet, address _tokenGive,
    uint256 _amountGive) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet,
        _tokenGive, _amountGive, block.timestamp);
        //发出订单
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet,
        _tokenGive, _amountGive, block.timestamp);
    }
    //canceloder
    function cancelOrder(uint256 _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        orderCancel[_id] = true;

        emit Cancel(myorder.id, msg.sender,myorder.tokenGet,myorder.amountGet,
        myorder.tokenGive,myorder.amountGive, block.timestamp);
    }
    //fillorder
    function fillOrder(uint256 _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        orderFill[_id] = true;
        //账户余额互换
        //收取小费
        uint256 feeaAmount = myorder.amountGet.mul(feePercent).div(100);
        //msg.sender:购买人
        //myorder.user:创建订单的人
        //tokenGet:创建订单的人想给出的货币
        //tokenGive:创建订单的人得到的货币
        tokens[myorder.tokenGet][msg.sender] = tokens[myorder.tokenGet]
        [msg.sender].sub(myorder.amountGet.add(feeaAmount));
        //小费收益
        tokens[myorder.tokenGet][feeAccount] = tokens[myorder.tokenGet]
        [feeAccount].add(feeaAmount);

        tokens[myorder.tokenGet][myorder.user] = tokens[myorder.tokenGet]
        [myorder.user].add(myorder.amountGet);

        tokens[myorder.tokenGive][msg.sender] = tokens[myorder.tokenGive]
        [msg.sender].add(myorder.amountGive);
        tokens[myorder.tokenGive][myorder.user] = tokens[myorder.tokenGive]
        [myorder.user].sub(myorder.amountGive);

        
        emit Trade(myorder.id, myorder.user,myorder.tokenGet,myorder.amountGet,
        myorder.tokenGive,myorder.amountGive, block.timestamp);
    }
}