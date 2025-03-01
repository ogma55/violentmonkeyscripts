// ==UserScript==
// @name        New script american-cosmograph.fr
// @namespace   Violentmonkey Scripts
// @match       https://www.american-cosmograph.fr/les-horaires.html*
// @match       https://www.american-cosmograph.fr/seances*
// @grant       GM_addStyle
// require      https://code.jquery.com/jquery-3.2.1.min.js
// @version     1.0
// @author      -
// @description 2/20/2025, 11:57:06 AM : Ce script récupère les résumé des films à l'affiche lors d'un survol 
// du film sur les pages horaires et séances.
// ==/UserScript==

GM_addStyle ( `
.tooltip{
  opacity:1;
}
.horaire:hover .tooltiptext {
  display:block;
  opacity:1;
}

.tooltiptext {
    width=500px;
    display: none;
    color: black;
    background-color: white;
    margin-left: 28px; /* moves the tooltip to the right */
    margin-top: 15px; /* moves it down */
    position: absolute;
    z-index: 600000;
    opacity:1;
}

.tooltiptext a{
  color: white;
}


 /* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  display: none;
  width: 500px;
  font-size:14px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -250px;

  /* Fade in tooltip */
  opacity: 1;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.horaire:hover .tooltiptext {
  display: block;
  opacity: 1;
  z-index:5000;
}




` );
console.log("Test")



async function main(){
//document.getElementsByClassName("btn")[1].attributes.title
var allFilms = document.querySelectorAll(".film")
var parser = new DOMParser();

for(let i = 0; i<allFilms.length; i++){
  var buttonFilm = allFilms[i].querySelector(".btn")
  var horaireDiv = allFilms[i].querySelector(".horaire")
  //console.log(horaireDiv)

  //console.log(allFilms[i].attributes.title)
  if(buttonFilm.attributes.title != null){
  if(buttonFilm.attributes.title.nodeValue == "détail du film"){

    var filmUrl = "" + buttonFilm.href
    // sleep to avoid 508 error
    updateData4(filmUrl, horaireDiv, map,parser)
    plop = await getValue(filmUrl)
    if(plop == undefined){
          await new Promise(r => setTimeout(r, 50));

    }

  }
  }
}

}
async function updateData4( filmUrl,  horaireDiv, map, parser){

  //var filmUrl = "" + buttonFilm.href
  content = await getValue(filmUrl)
  if(content == undefined || content == null){
    var isPend = await isPending(filmUrl);
    if(isPend == undefined){
      setPending(filmUrl)
    //await new Promise(r => setTimeout(r, 100));
      var response = await fetch(filmUrl)
      var text = await response.text()
      var htmlDocument = parser.parseFromString(text, "text/html");
      content = htmlDocument.documentElement.querySelector(".description.group");
      await setValue(filmUrl,content)
  }else{
    while(content == undefined) {
      await new Promise(r => setTimeout(r, 10));
      content = await getValue(filmUrl)

    }
  }
    //map.set(filmUrl, content);
  }
    horaireDiv.insertAdjacentHTML("beforeend", "<div class=\"tooltip\">Synopsis<div class=\"tooltiptext\">"+content.innerHTML+"</div></div>")
}


async function setValue(key,value){
  map.set(key,value)
}

async function getValue(key){
  return map.get(key)
}

async function isPending(key){
  return map_pending.get(key);
}

async function setPending(key){
  map_pending.set(key,true)
}

async function getData(filmUrl, map){
  if(map.get(filmUrl) == undefined){
    var response = await fetch(filmUrl)
    var text = await response.text()
    map.set(filmUrl, text);
  }
}

map = new Map();
map_pending = new Map();

main();

