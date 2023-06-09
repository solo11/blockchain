
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

import axios from 'axios'


import {Buffer} from 'buffer'




export default function Profile() {

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

    // const handleSell = (e) => {
    //     e.preventDefault()
    //     setSellPrice(e.target.value)
    // }
    
    // function  handleSellPrice(e) {
    //     e.preventDefault()
    //     setSellPrice(e.target.value)
    // }



    useEffect( () => {


        console.log(loaded)
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


    const getIPFSGatewayURL = (ipfsURL)=>{
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        console.log(ipfsGateWayURL)
        return ipfsGateWayURL;
        }

        const getImage = (ipfsURL) => {
            if (!ipfsURL) return
            ipfsURL = ipfsURL.split('://')
            return 'https://ipfs.io/ipfs/' + ipfsURL[1]
          }

          

async function getData(url) {
    
   const id =  url.split("/")
  const  cid = id[2]
  console.log(cid)
    let data = await fetch(
        `https://ipfs.io/ipfs/${cid}/metadata.json`,
      )
      var js_data = await data.json()
      console.log(js_data)
      return js_data
   }

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

async function buyNFT(address,token,price) {

    const ethers = require("ethers");


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

function  handleSellPrice(e) {
    e.preventDefault()
    setSellPrice(e.target.value)
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



async function compareImg(image_c,timestamp_c,images,tokenid) {

    function getBase64(url) {
        return axios
          .get(url, {
            responseType: 'arraybuffer'
          })
          .then(response => Buffer.from(response.data,'binary').toString('base64'))
      }

    var cur_date = new Date(timestamp_c)
    var image1 = image_c

    var token1 = tokenid

    console.log(image_c,)

    for (var i in images) {
        var token2 = images[i].tokenid
        if (token1 != token2) {
        // if (cur_date > new Date(images[i].timestamp))
        // {
            console.log(cur_date,new Date(images[i].timestamp))
            

            var image2 = images[i].image
            var ipfsURL = image2.split('://')
            // ipfsURL = ipfsURL[3].split('/')
            
            var image2 =  'https://ipfs.io/ipfs/' + ipfsURL[1]

            console.log(image_c,image2)

            const img1_buf = await getBase64(image1)
            const img2_buf = await getBase64(image2)

            if (img1_buf == img2_buf) {
                console.log('duplicate', image_c,timestamp_c,images,tokenid)
                
                    console.log('check duplicate', image1,image2, token1)
                
                return true
                
            }

        }

        // }
       
    }
    return false
}


function checkUnique(value) {

    
    for (var k = 0; k < uniquePosts.length; k++) {
        console.log(uniquePosts[k])
        
        if(uniquePosts[k].token1 == value) {
            console.log(uniquePosts[k].token1,uniquePosts[k].val)
            
            return uniquePosts[k].val
            
        } 
        // else 
    }
    return false
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

        // checks for current users nfts
        
        if(owner.toLowerCase() == account.toLowerCase()) { 
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
        }
    // }


    return(
           <div>


<Heading padding={5}>NFT's you own</Heading>
            {posts_final != undefined ? posts_final.map((post,i) => {
                return(
                    <>
                    <div>
                        <Post key={i} cid={post}/>
                        {/* <SellBuy val={i} key={i} cid={post}/> */}
                    </div>
                    </>
                )
                
            }) : undefined}
            {/* <Button onClick={() => {getAllPosts()}}> Get NFTS</Button> */}
           </div> 
    )
}