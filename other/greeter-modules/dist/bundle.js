(()=>{"use strict";var e="Mr. X",o=function(o,t,n){var c=t||e,r="".concat(o," ").concat(c);return n?"".concat(r.toUpperCase(),"!"):r},t=document.querySelector("#input-firstname"),n=document.querySelector("#output"),c=document.querySelector("#cb-forcefully"),r=document.querySelector("#btn-hello"),l=document.querySelector("#btn-goodbye"),u=c.checked;c.onchange=function(e){return u=e.target.checked},r.onclick=function(){return n.innerHTML=o("Hello",t.value.trim(),u)},l.onclick=function(){return n.innerHTML=o("Goodbye",t.value.trim(),u)},console.log("formatGreeting('Hey There') = ",o("Hey there")),console.log("doubleIt(10) = ",20),console.log("defaultName = ",e),console.log("meaningOfLife = ",42),console.log("temp = ","main.js temp value"),console.log("utils.temp = ","utils.js temp value")})();