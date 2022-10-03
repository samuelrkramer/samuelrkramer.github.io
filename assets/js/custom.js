// console.log("test, custom is loaded");

const body = document.body;
const params = new URLSearchParams(window.location.search.toLowerCase());
const menu = document.getElementById("menu");
const modalLink = document.getElementById("modalLink");
const menuContents = menu.innerHTML;

const autoRun = () => {
  // console.log("autoRun fired");
  const projLinks = document.querySelectorAll('.projLink');
  for (let el of projLinks) {
    // console.log(el);
    el.addEventListener("click", projClickHandler(el.href));
    // console.log(params.get('nowake'), typeof(params.get('nowake')))
    if ((window.location.hostname.startsWith("sam") && !params.get('nowake')) || params.get('wake')) {
      // // only send automatic wakeup on production, but dev can do it with ?wake=truthy
      // console.log('nowake falsy')
      fetch(`${el.href}api/wakeup/skport`, {mode: 'no-cors'}); //wake them all up now
    }
  }

  const modalPlease = document.getElementById("modalPlease");
  modalPlease.addEventListener("click", e => {
    e.preventDefault();
    window.alert("Okay, but you have to close it manually! It's not doing anything this time");
    menu.innerHTML = document.getElementById("modal").innerHTML;
    body.classList.add("is-menu-visible");
    const interval = setInterval(() => {
      // console.log("interval checking for closed modal")
      if (!body.classList.contains("is-menu-visible")) {
        // console.log("modal closed!");
        modalClosed(interval);
      }
    }, 250);
  });

  const techHeader = document.getElementById("techHeader");
  const techCircle = document.getElementById("techCircle");
  const techList = document.getElementById("techList");
  for (let el of techList.children) {
    console.log(el.classList.toString());
  }
}

const modalClosed = interval => {
  menu.innerHTML = menuContents;
  clearInterval(interval);
};

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
        modalClosed(interval);
      }
    }, 250);
    // console.log(e.target);
    // console.log(url);
    const apiUrl = `${url}api/wakeup/skport-click`
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
    modalClosed(interval);
  }
}

autoRun();
