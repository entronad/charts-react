export class TypedRegistry {
  readonly _registry: Map<TypedKey<any>, any> = new Map();

  getAttr = <R>(key: TypedKey<R>): R =>
    this._registry.get(key) as R;
  
  setAttr = <R>(key: TypedKey<R>, value: R) => {
    this._registry.set(key, value);
  }
}

export class TypedKey<R> {
  readonly uniqueKey: string;

  constructor(uniqueKey: string) {
    this.uniqueKey = uniqueKey;
  }

  equals = (other: any) => other instanceof TypedKey && this.uniqueKey === other.uniqueKey;
}
