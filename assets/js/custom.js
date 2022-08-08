console.log("test, custom is loaded");

const listenProjs = () => {
  console.log("listenProjs fired");
  const projLinks = document.querySelectorAll('.projLink');
  for (let el of projLinks) {
    // console.log(el);
    el.addEventListener("click", projClickHandler(el.href));
  }
}

const projClickHandler = url => {
  return async e => {
    e.preventDefault();
    console.log("projClickHandler fired for url", url)
    // console.log(e.target);
    // console.log(url);
    const apiUrl = `${url}api/wakeup`
    console.log("sending fetch to", apiUrl, Date.now());
    const res = await fetch(apiUrl);
    console.log("got something back maybe? idk, we're doing it live", Date.now())
  }
}

listenProjs();