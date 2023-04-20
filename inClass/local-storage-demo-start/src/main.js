import * as storage from "./storage.js"
let items = ["???!!!"];


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ul>
const showItems = () =>{
    let html = "";
    for(let item of items){
        html += `<li>${item}</li>`
    }
    document.querySelector("ol").innerHTML = html;
}
// II. declare and implement addItem(str)
// - this will add str to the items array (so long as str is length 0 or greater)
const addItem = (str) =>{
    if(str.length > 0){
        items.push(str);
    }
    storage.setFavorites(items);
    showItems();
}
// III. declare and implement loadItemsFromLocalStorage()
// - this will load in the favorites array from storage.js
const loadItemsFromLocalStorage = () =>{
items = storage.getFavorites();
}
// Also:
// - be sure to update the <ol> as appropriate
// - be sure to update .localStorage by saving items to .localStorage when appropriate (look in storage.js to see where/how to do this)
window.onload = () =>{
loadItemsFromLocalStorage();

    document.querySelector("#btn-add").onclick = () =>{
        addItem(document.querySelector("#thing-text").value);
    }
    showItems();
}