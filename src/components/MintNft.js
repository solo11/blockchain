import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Box,
    Text,
    Button, TagLabel} from "@chakra-ui/react";
import React, { useState,useEffect } from "react";

import { NFTStorage } from 'nft.storage'

import './upload.css'
import { AttachmentIcon } from "@chakra-ui/icons";

import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'

import axios from 'axios'


import {Buffer} from 'buffer'


export default function UploadPage() {

  const[posts,setPosts] = useState(undefined)

  const[posts_final,setPosts_final] = useState(undefined)

  const [updating, setUpdating] = useState(false)

  const[loaded,setLoaded] = useState(false)

  const[loaded_loc,setLoaded_loc] = useState(false)

  const[sellPrice,setSellPrice] = useState('0')

  const[posts_img,setPosts_img] = useState(undefined)

  const[uniquePosts, setUniquePosts] = useState({})

  const [list, setList] = useState([]);


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

            const id =  cid.split("/")
            cid = id[2]
              let data = await fetch(
                  `https://ipfs.io/ipfs/${cid}/metadata.json`,
                )
            var js_data = await data.json()
            temp.push({address , js_data, tokenid, price, forSale, owner,timestamp})
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


    if(posts_final == undefined){
        console.log(posts_final)
        getAllPosts()
        console.log(posts_final)



    }
    

    for (var k in uniquePosts) {
        if(uniquePosts[k].token1 == 1) {
            console.log(uniquePosts[k].token1)
        } 
    }

},[posts])

const [imageName, setimageName] = useState('')
const [imageDesc, setimageDesc] = useState('')

const [user, setUser] = useState('')

const handleImageName = (e) => setimageName(e.target.value)
const handleImageDesc = (e) => setimageDesc(e.target.value)

const isError = imageName === ''

const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUxRmVjYzcxNThjNThCMzZmOTkzMjdkYkFFREM3ZjQ1NWVkMzU3RDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTc5MjAyOTA0NCwibmFtZSI6ImJjcCJ9.2M10xANG_hQUHZrnwtZ-QNqGFtDD887hEKtL73ldVCQ'

const [uploadedFile, setUploadedFile] = useState();
const [metaDataURL, setMetaDataURl] = useState();
const [txURL, setTxURL] = useState();
const [txStatus, setTxStatus] = useState();
const [imageView, setImageView] = useState();
const [error, setError] = useState();


const handleFileUpload = (event) => {
console.log("file is uploaded");
setUploadedFile(event.target.files[0]);
setTxStatus("");
setImageView("");
setMetaDataURl("");
setTxURL("");

}

const getIPFSGatewayURL = (ipfsURL)=>{
let urlArray = ipfsURL.split("/");
let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
console.log(ipfsGateWayURL)
return ipfsGateWayURL;
}

const getUser = async() => {
    const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
                try {
            const transaction = await contract.getUsername();
            console.log('User registered',transaction)
            if(transaction == 'user not registered') { 
                setUser('') 
                return transaction
            }
            else {
                setUser(transaction)
                return transaction
            }
        }
            catch (e) {
                console.log('User not registered')
                return 
               
            }
}

const uploadNFTContent = async(inputFile,imageName,imageDesc,user) =>{
const nftStorage = new NFTStorage({token: APIKEY,});
try {
    setTxStatus("Uploading NFT to IPFS & Filecoin via NFT.storage.");
    const metaData = await nftStorage.store({
        name: imageName,
        description: imageDesc,
        username: user,
        image: inputFile
    });
    setMetaDataURl(getIPFSGatewayURL(metaData.url));
    console.log(metaData)
    return metaData;

} catch (error) {
    // setError(error);
    console.log(error);
}
}

const mintNFTToken = async(event, uploadedFile,imageName,imageDesc) =>{

const user = await getUser();

if(user == 'user not registered') { 
    console.log('User not registered cannot upload')
    return 
}


if(uploadedFile == undefined) {
    event.preventDefault();
    setError('Please select the file')
    console.log(error)
}
else {
    console.log(error)
event.preventDefault();
const metaData = await uploadNFTContent(uploadedFile,imageName,imageDesc,user);
console.log(metaData)
console.log(error)
const ethers = require("ethers");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

//Pull the deployed contract instance
let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);

const transaction = await contract.uploadPost(metaData.url,metaData.data.name,metaData.data.description);
const res = await transaction.wait()

console.log('NFT Minted tokenid: ',res.events[1].args.tokenid.toNumber())
var tokenid = res.events[1].args.tokenid.toNumber()
console.log(getIPFSGatewayURL(metaData.data.image.pathname))
let similar
var val = assignScore(res.events[1].args.tokenid.toNumber(),getIPFSGatewayURL(metaData.data.image.pathname)).then(function (res) {
  console.log('final',res)
  alterBonus(tokenid,res)
})




previewNFT(metaData);
}
}


const alterBonus = async(tokenid,similar) => {

const ethers = require("ethers");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

//Pull the deployed contract instance
let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);

  if(similar == 'similar')
  {
    const transaction = await contract.depreciate(tokenid);
    var res1 = await transaction.wait()
    if(res1) {
      console.log('value depreciated')
    }
    
  }
  else {
    const transaction = await contract.appreciate(tokenid);
    var res2 = await transaction.wait()
    if(res2) {
      console.log('value appreciated')
    }
  }
}


const assignScore = async (token,image) => {

  function getBase64(url) {
    return axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => Buffer.from(response.data,'binary').toString('base64'))
  }

  var image1 = image
  for (var i in posts_img)
  {
                   var image2 = posts_img[i].image
                    var ipfsURL = image2.split('://')
                    // ipfsURL = ipfsURL[3].split('/')
                    
                    var image2 =  'https://ipfs.io/ipfs/' + ipfsURL[1]

                    console.log(image1,image2)

                    const img1_buf = await getBase64(image1)
                    const img2_buf = await getBase64(image2)

                    if (img1_buf == img2_buf) {
                      console.log('duplicate')                    
                      return 'similar'
                  }
                  else {
                    console.log('unique')
                  }
  }

  return 'not similar'


}

const previewNFT = (metaData) =>{
try {
let imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);;
setImageView(imgViewString);
setMetaDataURl(getIPFSGatewayURL(metaData.url));
setTxStatus("NFT is minted successfully!");
console.log(posts_img)
}
catch (e) {
    // setError('File error :')
}
}

return (
<center>
<div>
<Text paddingTop={7} >Upload Image</Text>
<Box backgroundColor={'grey-500'} margin={10} padding={7} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>  
<form>
<FormControl isRequired>
<FormLabel fontSize={15}>Image Name</FormLabel>
<Input type='text' value={imageName} onChange={handleImageName} />
{!isError ? (
  <FormHelperText>
    Name of the image
  </FormHelperText>
) : (
  <FormErrorMessage>Image name is required.</FormErrorMessage>
)}
</FormControl>

<FormControl paddingTop={3} isRequired>
<FormLabel fontSize={15}>Image Description</FormLabel>
<Input type='text' value={imageDesc} onChange={handleImageDesc} />
{!isError ? (
  <FormHelperText>
    Description of the image
  </FormHelperText>
) : (
  <FormErrorMessage>Image description is required.</FormErrorMessage>
)}
</FormControl>

<FormControl paddingTop={3} isRequired>
<FormLabel   className="label-file" fontSize={15}>Choose image

<Input className="input-file" type="file" onChange={handleFileUpload}  />
<AttachmentIcon marginLeft={2}/>

</FormLabel>

{!isError ? (
  <FormHelperText>
    choose the image file
  </FormHelperText>
) : (
  <FormErrorMessage>Image is required.</FormErrorMessage>
)}
</FormControl> 


</form>
<Button style={{marginTop:20}} onClick={e=>mintNFTToken(e, uploadedFile,imageName,imageDesc)}>Mint NFT</Button>
{imageView && <img className='NFTImg' src={imageView} alt="NFT preview"/>}   
</Box>
</div>
</center>
)
}
