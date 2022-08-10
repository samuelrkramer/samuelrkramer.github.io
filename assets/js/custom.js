console.log("test, custom is loaded");

const body = document.body;
const menu = document.getElementById("menu");
const menuContents = menu.innerHTML;
const modalContents = document.getElementById("modal").innerHTML;

const listenProjs = () => {
  console.log("listenProjs fired");
  const projLinks = document.querySelectorAll('.projLink');
  for (let el of projLinks) {
    // console.log(el);
    el.addEventListener("click", projClickHandler(el.href));
  }
}


const projClickHandler = url => {
  // const hideModal = () => {
  //   console.log("body click")
  //   body.classList.remove('is-modal-visible')
  //   console.log("modal class unset");
  // }

  return async e => {
    e.preventDefault();
    console.log("projClickHandler fired for url", url);
    menu.innerHTML = modalContents;
    body.classList.add('is-menu-visible');
    // body.addEventListener("click", hideModal, {once: true});
    // console.log(e.target);
    // console.log(url);
    const apiUrl = `${url}api/wakeup`
    console.log("sending fetch to", apiUrl, Date.now());
    const res = await fetch(apiUrl);
    console.log("got something back maybe? idk, we're doing it live", Date.now())
    body.classList.remove('is-menu-visible');
    menu.innerHTML = menuContents;
  }
}

listenProjs();
