import React, { useState } from 'react';
import { Card, Row, Table , Col, Button, Modal, Input} from 'antd';
import {useSelector} from 'react-redux';
import moment from 'moment';

function convetTime(t){
    t=  Number(t);
    return moment(t*1000).format("YYYY/MM/DD");
}

function convert(n){
    //转换为ETH单位
    if(!window.web || !n) return ;
    return window.web.web3.utils.fromWei(n,"ether");
}

function getRenderOrde(order,type){
    if(!window.web) return [];
    const curAccount = window.web.account;
    //去掉已经完成，取消的订单
    let filterIds = [...order.CancelOrders, ...order.FillOrders].map(item => item.id);
    let pendingOrders = order.AllOrders.filter(item => !filterIds.includes(item.id));
    
    //选中当前账户的订单
    if(type === 1){
        return pendingOrders.filter(item => item.user.toLowerCase() === curAccount);
    }else{
        return pendingOrders.filter(item => item.user.toLowerCase() !== curAccount);
    }
    

}

export default function Order(){
    const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
    const order = useSelector(state => state.order);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputValue1, setInputValue1] = useState('');
    // console.log(order)
    const toWei = (number) =>{
        const {web3} = window.web;
        return web3.utils.toWei(number.toString(), "ether");
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        try {
            const valueInWei = toWei(inputValue);
            const valueInWei1 = toWei(inputValue1);
            if (!valueInWei) {
                throw new Error('Invalid input value');
            }
            
            const {exchange, account, token, tokenAddress,exchangeAddress} = window.web;
            
            // Check if the instances are initialized properly
            if (!exchange || !account || !token) {
                throw new Error('Contract instances are not set');
            }
            
            await exchange.methods.makerOrder(tokenAddress,valueInWei,ETHER_ADDRESS,valueInWei1)
            .send({ from: account, gas: '96721975' });
        
            console.log('Create sucess');
            
            // Close the modal on success
            setIsModalOpen(false);
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
    const handleInputChange1 = (e) => {
        const value = e.target.value;
        // 检查当前输入是否为数字
        if (!isNaN(value) || value === '') {
            setInputValue1(value);
        } else {
            console.log("err")
        }
    };
    
    const columns = [
        {
            title: 'Time',
            dataIndex: 'timeStap',
            render:(timeStap) =><b>{convetTime(timeStap)}</b>
        },
        {
            title: 'VAT',
            dataIndex: 'amountGet',
            render:(amountGet) =><b>{convert(amountGet)}</b>
        },
        {
            title: 'ETH',
            dataIndex: 'amountGive',
            render:(amountGive) =><b>{convert(amountGive)}</b>
        },
    ];
    const columns1 =[
        ...columns,
        {
            title: 'Option',
            render:(item) =><Button type ="primary" onClick={() =>{
                // console.log(item.id);
                const {exchange, account} = window.web;
                exchange.methods.cancelOrder(item.id).send({from:account, gas: '96721975' });
            }}>Cancel</Button>
        }
    ];
    const columns2 =[
        ...columns,
        {
            title: 'Option',
            render:(item) =><Button type ="primary" onClick={() =>{
                const {exchange, account} = window.web;
                // console.log("exchange.methods",exchange.methods)
                exchange.methods.fillOrder(item.id).send({from:account, gas: '96721975' });
            }}>Trade</Button>
        }
    ];
    return(
        <div style={{marginTop:"10px"}}>
            <Row>
                <Col span={8}>
                    <Card title="Completed transaction" bordered={false} style={{ margin: 10 }}
                    extra={
                        <div>
                            <Button onClick={showModal}>
                            New order
                            </Button>
                            <Modal title="New a trading order" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                <Input 
                                placeholder="Input VAT you give (VAT)" 
                                value={inputValue} // 将状态变量绑定到输入框的值
                                onChange={handleInputChange} // 设置onChange处理函数来更新状态变量
                                />
                                <Input 
                                placeholder="Input ETH you expect (ETH)" 
                                value={inputValue1} // 将状态变量绑定到输入框的值
                                onChange={handleInputChange1} // 设置onChange处理函数来更新状态变量
                                />
                            </Modal>
                        </div>
                    }>
                        <Table dataSource={order.FillOrders} columns={columns} rowKey={item=>item.id}/>;
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Transacting-my order" bordered={false} style={{ margin: 10 }}>
                    <Table dataSource={getRenderOrde(order,1)} columns={columns1} rowKey={item=>item.id}/>;
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Transacting-others order" bordered={false} style={{ margin: 10 }}>
                    <Table dataSource={getRenderOrde(order,2)} columns={columns2} rowKey={item=>item.id}/>;
                    </Card>
                </Col>
            </Row>
        </div>
    )
}