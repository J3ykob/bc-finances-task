
import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {ethers} from 'ethers';
import SalaryContract from '../utils/abi/Salary.json';

import { Login } from '../utils/login'

const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(0, rgba(182,214,233,1) 0%, rgba(255,255,255,1) 64%);

`
const AccountAmount = styled.span`
    width: 100%;
    height: 200px;
    font-size: 40px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ContractsContainer = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ContractContainer = styled.div<any>`
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-color: ${props => props.toSell ? 'red' : 'lime'};
    background-shadow: 1px 1px 1px;
    margin: 10px;
    border-radius: 12px;
`
const SellButton = styled.button`
    width: 
`

type Contract = {
    salary: number;
    date: number;
    to_sell: boolean;
}

const ContractElement = (props: {data: Contract, contract: ethers.Contract, id: number}) => {

    const sellContract = async () => {
        await props.contract.sellContract(props.id)
    }

    return (
        <ContractContainer toSell={props.data.to_sell}>
            <span>value: {props.data.salary}</span>
            <SellButton onClick={sellContract}>Sell contract</SellButton>
        </ContractContainer>
    )
}


const UserView = () => {
    const [provider, setProvider] = useState<any>(null);
    const [contractsData, setContractsData] = useState<Contract[]>([])
    const [balance, setBalance] = useState<any>(null);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    
    useEffect(()=>{
        async function f(){
            if(!provider){;
                const p:any = await Login()
                console.log(p);
                setProvider(p);
            }
        }
        f();
    });

    const contract: any = useMemo(()=>{
        if(!provider)return;
        return new ethers.Contract(contractAddress, SalaryContract.abi, provider.getSigner());
    },[contractAddress,provider]);

    useEffect(()=>{
        async function f(){
            const addr = await provider.getSigner().getAddress();
            const c = await contract?.getAddressContracts(addr)
            console.log(c)
            setContractsData(c);
            const b = await provider.getBalance(await provider.getSigner().getAddress())
            console.log(b)
            setBalance(b)
        }
        f();
    }, [contract,provider])

    return (
        <MainContainer>
            <AccountAmount>Account balance: {parseInt(balance)}</AccountAmount>
            <ContractsContainer>
                {(contractsData.length && contractsData.map((c, index) => {
                    return c.date > 0 ? <ContractElement data={c} id={index} contract={contract} key={index}/> : null;
                })) || "you have no active contracts :("}
            </ContractsContainer>
        </MainContainer>
    )
};

export default UserView;