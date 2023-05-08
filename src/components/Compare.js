import axios from 'axios'
import { useEffect } from 'react'

import {Buffer} from 'buffer'

// import looksSame from 'looks-same';



// const numDiffPixels = pixelmatch(img1_buf, img2_buf, null, {threshold: 0.1});
// console.log(numDiffPixels)

export default function Compare() {


function getBase64(url) {
    return axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => Buffer.from(response.data,'binary').toString('base64'))
  }

useEffect(() => {


async function compare() {

  const pixelmatch = require('pixelmatch');

        var image1 = "https://bafybeic7tmtyxou7i457ghb7hnnriqrikjndneqj4pyoujfuu54tx5ippa.ipfs.dweb.link/Brown Minimalist Birthday Party Invitation (1).png"
        var image2 = "https://ipfs.io/ipfs/bafybeib5cjqv2c5qi4n52i4fyifqwuenubvf7oiti5bteczoahgvsoqvrm/check.png"
        
            const img1_buf = await getBase64(image1)
            const img2_buf = await getBase64(image2)

            // console.log('compare',img1_buf,img2_buf)
            var uint8View_1 = new Uint8Array(img1_buf);
            var uint8View_2 = new Uint8Array(img2_buf);

            console.log('img1', img1_buf)
            console.log('img2',img2_buf)
             if(img1_buf==img2_buf) {
              console.log('similar')
             }
             else {
              console.log('not similar')
             }

            // console.log('compare', uint8View_1.toString(),uint8View_2)

          //  var dist  = pixelmatch(img1_buf, img2_buf, 'null', {threshold: 0.1});
            // console.log('compare',dist)
          }

        compare();
},[])




    return(
        <div></div>
    )
}