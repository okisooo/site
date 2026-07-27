(() => {
  const orig = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) {
    if (typeof p === "string" && p.indexOf("--cursor-") === 0) return;
    return orig.call(this, p, v, pr);
  };
})();
