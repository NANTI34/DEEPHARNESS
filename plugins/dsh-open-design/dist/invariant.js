// src/invariant.ts
var PACKAGE_NAME = "@open-design/dsh-runtime";
var name = "open-design-runtime-invariant";
var inject = ["invariants"];
var install = () => {
};
var apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
export {
  apply,
  inject,
  name
};
