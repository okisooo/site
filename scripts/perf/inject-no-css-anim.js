(() => {
  const css = `*,*::before,*::after{animation:none !important;}`;
  const id = setInterval(() => {
    if (!document.head) return;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    clearInterval(id);
  }, 10);
})();
