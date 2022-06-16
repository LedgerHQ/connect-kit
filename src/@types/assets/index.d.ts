/**
 * Declare module which allows us to import SVG's
 */
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
