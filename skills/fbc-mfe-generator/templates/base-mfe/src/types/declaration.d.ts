declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

// Module Federation - Remote Modules
declare module "authentication/App" {
    import { LifeCycles } from 'single-spa';
    const lifecycles: LifeCycles;
    export default lifecycles;
}
