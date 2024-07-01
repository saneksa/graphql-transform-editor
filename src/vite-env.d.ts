/// <reference types="vite/client" />

type TR = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success(params: any): void;
};

declare module "rc-message" {
  const r: TR;

  export default r;
}
