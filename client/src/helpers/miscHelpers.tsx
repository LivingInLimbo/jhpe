const enableScroll = (document: any) => {
  document.body.style.position = "";
  document.body.style.top = "";
};

const disableScroll = (document: any, window: any) => {
  var scrollY = window.scrollY;
  document.body.style.top = `-${scrollY}px`;
  document.body.style.position = "fixed";
};

export { enableScroll, disableScroll };
