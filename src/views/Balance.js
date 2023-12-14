import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
// import { setTokenWallet } from '../redux/slices/balanceSlice';
import { Card, Col, Row, Statistic, Button, Modal , Popover, Input  } from 'antd';
import {
    WalletOutlined,
    BankOutlined,
  } from '@ant-design/icons';
function convert(n){
    //转换为ETH单位
    if(!window.web) return ;
    return window.web.web3.utils.fromWei(n,"ether");
}
export default function Balance(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const showModal = () => {
        setIsModalOpen(true);
    };
    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    
    // const fromWei = (bn) =>{
    //     return window.web.utils.fromWei(bn, "ether");
    // };
    const toWei = (number) =>{
        const {web3} = window.web;
        return web3.utils.toWei(number.toString(), "ether");
    };
    const handleOk = () => {
        setIsModalOpen(false);
        // 这里可以处理inputValue，例如发送到服务器或进行验证等
        console.log('Input value:', inputValue);
        const valueInWei = toWei(inputValue);
        const {exchange, account} = window.web;
        exchange.methods.depositEther().send({
            from:account,
            value:valueInWei
        });
    };

    const handleOk2 = async () => {
        try {
            const valueInWei = toWei(inputValue2);
            if (!valueInWei) {
                throw new Error('Invalid input value');
            }
            
            const {exchange, account, token, tokenAddress,exchangeAddress} = window.web;
            
            // Check if the instances are initialized properly
            if (!exchange || !account || !token) {
                throw new Error('Contract instances are not set');
            }
    
            // Approve the transaction
            await token.methods.approve(exchangeAddress, valueInWei).send({ from: account });
            console.log('Approval transaction: ');
    
            // Deposit the token after approval
            await exchange.methods.depositToken(tokenAddress, valueInWei).send({ from: account });
            console.log('Deposit transaction: ');
            
            // Close the modal on success
            setIsModalOpen2(false);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        // 检查当前输入是否为数字
        if (!isNaN(value) || value === '') {
            setInputValue(value);
        } else {
            console.log("err")
        }
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    const handleInputChange2 = (e) => {
        const value = e.target.value;
        // 检查当前输入是否为数字
        if (!isNaN(value) || value === '') {
            setInputValue2(value);
        } else {
            console.log("err")
        }
    };
    const {
        TokenWallet,
        TokenExchange,
        EtherWallet,
        EtherExchange,
    } = useSelector(state => state.balance)

    const dispatch = useDispatch()
    return(
        <Row gutter={24}>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic
                    title={[
                        <Popover title="Ether in the metamask">
                        <Button type="primary" size ={"large"} icon={<WalletOutlined />}>ETH</Button>
                        </Popover>
                    ]}
                    value={convert(EtherWallet)}
                    precision={6}
                    // valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
            </Col>

            <Col span={6}>
                <Card bordered={true}>
                    <Statistic
                    title={[
                        <Popover title="ValToken in the metamask">
                        <Button type="primary" size ={"large"} icon={<WalletOutlined />}>VAT</Button>
                        </Popover>
                    ]}
                    value={convert(TokenWallet)}
                    precision={6}
                    />
                </Card>
            </Col>

            <Col span={6}>
                <Card bordered={true}>
                    <Statistic
                    title={[
                        <Popover title="Ether in the metamask">
                        <Button type="primary" size ={"large"} icon={<BankOutlined/>}>ETH</Button>
                        </Popover>
                    ]}
                    value={convert(EtherExchange)}
                    precision={6}
                    />
                    
                    <Button onClick={showModal}>
                        Deposite
                    </Button>
                    <Modal title="Deposite to the exchange center" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <Input 
                        placeholder="Input amount (ETH)" 
                        value={inputValue} // 将状态变量绑定到输入框的值
                        onChange={handleInputChange} // 设置onChange处理函数来更新状态变量
                        />
                    </Modal>
                </Card>
            </Col>

            <Col span={6}>
                <Card bordered={true}>
                    <Statistic
                    title={[
                        <Popover title="ValToken in the metamask">
                        <Button type="primary" size ={"large"} icon={<BankOutlined />}>VAT</Button>
                        </Popover>
                    ]}
                    value={convert(TokenExchange)}
                    precision={6}
                    />

                    <Button onClick={showModal2}>
                        Deposite
                    </Button>
                    <Modal title="Deposite to the exchange center" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}>
                        <Input 
                        placeholder="Input amount (VAT)" 
                        value={inputValue2} // 将状态变量绑定到输入框的值
                        onChange={handleInputChange2} // 设置onChange处理函数来更新状态变量
                        />
                    </Modal>
                </Card>
            </Col>
        </Row>
    )
}