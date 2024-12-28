// ThrowError.ts
class ThrowError extends Error {
    code: number;
    title: string;
  
    constructor(code: number, title: string, message: string) {
      super(message);
      this.code = code;
      this.title = title;
      Object.setPrototypeOf(this, ThrowError.prototype);
    }
  }
  
  export default ThrowError;
  