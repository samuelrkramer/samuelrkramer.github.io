// console.log("test, custom is loaded");

const body = document.body;
const menu = document.getElementById("menu");
const modalLink = document.getElementById("modalLink");
const menuContents = menu.innerHTML;

const listenProjs = () => {
  // console.log("listenProjs fired");
  const projLinks = document.querySelectorAll('.projLink');
  for (let el of projLinks) {
    // console.log(el);
    el.addEventListener("click", projClickHandler(el.href));
    fetch(`${el.href}api/wakeup`, {mode: 'no-cors'}); //wake them all up now
  }

  const modalPlease = document.getElementById("modalPlease");
  modalPlease.addEventListener("click", e => {
    e.preventDefault();
    window.alert("Okay, but you have to close it manually! It's not doing anything this time");
    menu.innerHTML = document.getElementById("modal").innerHTML;
    body.classList.add("is-menu-visible");
  });
}

const projClickHandler = url => {
  return async e => {
    e.preventDefault();
    // console.log("projClickHandler fired for url", url);
    modalLink.href = url;
    const modalContents = document.getElementById("modal").innerHTML;
    menu.innerHTML = modalContents;
    body.classList.add('is-menu-visible');
    const interval = setInterval(() => {
      // console.log("interval checking for closed modal")
      if (!body.classList.contains("is-menu-visible")) {
        // console.log("modal closed!");
        menu.innerHTML = menuContents;
        clearInterval(interval);
      }
    }, 250)
    // console.log(e.target);
    // console.log(url);
    const apiUrl = `${url}api/wakeup`
    // const time1 = Date.now();
    // console.log("sending fetch to", apiUrl, time1);
    const res = await fetch(apiUrl, {mode: 'no-cors'});
    // const time2 = Date.now();
    // console.log("got fetch back", time2)
    // console.log("took", (time2-time1), "ms")
    if (body.classList.contains("is-menu-visible")) {
      let newTab = window.open(url, "_blank");
      if (!newTab || newTab.closed || typeof newTab.closed=="undefined") {
        // console.log("popup blocker detected", Date.now());
        window.location.href = url;
      }
    }
    body.classList.remove('is-menu-visible');
    menu.innerHTML = menuContents;
    clearInterval(interval);
  }
}

listenProjs();
