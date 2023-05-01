// console.log("test, custom is loaded");

const body = document.body;
const params = new URLSearchParams(window.location.search.toLowerCase());
const noWake = params.get('nowake');
const menu = document.getElementById("menu");
const modalLink = document.getElementById("modalLink");
const menuContents = menu.innerHTML;

const autoRun = () => {
  const projLinks = document.querySelectorAll('.projLink'); // select all project links
  for (let el of projLinks) {
    el.addEventListener("click", projClickHandler(el.href)); // attach handler to click event for each link

    if ((window.location.hostname.startsWith("sam") && !noWake) || params.get('wake')) {
      // only send automatic wakeup on production, but dev can do it with ?wake=truthy
      fetch(`${el.href}api/wakeup/skport`, {mode: 'no-cors'}); //wake them all up now
    }
  }

  if (params.get('modalfor')) { // look for a ?modalfor=url parameter
    const forUrl = params.get('modalfor'); // save that parameter's value
    const launcher = projClickHandler(forUrl); // generate a function to launch the modal
    launcher({preventDefault: () => {
      // TO DO: e.preventDefault() behavior can be hijacked here with custom code
    }}); // launch the modal, with a dummy event so it doesn't error out
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

const modalClosed = interval => { // restores template modal and clears timer set for this purpose
  menu.innerHTML = menuContents;
  clearInterval(interval);
};

const projClickHandler = url => {
  return async e => {
    e.preventDefault(); // intercept click on project link
    const modalContents = document.getElementById("modal").innerHTML;
    modalLink.href = url;
    menu.innerHTML = modalContents; // replace template's modal with custom modal
    body.classList.add('is-menu-visible'); // show modal
    const interval = setInterval(() => {
      if (!body.classList.contains("is-menu-visible")) { // restore template modal once the custom one is closed
        document.getElementById("modal").innerHTML = modalContents;
        modalClosed(interval);
      }
    }, 250);
    const apiUrl = `${url}api/wakeup/skport-click`; // build target URL for wakeup fetch, doesn't matter if real
    // here's the magic:
    const res = await fetch(apiUrl, {mode: 'no-cors'}); // fetch to api, and wait until target is certainly awake
    if (noWake) url += `?nowake=${noWake}`; // add in nowake for redirect if present
    if (body.classList.contains("is-menu-visible")) { // make sure the user hasn't closed the modal before opening target
      let newTab = window.open(url, "_blank"); // attempt new tab
      if (!newTab || newTab.closed || typeof newTab.closed=="undefined") { // detect popup blocking
        window.location.href = url; // redirect current tab if new tab is blocked as popup
      }
    }
    body.classList.remove('is-menu-visible'); // close modal because the target project is already open
    document.getElementById("modal").innerHTML = modalContents;
    modalClosed(interval); // restore template modal
  }
}

autoRun();
