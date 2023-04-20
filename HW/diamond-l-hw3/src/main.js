import {MyBookmark} from "./myBookmark.js";
import { favorite } from "./favorite.js";
import * as storage from "./storage.js"
/*
const bookmarks = [
    {
      text: "Bing",
      url: "https://www.bing.com",
      comments: "Bing is a web search engine owned and operated by Microsoft."
    },
    {
      text: "Google",
      url: "https://www.google.com",
      comments: "Google Search is a search engine provided and operated by Google."
    },
    {
      text: "DuckDuckGo",
      url: "https://duckduckgo.com/",
      comments: "DuckDuckGo (DDG) is an internet search engine that emphasizes protecting searchers' privacy."
    }
  ];
  window.onload = () => {
    /*
    // Create a MyBookmark and add it to the list
    const bing = document.createElement("my-bookmark");

    // ANOTHER way to set custom attributes, the .dataset property
    // note that these 2 lines of code will also trigger attributeChangedCallback()
    bing.dataset.text = "Bing";
    bing.dataset.url = "https://www.bing.com/";

    const newLI = document.createElement("li");
    newLI.appendChild(bing);
    document.querySelector("#bookmarks").appendChild(newLI);
    //document.querySelector("span").innerHTML = "ZZZ"; //fails because shadow dom keeps spans from being effected
    
    const bookmarkList = document.querySelector("#bookmarks");
    for(let bookmark of bookmarks){
        const newBookmark = document.createElement("my-bookmark");

        newBookmark.dataset.text = bookmark.text;
        newBookmark.dataset.url = bookmark.url;
        newBookmark.dataset.comments = bookmark.comments;

        const newLI = document.createElement("li");
        newLI.appendChild(newBookmark);
        bookmarkList.appendChild(newLI);


    }
  };
*/
let favorites = [];
let favoritesCounter;
let favoriteCount;
let missingText;


//checks if all fields are filled and if so creates a new favorite
const submitClicked = (evt) =>{
  console.log("submitClicked");
  evt.preventDefault();

  let inputBoxes = document.querySelectorAll("input");
  let valuesPresent = true;
  //checks if any of the input values is missing
  for(let inputBox of inputBoxes){
      if(inputBox.value == ""){
        valuesPresent = false;
      }
  }

  if(valuesPresent){
    createBookMarkComponent(document.querySelector("#favorite-text").value.trim(), document.querySelector("#favorite-url").value.trim(), document.querySelector("#favorite-comments").value.trim());
    favoritesCounter.innerHTML = `Number of favorites: ${favorites.length}`
    storage.setFavorites(favorites);

    if( missingText.style.visibility == "visible"){
      missingText.style.visibility = "hidden"
    }
    for(let inputBox of inputBoxes){
     inputBox.value = "";
    }
  }
  else{
    console.log("error missing values")
    missingText.style.visibility = "visible"
  }
  
  return false;
}

//sets necesarry UI functionality and values for later reference
const setupUI = () =>{
  document.querySelector("#favorite-submit-button").onclick = submitClicked;
  document.querySelector("#favorite-cancel-button").onclick = clearFormFields;
  favoritesCounter = document.querySelector("#favorites-counter");
  missingText = document.querySelector("#missing-text")
  missingText.style.visibility = "hidden";
  
}

//clears all input boxes
const clearFormFields = (evt) =>{
  console.log("cancel clicked");

  //gets all input boxes in the form and sets their value to nothing
  let inputBoxes = document.querySelectorAll("input");
  for(let inputBox of inputBoxes){
      inputBox.value ="";
  }

  evt.preventDefault();
  return false
}

//helper method for making a new bookmark based on favorite class
const createBookMarkComponent = (text, url, comments) =>{
  let fav = new favorite(text, url, comments);
  favorites.push(fav);

  const newBookmark = document.createElement("my-bookmark");

        newBookmark.dataset.text = fav.text;
        newBookmark.dataset.url = fav.url;
        newBookmark.dataset.comments = fav.comments;
        newBookmark.callback = deleteFavorite;
        newBookmark.fid = fav.fid;

        const newLI = document.createElement("li");
        newLI.appendChild(newBookmark);

        const bookmarkList = document.querySelector("#bookmarks");
        bookmarkList.appendChild(newLI);

}

//deletes favorite from array and resets local storage
const deleteFavorite = (fid) =>{

  console.log("deleting")
//modification of implimentation found at: https://sentry.io/answers/remove-specific-item-from-array/
  for(let i = 0; i < favorites.length; i++){
    if(favorites[i].fid === fid){
      favorites.splice(i, 1);
    }
  }
  storage.setFavorites(favorites);

  favoritesCounter.innerHTML = `Number of favorites: ${favorites.length}`
}
//loads initial favorites from storage and displays them
const loadFavoritesFromStorage = () =>{
const temp = storage.getFavorites();

  for(let favorite of temp){
    createBookMarkComponent(favorite.text, favorite.url, favorite.comments);
  }
  favoritesCounter.innerHTML = `Number of favorites: ${favorites.length}`
}

window.onload = () => {
setupUI();
loadFavoritesFromStorage();
}