const shimmerContainer =document.querySelector("#shimmer-container");
const paginationContainer = document.querySelector("#pagination");
const sortPriceAsc = document.querySelector("#sort-price-asc")
const sortPriceDesc = document.querySelector("#sort-price-desc")
const sortVolumeAsc = document.querySelector("#sort-volume-asc")
const sortVolumeDesc = document.querySelector("#sort-volume-desc")
const searchBox = document.querySelector('#search-box')
const url = 'https://api.coingecko.com/api/v3/coins/markets';
parameters='vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
const options = {
	method: 'GET',
	headers: {
		'x-cg-demo-api-key': 'CG-mDVVqLm5xBDjvcVq523LnAmB',
	}
};
let coins =[]
const itemsPerPage =15;
let currentPage =1;

// fetching the data from the api
const fetchCoins = async () => {
    try {
        const response = await fetch(`${url}?${parameters}`, options);
        const coinsData = await response.json();
        return coinsData
    } catch (error) {
        console.log(error,'error while fetching coins')
    }
    
}
const fetchFavouriteCoins = ()=>{
    return JSON.parse(localStorage.getItem("favourites"))||[]
}
const saveFavourites = (favourites)=>{
    localStorage.setItem("favourites",JSON.stringify(favourites));

}
const handleFavClick = (coinId)=>{
    let favourites = fetchFavouriteCoins();
     // check if already the coinId exists or not
     if(favourites.includes(coinId)){
        favourites=favourites.filter((id)=>id !==coinId);
        saveFavourites(favourites)
     }else{
    favourites.push(coinId);
    console.log(favourites);
    saveFavourites(favourites)
   
     }
    // save the coin id in local
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage);
}
// sort functionality
const sortCoinsByPrice = (order)=>{
    if(order==='asc'){
        coins.sort((a,b)=>a.current_price-b.current_price)
    }else if(order=='desc'){
        coins.sort((a,b)=>b.current_price-a.current_price)
    }
    currentPage=1;
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
    renderPagination(coins)
}
const sortCoinsByVolume = (order)=>{
    if(order==='asc'){
        coins.sort((a,b)=>a.total_volume-b.total_volume)
    }else if(order=='desc'){
        coins.sort((a,b)=>b.total_volume-a.total_volume)
    }
    currentPage=1;
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
    renderPagination(coins)
}
sortPriceAsc.addEventListener("click",()=>{
    sortCoinsByPrice("asc")
})
sortPriceDesc.addEventListener("click",()=>{
    sortCoinsByPrice("desc")
})
sortVolumeAsc.addEventListener("click",()=>{
    sortCoinsByVolume("asc")
})
sortVolumeDesc.addEventListener("click",()=>{
    sortCoinsByVolume("desc")
})

// Search functionality
const handleSearch =()=>{
    const searchQuery = searchBox.value.trim();
    const filteredCoins= coins.filter((coin)=> coin.name.toLowerCase().includes(searchQuery.toLowerCase()));
    currentPage = 1;
    displayCoins(getCoinsToDisplay(filteredCoins,currentPage),currentPage)
    renderPagination(filteredCoins);
}
searchBox.addEventListener("input",handleSearch)


// Loader 
const showShimmer=()=>{
    shimmerContainer.style.display="flex"
};
const hideShimmer =()=>{
    shimmerContainer.style.display="none"
}

// Display coins per page
const getCoinsToDisplay=(coins,page)=>{
    const start=(page-1)*itemsPerPage;
    const end = start +itemsPerPage;
    return coins.slice(start,end);
}

// Pagination 
const renderPagination = (coins)=>{
    const totalPage = Math.ceil(coins.length/itemsPerPage);
    paginationContainer.innerHTML="";
    for(let i=1;i<=totalPage;i++){
        // create buttons == total pages
        const pageBtn =  document.createElement("button");
        pageBtn.classList.add("page-button");
        pageBtn.textContent = i;
        if(i==currentPage){
            pageBtn.classList.add("active");
        }
        pageBtn.addEventListener("click",()=>{
            currentPage = i
            displayCoins(getCoinsToDisplay(coins,currentPage),currentPage);
            updatePaginationButtons()
        })
        paginationContainer.appendChild(pageBtn);
    }
}
const updatePaginationButtons =()=>{
    const pageBtns =document.querySelectorAll(".page-button");
    pageBtns.forEach((btn,index)=>{
        if(index+1==currentPage){
            btn.classList.add("active");
        }else{
            btn.classList.remove("active")
        }
    })
}

// display the data
const displayCoins = (coins,currentPage)=>{
    const start = (currentPage-1)*itemsPerPage+1
    const favourites = fetchFavouriteCoins();

    const tableBody = document.getElementById("crypto-table-body")
    tableBody.innerHTML = '';
    coins.forEach((coin,index) => {
        const row = document.createElement("tr");
        tableBody.appendChild(row);
        const isfavourite = favourites.includes(coin.id)
        row.innerHTML =
        `
        <td>${start+index}</td>
        <td><img src="${coin.image}" alt = "${coin.name}" width="24" height="24"/></td>
        <td>${coin.name}</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>$${coin.total_volume.toLocaleString()}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td><i class = "fa-solid fa-star favourite-icon ${isfavourite ? "favourite":""}" data-id = "${coin.id}""></i></td>
        `
        row.addEventListener("click",()=>{
            window.open(`coins/coin.html?id=${coin.id}`, "_blank");
        })
        row.querySelector(".favourite-icon").addEventListener('click',(event)=>{
            event.stopPropagation();
            handleFavClick(coin.id);

        });
   
    });
}
document.addEventListener('DOMContentLoaded',async()=>{
    try {
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins,currentPage),currentPage);
        renderPagination(coins);
        hideShimmer();
    } catch (error) {
        console.log(error)
        hideShimmer()
        
    }

})



