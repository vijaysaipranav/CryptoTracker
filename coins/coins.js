
const coinContainer = document.getElementById("coin-container");
const shimmerContainer = document.querySelector("#shimmer-container");
const coinImage = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinDescription= document.getElementById("coin-description"); 
const coinRank = document.getElementById("coin-rank");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const ctx =document.getElementById("coinChart")

const url = 'https://api.coingecko.com/api/v3/coins/';
const options = {
	method: 'GET',
	headers: {
		'x-cg-demo-api-key': 'CG-mDVVqLm5xBDjvcVq523LnAmB',
	}
};
const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get('id');

const fetchCoinsData = async (coinId)=>{
    try {
       
        const response = await fetch(`${url}${coinId}`, options);
        const coinsData = await response.json();
        displayCoinsData(coinsData)
       
    } catch (error) {
        console.log(error,'error while fetching coins')
    }
}

// loader
const showShimmer=()=>{
    shimmerContainer.style.display="flex"
    coinContainer.style.display="none"
};
const hideShimmer =()=>{
    shimmerContainer.style.display="none"
    coinContainer.style.display=""
}

const displayCoinsData = (coinsData)=>{
   
    coinImage.src = coinsData.image.large;
    coinImage.alt= coinsData.name;
    coinDescription.textContent = coinsData.description.en.split(".")[0];
    coinRank.textContent=coinsData.market_cap_rank;
    coinName.textContent=coinsData.name;
    coinPrice.textContent= `$${coinsData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent=`$${coinsData.market_data.market_cap.usd.toLocaleString()}`;
 
}


// const coinChart = new CharacterData(ctx,{
//     type:"line",
//     data:{
//         label:[],
//         datasets:[

//         ]

//     }
// })
document.addEventListener('DOMContentLoaded',async()=>{
    showShimmer()
    await fetchCoinsData(coinId);
    hideShimmer()
})
