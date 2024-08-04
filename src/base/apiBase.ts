



export type ConfigFunction<T, U> = (this: T, api: T) => U;

export abstract class ApiBase<T, U = void> {
  configFunction: ConfigFunction<T, U>;

  constructor(configFunction: ConfigFunction<T, U>) {
    this.configFunction = configFunction;
  }

  runConfigFunction(): U {
    const api = this.getApi();
    return this.configFunction.call(api, api);
  }

  abstract getApi(): T;

}