export class Layer {
  protected TID: String;

  constructor(TID: String) {
    this.TID = TID;
  }

  protected generateStoreKey(key) {
    return `${this.TID}-${key}`;
  }
}
