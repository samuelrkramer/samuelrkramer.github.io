// console.log("test, custom is loaded");

const body = document.body;
const params = new URLSearchParams(window.location.search.toLowerCase());
const menu = document.getElementById("menu");
const modalLink = document.getElementById("modalLink");
const menuContents = menu.innerHTML;

const autoRun = () => {
  const projLinks = document.querySelectorAll('.projLink'); // select all project links
  for (let el of projLinks) {
    el.addEventListener("click", projClickHandler(el.href)); // attach handler to click event for each link

    if ((window.location.hostname.startsWith("sam") && !params.get('nowake')) || params.get('wake')) {
      // only send automatic wakeup on production, but dev can do it with ?wake=truthy
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
      if (!body.classList.contains("is-menu-visible")) {
        modalClosed(interval);
      }
    }, 250);
  });

  const techHeader = document.getElementById("techHeader");
  const techCircle = document.getElementById("techCircle");
  const techThing = document.getElementById("techThing");
  const techList = document.getElementById("techList");
  const oldClass = techThing.classList.toString();
  // const oldText = techThing.nextSibling.data;
  const oldText = techHeader.innerText;
  for (let el of techList.children) {
    // console.log(el.classList.toString());
    // console.log(el.dataset.hover);
    // console.log({
    //   smIcon: el.classList.toString(),
    //   bigIcon: el.dataset.hover,
    //   oldClass,
    // });
    const changeTech = e => {
      techThing.classList = el.dataset.hover;
      // console.log(techThing.nextSibling.data = "<br/>"+el.title);
      techHeader.innerText = el.title;
    }
    const hover = el.addEventListener("mouseover", changeTech);
    const click = el.addEventListener("click", changeTech);
  }
  const leaveTech = techList.addEventListener("mouseleave", e => {
    techThing.classList = oldClass;
    // techThing.nextSibling.data = oldText;
    techHeader.innerText = oldText;
  });
}

const modalClosed = interval => { // restores template modal and clears timer set for this purpose
  menu.innerHTML = menuContents;
  clearInterval(interval);
};

const projClickHandler = url => {
  return async e => {
    e.preventDefault(); // intercept click on project link
    modalLink.href = url;
    const modalContents = document.getElementById("modal").innerHTML;
    menu.innerHTML = modalContents; // replace template's modal with custom modal
    body.classList.add('is-menu-visible'); // show modal
    const interval = setInterval(() => {
      if (!body.classList.contains("is-menu-visible")) { // restore template modal once the custom one is closed
        modalClosed(interval);
      }
    }, 250);
    const apiUrl = `${url}api/wakeup/skport-click`; // build target URL for wakeup fetch, doesn't matter if real
    // here's the magic:
    const res = await fetch(apiUrl, {mode: 'no-cors'}); // fetch to api, and wait until target is certainly awake
    if (body.classList.contains("is-menu-visible")) { // make sure the user hasn't closed the modal before opening target
      let newTab = window.open(url, "_blank"); // attempt new tab
      if (!newTab || newTab.closed || typeof newTab.closed=="undefined") { // detect popup blocking
        window.location.href = url; // redirect current tab if new tab is blocked as popup
      }
    }
    body.classList.remove('is-menu-visible'); // close modal because the target project is already open
    modalClosed(interval); // restore template modal
  }
}

autoRun();
