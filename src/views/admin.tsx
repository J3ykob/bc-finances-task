
import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {ethers} from 'ethers';
import SalaryContract from '../utils/abi/Salary.json'

import { Login } from '../utils/login'

const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background: linear-gradient(0, rgba(182,214,233,1) 0%, rgba(255,255,255,1) 64%);

`
const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 400px;
    padding: 10px;
    height: 400px;
    margin-top:150px;
`
const FormLabel = styled.span`
    width: 100%;
    margin-top: 50px;
`
const FormInput = styled.input`
    width: 100%;
    height: 30px;
    margin-top: 15px;
`
const FormButton = styled.button`
    width: 100%;
    height: 30px;
    color: white;
    background-color:#51c460;
    border: none;
    border-radius 20px;
    font-weight: bold;
    box-shadow: 1px 1px 1px black;
    margin: 40px;
    &:hover {
        cursor: pointer;
        box-shadow: 1px 2px 1px black;
    }
`
const ExecuteAllContractsButton = styled.button`
    width: 400px;
    height: 30px;
    color: white;
    background-color:red;
    border: none;
    border-radius 20px;
    font-weight: bold;
    box-shadow: 1px 1px 1px black;
    &:hover {
        cursor: pointer;
        box-shadow: 1px 2px 1px black;
    }

`


type Contract = {
    address: string;
}


const UserView = () => {
    const address = useRef<any>(null);
    const salary = useRef<any>(null);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const [provider, setProvider] = useState<any>(null);
    
    useEffect(()=>{
        console.log(provider)
        if(provider != null) return;
        async function f(){
            const p:any = await Login()
            console.log(p);
            setProvider(p);
        }
        f();
    },[provider]);

    const mintNewContract = async () => {
        if(!provider) return;
        console.log('minting...')
        try{
            const contract = new ethers.Contract(contractAddress, SalaryContract.abi, provider.getSigner());
            await contract.createContract(address.current?.value, salary.current?.value, Date.now());
            console.log('Success!')
            const owners = await contract.getOwnersList();
            console.log("Owners list:", owners);
            const contracts = await contract.getAddressContracts(address.current?.value)
            console.log("These are the address' contracts:", contracts)
        }catch(err){
            console.log(err)
        }  
    }

    const executeAllContracts = async () => {
        if(!provider) return;
        console.log('executing all contracts...')
        try {
            const contract = new ethers.Contract(contractAddress, SalaryContract.abi, provider.getSigner());
            await contract.executeAllContracts({value: 10000000});
            console.log('SUCCESS!')
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <MainContainer>
            <FormContainer>
                <FormLabel>Employee Address</FormLabel>
                <FormInput ref={address}/>
                <FormLabel>Employee's Salary</FormLabel>
                <FormInput ref={salary}/>
                <FormButton onClick={mintNewContract}>Mint New Contract</FormButton>
            </FormContainer> 
            <ExecuteAllContractsButton onClick={executeAllContracts}>Execute All Contracts!</ExecuteAllContractsButton>
        </MainContainer>
    )
};

export default UserView;