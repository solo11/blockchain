import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    PopoverHeader,
    PopoverCloseButton,
    Link,
    Text,
    Alert,
    AlertIcon
  } from '@chakra-ui/react';
  import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
  
  import { useMetaMask } from "metamask-react";
  import { IconCus } from './dist/icon';
  import { Link as RouterLink } from 'react-router-dom';


import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'
import { useState } from 'react';
  

  export default function Nav() {
     
      const { status, connect, account, chainId, ethereum } = useMetaMask();

      const [admin, setAdmin] = useState(false)

      const [pauseC, setPause] = useState(false)

      const checkAdmin = async () => {
        const ethers = require("ethers");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

//Pull the deployed contract instance
let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);

var address = await contract.getAdmin()

console.log(account,address)
if (account.toLocaleLowerCase() == address.toLocaleLowerCase()) {
  return true
}else {return false}
      }


      const pause = async () => {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        //Pull the deployed contract instance
        let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);

        try {
          await contract.pauseContract()
          setPause(true)

        }
        catch (e) {
          console.error(e)
        }
      }

      const unpause = async () => {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        //Pull the deployed contract instance
        let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);

        try {
          await contract.unpauseContract()
          setPause(false)
        }
        catch (e) {
          console.error(e)
        }
      }
  
      function Metamask() {
        
          if(status === "notConnected") return (
              <Button variant='outline'  fontSize={15} onClick={connect} leftIcon={<IconCus />}>
              Connect
              </Button>
            
          )        
    
          if (status === "connecting") return <div>Connecting...</div>
      
          if (status === "connected") return (
              <Popover>
    <PopoverTrigger>
      <Button variant='outline' fontSize={15} leftIcon={<IconCus />}>
          Connected</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Connected</PopoverHeader>
      <PopoverBody>To Account {account}</PopoverBody>
    </PopoverContent>
  </Popover>
          )
          return null
      } 


  
    const { colorMode, toggleColorMode } = useColorMode();
    var val =  checkAdmin().then(function(res) {
      setAdmin(res)
      console.log(admin)
    })

    return (
      <>
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <RouterLink  to="/home" > 
            <Box>Logo</Box>
            </RouterLink>
  
            <Flex alignItems={'center'}>
              <Stack direction={'row'} spacing={7}>

                <RouterLink  to="/home" >
                  <Link>
                  <Text paddingTop={'8px'}>
                    Home
                  </Text>
                  </Link>
                </RouterLink>

                <RouterLink  to="/profile" >
                  <Link>
                  <Text paddingTop={'8px'}>
                    Profile
                  </Text>
                  </Link>
                </RouterLink>

                <RouterLink  to="/upload" >
                  <Link>
                  <Text paddingTop={'8px'}>
                    Upload
                  </Text>
                  </Link>
                </RouterLink>

                <RouterLink  to="/register" >
                  <Link>
                  <Text paddingTop={'8px'}>
                    Register
                  </Text>
                  </Link>
                </RouterLink>

                {
                  admin ? <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Contract
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => {pause()}}>Pause</MenuItem>
                    <MenuItem onClick={() => {unpause()}}>Unpause</MenuItem>
                  </MenuList>
                </Menu> : undefined
                }


                <Button onClick={toggleColorMode}>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>
                
          <Metamask />

              </Stack>
            </Flex>
          </Flex>
        </Box>
{pauseC ?        <Alert status='error'>
                    <AlertIcon />
                    The contract is paused, the dapp is not operational
                  </Alert> : undefined}

      </>
    );
  }