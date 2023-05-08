
import {React, useState, useEffect} from "react"


import {BiLike, BiChat, BiShare} from 'react-icons/bi'

import { useMetaMask } from "metamask-react";

import { Card,
    CardFooter,
    Image,
    Heading,
    Stack,
    Text,
    CardBody,
    Button,
    Flex,
    Spacer,
    CardHeader,
    Avatar,
    Box,
    Center,
    Input, 
    FormControl
   
   } from '@chakra-ui/react'

import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'




export default function Home() {

    const[posts,setPosts] = useState(undefined)

    const[posts_final,setPosts_final] = useState(undefined)

    const [updating, setUpdating] = useState(false)

    const[loaded,setLoaded] = useState(false)

    const[loaded_loc,setLoaded_loc] = useState(false)

    const[sellPrice,setSellPrice] = useState('0')

    const[posts_img,setPosts_img] = useState(undefined)

    const[uniquePosts, setUniquePosts] = useState({})

    const [list, setList] = useState([]);

    const [sellValue,setSellValue] = useState();

    const updateAge = (id, age) => {
        console.log(id, age);
        setList(
          list.map((item) => {
            if (item.id === id) {
              return { ...item, age };
            } else {
              return item;
            }
          })
        );
      };

      function handleSell(evt) {
        const value = evt.target.value;
        setSellValue({
          ...sellValue,
          [evt.target.name]: value
        });
      }



    useEffect( () => {


        console.log(loaded)

         // blockchain function get all posts

        const getAllPosts = async () => {

            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
                try {
            const transaction = await contract.getAllNFTs();
            console.log('All NFTS',transaction)
            setPosts(transaction)
            console.log('loading')
            
            const temp = []
            const temp2 = []
            for (let index = 0; index < posts.length; index++) {
                var tokenid = posts[index]['tokenId'].toNumber()
                var price = posts[index]['price'].toNumber()
                var forSale = posts[index]['forSale']
                var cid = posts[index][2];
                var address = posts[index][1];
                var owner = posts[index]['owner'];
                var timestamp = posts[index]['timestamp'].toNumber();
                var bonus = posts[index]['bonus'].toNumber();

                if(bonus == 5) {
                    var unique = true
                } else if (bonus == -5) {
                    var unique = false
                }

                const id =  cid.split("/")
                cid = id[2]
                  let data = await fetch(
                      `https://ipfs.io/ipfs/${cid}/metadata.json`,
                    )
                var js_data = await data.json()
                temp.push({address , js_data, tokenid, price, forSale, owner,timestamp,bonus,unique})
                const image = js_data.image
                temp2.push({address,owner,image,timestamp,tokenid})
                console.log(temp2)
                console.log(new Date(timestamp),cid, tokenid, image)
            }
            setPosts_final(temp)
            setPosts_img(temp2)
            setLoaded(true)
        }
            catch (e) {
                console.log('User already registered')
                // const transaction = await contract.unregister();
            }


        }

        const temp3 = []


        if(posts_final == undefined){
            console.log(posts_final)
            getAllPosts()
            console.log(posts_final)



        }
    },[posts])



          
 // blockchain function update sell price

async function updatePrice(tokenId,bonus,id) {

    var amount = document.getElementById(id).value

    console.log(amount,id)

    amount = parseInt(amount) + parseInt(bonus)

    console.log(bonus,document.getElementsByClassName("price_value").value )

    console.log(tokenId,amount)
    setUpdating(true)
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //Pull the deployed contract instance
    let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
        try {
    const transaction = await contract.sellNFT(tokenId,amount);
    console.log('NFT Selling',transaction)
    setUpdating(false)
    
}
catch(e) {
    console.error(e)
    }
}


 // blockchain function buy nft

async function buyNFT(address,token,price) {

    const ethers = require("ethers");

    console.log('efniefirbr')
    console.log(String(price),token,ethers.utils.parseEther(String(price)) )
    setUpdating(true)
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const options = {value: ethers.utils.parseUnits(String(price), "wei")}

    //Pull the deployed contract instance
    let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
        try {
    const transaction = await contract.buyNFT(token,options);
    console.log('NFT Selling',transaction)
    setUpdating(false)
    window.location.reload();
    
}
catch(e) {
    console.error(e)
    }
}


function SellBuy({val,cid}) {
    const { account } = useMetaMask();

    var token = cid['tokenid']
    var forSale = cid['forSale']

    var address = cid['address']
    var price = cid['price']

    var owner = cid['owner']

    var bonus = cid['bonus']



    if(owner.toLowerCase() == account.toLowerCase()) {

    return(
        <div>
                        { 
                <div> 
                    <FormControl paddingTop={3} >
             <Input width={'150px'}  type="number"  className="price_value" id= {"price_value"+val}/>
              <Button margin={'10px'} variant='solid' colorScheme='blue' onClick={() => {updatePrice(token,bonus,"price_value"+val)}}>
                Sell
              </Button>
              </FormControl>
                </div>
               
            } 

            {updating ? <Text>Updating</Text> : undefined }
        </div>
    )
} else {
    if(price != 0) {
    return (
        <Button variant='solid' colorScheme='blue' onClick={() => {buyNFT(address,token,price)}}>
                  Buy
                </Button>
    )
    }
}
}





function Post({cid,address}) {
    const { account } = useMetaMask();



    console.log(cid)

        var address = cid['address']
        var data = cid['js_data']
        var forSale = cid['forSale']
        var price = cid['price']
        var token = cid['tokenid']

        var owner = cid['owner']
        var unique = cid['unique']
        

        var timestamp = cid['timestamp']

console.log(address,account)

        var ipfsURL = data.image
        console.log(ipfsURL)
        ipfsURL = ipfsURL.split('://')
        
        var image =  'https://ipfs.io/ipfs/' + ipfsURL[1]
        console.log(image)

        return(
            <Center>
            <Card margin='4'  minW={'300px'}>
<CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name={data.username} />

        <Box>
          <Heading size='sm'>{data.username}</Heading>

        </Box>
      </Flex>
    </Flex>
  </CardHeader>

            <CardBody>

              <Stack mt='=4' spacing='3' direction='row'>
                <div style={{maxWidth:'300px'}}>
                <Image
                src={image}
                borderRadius='lg'
              />
              </div>

              <Flex direction='column'>
            <Heading size='md'>{data.name}</Heading>
                <br/>
                <Text  size='md'>
                    {data.description}  
                </Text>

                {!unique ? <Text>Duplicate Image, value depreciated -5</Text> : <Text>Unique Image, value appreciated +5</Text>}

                </Flex>
              </Stack>
            </CardBody>
        <Flex>
            <CardFooter >

                <Spacer />
    <Button flex='1' variant='ghost' leftIcon={<BiLike />}>

    </Button>
    <Button flex='1' variant='ghost' leftIcon={<BiChat />}>

    </Button>
    <Button flex='1' variant='ghost' leftIcon={<BiShare />}>

    </Button>   {price == 0 ?                 <Text p="1" textAlign='right' color='blue.600' fontSize='xl'>
                  Not for sale
                </Text> :                <Text p="1" textAlign='right' color='blue.600' fontSize='xl'>
                  ETH {price}
                </Text>}
 
   
            </CardFooter>
            </Flex>
          </Card>
          </Center> )
        }
    // }


    return(
           <div>



            {posts_final != undefined ? posts_final.map((post,i) => {
                return(
                    <div>
                        <Post key={i} cid={post}/>
                        <SellBuy val={i} key={i} cid={post}/>
                    </div>
                )
                
            }) : undefined}
            {/* <Button onClick={() => {getAllPosts()}}> Get NFTS</Button> */}
           </div> 
    )
}