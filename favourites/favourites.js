const shimmerContainer =document.querySelector("#shimmer-container");
const noFavMsg =document.querySelector("#no-favourtites")
const tableBody = document.getElementById("fav-table-body")
const favTable = document.getElementById("favourite-table")
const url = 'https://api.coingecko.com/api/v3/coins/markets';
const options = {
	method: 'GET',
	headers: {
		'x-cg-demo-api-key': 'CG-mDVVqLm5xBDjvcVq523LnAmB',
	}
};
const getFavouriteCoins = ()=>{
    return JSON.parse(localStorage.getItem("favourites"))||[]
}

const fetchFavCoins = async (coinIds) => {
    try {
        const response = await fetch(`${url}?vs_currency=usd&ids=${coinIds.join(",")}`, options);
        const coinsData = await response.json();
        return coinsData
    } catch (error) {
        console.log(error,'error while fetching coins')
    }
    
}
const displayFavCoins =(favCoins)=>{
    if(favCoins.length>0){
        noFavMsg.style.display="none";
        tableBody.innerHTML = '';
        favCoins.forEach((coin,index) => {
            const row = document.createElement("tr");
            tableBody.appendChild(row);
            row.innerHTML =
            `
            <td>${index+1}</td>
            <td><img src="${coin.image}" alt = "${coin.name}" width="24" height="24"/></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            `
            row.addEventListener("click",()=>{
                window.open(`../coins/coin.html?id=${coin.id}`, "_blank");
            })
       
        });
    }else{
        noFavMsg.style.display="block";
        favTable.style.display="none";

    }
    
}
// Loader 
const showShimmer=()=>{
    shimmerContainer.style.display="flex"
};
const hideShimmer =()=>{
    shimmerContainer.style.display="none"
}

document.addEventListener('DOMContentLoaded',async()=>{
    try {
        showShimmer();
        const favourites= getFavouriteCoins(); //Gets the Fav list from local storage
        if(favourites.length>0){
            const favouriteCoins = await fetchFavCoins(favourites);
            displayFavCoins(favouriteCoins)

        }else{
            displayFavCoins([])
        }
        hideShimmer();
    } catch (error) {
        console.log(error)
        hideShimmer()
        
    }

})