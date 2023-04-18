import {MyBookmark} from "./myBookmark.js";
import { favorite } from "./favorite.js";
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
    createBookMarkComponent(document.querySelector("#favorite-text").value, document.querySelector("#favorite-url").values, document.querySelector("#favorite-comments").value)

  }
  else{
    console.log("error missing values")
  }
  
  return false;
}

const setupUI = () =>{
  document.querySelector("#favorite-submit-button").onclick = submitClicked;
  document.querySelector("#favorite-cancel-button").onclick = clearFormFields;
  favoritesCounter = document.querySelector("#favorites-counter");
  
}

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

const createBookMarkComponent = (text, url, comments, fid) =>{
  const newBookmark = document.createElement("my-bookmark");

        newBookmark.dataset.text = text;
        newBookmark.dataset.url =url;
        newBookmark.dataset.comments = comments;
        newBookmark.callback = deleteFavorite;
        newBookmark.fid = fid;
         

        const newLI = document.createElement("li");
        newLI.appendChild(newBookmark);

        const bookmarkList = document.querySelector("#bookmarks");
        bookmarkList.appendChild(newLI);

}

const deleteFavorite = (fid) =>{

  console.log("deleting")
//modification of implimentation found at: https://sentry.io/answers/remove-specific-item-from-array/
  for(let i = 0; i < favorites.length; i++){
    if(favorites[i].fid === fid){
      favorites.splice(i, 1);
    }
  }
  
  favoritesCounter.innerHTML = `Number of favorites: ${favorites.length}`
}

const loadFavoritesFromStorage = () =>{
  for(let favorite of favorites){
    createBookMarkComponent(favorite.text, favorite.url, favorite.comments, favorite.fid);
  }
  favoritesCounter.innerHTML = `Number of favorites: ${favorites.length}`
}

window.onload = () => {
  setupUI();
favorites.push(new favorite("RIT", "https://www.rit.edu", "A private university located near Rochester, NY."));
loadFavoritesFromStorage();







}