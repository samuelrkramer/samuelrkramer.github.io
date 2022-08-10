// console.log("test, custom is loaded");

const body = document.body;
const menu = document.getElementById("menu");
const projLink = document.getElementById("projLink");
const menuContents = menu.innerHTML;

const listenProjs = () => {
  // console.log("listenProjs fired");
  const projLinks = document.querySelectorAll('.projLink');
  for (let el of projLinks) {
    // console.log(el);
    el.addEventListener("click", projClickHandler(el.href));
  }
}

const projClickHandler = url => {
  return async e => {
    e.preventDefault();
    console.log("projClickHandler fired for url", url);
    projLink.href = url;
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
