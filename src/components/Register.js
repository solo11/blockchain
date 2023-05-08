import { Button, Input, Text, Alert, AlertIcon, Container, Center} from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";

import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'
import { useState } from "react";


export default function Register() {
    const { status, connect, account, chainId, ethereum } = useMetaMask();

    const [isValid, setIsValid] = useState('')

    
        // const web3 = new Web3(ethereum)
        // const networkId =  web3.eth.net.getId();
        // const nftContract = new web3.eth.Contract(PhotoSharingNFT.abi,PhotoSharingNFT.networks[networkId].address)

        // console.log(nftContract)

        function Message ({isValid}) {
            if(isValid == 'noName') {
            return(
                <Alert status='warning'>
                    <AlertIcon />
                    Please enter the usernme
                  </Alert>
            )
            }

            if (isValid == 'alreadyRegistered') {
                return(
                    <Alert status='error'>
                        <AlertIcon />
                        user already registered
                      </Alert>
                )
            }
        }

        async function registerUser(name,ethereum){

            var username = document.getElementById("username").value

            if (username == '') {
                setIsValid('noName')
                return
            }

            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
                try {
            const transaction = await contract.register(username);
            console.log('User registered',transaction)}
            catch (e) {
                setIsValid('alreadyRegistered')
                console.log('User already registered')
                // const transaction = await contract.unregister();
            }
        }

    return( 
        <Center>
        <Container margin={20}>
                <Input margin={5} width={'300px'} type="text" id="username"/>
                <Text>Enter the username</Text>
                <Button margin={5} onClick={() => registerUser('user1',ethereum,account)}>Register </Button>

                <Message isValid={isValid} />
        </Container>
        </Center>
    )
}