// ==UserScript==
// @name        abc
// @namespace   Violentmonkey Scripts
// @match       https://abc-toulouse.fr/horaires.html*
// require      https://code.jquery.com/jquery-3.2.1.min.js
// @version     1.0
// @author      -
// @description 2/20/2025, 11:57:06 AM
// ==/UserScript==




async function main(){
//document.getElementsByClassName("btn")[1].attributes.title
var allFilms = document.querySelectorAll(".a_linktofilm")
var parser = new DOMParser();

for(let i = 0; i<allFilms.length; i++){


    var filmUrl = "" + allFilms[i].href
    // sleep to avoid 508 error
    updateData4(filmUrl, allFilms[i], map,parser)
    plop = await getValue(filmUrl)
    if(plop == undefined){
          await new Promise(r => setTimeout(r, 50));

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
      content = htmlDocument.documentElement.querySelector(".introtexttxt");
      await setValue(filmUrl,content)
  }else{
    while(content == undefined) {
      await new Promise(r => setTimeout(r, 10));
      content = await getValue(filmUrl)

    }
  }
  }
    horaireDiv.insertAdjacentHTML("afterend", "<div class=\"linktofilm\">"+content.innerHTML+"</div>")
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

