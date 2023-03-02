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
  const oldClass = techThing.classList.toString(); // save default tech icon
  const oldText = techHeader.innerText; // save default tech header
  const techList = document.getElementById("techList"); // select the techlist
  for (let el of techList.children) {
    const changeTech = e => { // custom handler for each tech item
      techThing.classList = el.dataset.hover; // use classlist data attached in html to each tech item
      techHeader.innerText = el.title; // change title to match tech item
    }
    const hover = el.addEventListener("mouseover", changeTech); // attach hover handler for desktops
    const click = el.addEventListener("click", changeTech); // attach click handler for mobile
  }
  const leaveTech = techList.addEventListener("mouseleave", e => { // and attach undo handler for leaving the whole techlist area
    techThing.classList = oldClass;
    techHeader.innerText = oldText;
  });
}

const modalClosed = (interval, time=0) => { // restores template modal and clears timer set for this purpose
  menu.innerHTML = menuContents;
  body.classList.remove(time); // destroy uniqueness of modal
  clearInterval(interval);
};

const projClickHandler = url => {
  return async e => {
    e.preventDefault(); // intercept click on project link
    modalLink.href = url;
    const modalContents = document.getElementById("modal").innerHTML;
    menu.innerHTML = modalContents; // replace template's modal with custom modal
    body.classList.add('is-menu-visible'); // show modal
    const time = Date.now();
    body.classList.add(time); // unique imprint on each modal to avoid hijacking the wrong one
    console.log(body.classList)
    const interval = setInterval(() => {
      if (!body.classList.contains("is-menu-visible")) { // restore template modal once the custom one is closed
        modalClosed(interval, time);
      }
    }, 250);
    const apiUrl = `${url}api/wakeup/skport-click`; // build target URL for wakeup fetch, doesn't matter if real
    // here's the magic:
    const res = await fetch(apiUrl, {mode: 'no-cors'}); // fetch to api, and wait until target is certainly awake
    // make sure the user hasn't closed the unique modal before opening target
    if (body.classList.contains("is-menu-visible") && body.classList.contains(time)) {
      let newTab = window.open(url, "_blank"); // attempt new tab
      if (!newTab || newTab.closed || typeof newTab.closed=="undefined") { // detect popup blocking
        window.location.href = url; // redirect current tab if new tab is blocked as popup
      }
    } else {
      return; // if the unique modal was closed, stop doing anything
    }
    body.classList.remove(time); // destroy uniqueness of modal
    body.classList.remove('is-menu-visible'); // close modal because the target project is already open
    modalClosed(interval); // restore template modal
  }
}

autoRun();
