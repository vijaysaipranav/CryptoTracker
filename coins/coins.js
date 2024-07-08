
const coinContainer = document.getElementById("coin-container");
const shimmerContainer = document.querySelector("#shimmer-container");
const coinImage = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinDescription= document.getElementById("coin-description"); 
const coinRank = document.getElementById("coin-rank");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const btnContainer = document.querySelectorAll('.button-container button') // targetting all the buttons inside the button container
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


const coinChart = new Chart(ctx,{
    type:"line",
    data:{
        label:[],// x axis
        datasets:[
            {
                label:"Price (USD)",
                data:[], // y axis
                borderWidth:1,
                borderColor:"#eebc1d",
            }
            

        ]

    },
});

// fetch the chart data from api
const fetchChartData =async (days)=>{
    try {
        const response = await fetch(`${url}${coinId}/market_chart?vs_currency=usd&days=${days}`,options);
        const chartData = await response.json();
        // console.log(chartData.prices);
        updateChart(chartData.prices)

    } catch (error) {
        console.log(error);
    }
}

// Display the chart data
const updateChart =(prices)=>{
    // prices = [timestamp , price]
    // y-axis :data => price, x-axis:labels => timestamp
    const data = prices?.map((price)=>price[1])
    const labels = prices?.map((price)=> {
        let date =new Date(price[0]).toLocaleDateString()
        return date;
    });
    // console.log(data);
    // console.log(labels);
    coinChart.data.labels=labels;
    coinChart.data.datasets[0].data =data;
    coinChart.update();
}

// on btn click fetch the chart data and display it
btnContainer.forEach((btn)=>{
    btn.addEventListener("click",(event)=>{
        const days = event.target.id ==="24hr" ? 1 : event.target.id === "30d" ? 30 : 90;
        fetchChartData(days);
    })
})

document.addEventListener('DOMContentLoaded',async()=>{
    showShimmer()
    await fetchCoinsData(coinId);
    // set 24h as default
    document.getElementById("24hr").click()
    hideShimmer()
})
