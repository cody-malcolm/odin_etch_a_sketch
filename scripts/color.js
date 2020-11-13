export class Color {
  constructor(...args) {
    if (args.length == 1) {
      const c = args[0];
      if (c.charAt(0) == '#') {
        this.r = parseInt(c.slice(1, 3), 16);
        this.g = parseInt(c.slice(3, 5), 16);
        this.b = parseInt(c.slice(5), 16);
      } else {
        const arr = c.split(',');
        this.r = parseInt(arr[0].slice(4));
        this.g = parseInt(arr[1].slice(1));
        this.b = parseInt(arr[2].slice(1));
      }
    } else {
      this.r = args[0];
      this.g = args[1];
      this.b = args[2];
    }
  }

  static getRandNum() {
    return Math.floor(Math.random()*256);
  }

  static getRandColor() {
    return `rgb(${Color.getRandNum()}, ${Color.getRandNum()}, ${Color.getRandNum()})`;
  }

  static getCloserPart(a, b) {
    return (a < b) ? Math.ceil(a + (b-a)/10) : Math.floor(a + (b-a)/10);
  }

  getCloserColor(other) {
    const newRed = Color.getCloserPart(this.r, other.r);
    const newGreen = Color.getCloserPart(this.g, other.g);
    const newBlue = Color.getCloserPart(this.b, other.b);

    return new Color(newRed, newGreen, newBlue);
  }

  checkIfSame(other) {
    return (this.r == other.r && this.g == other.g && this.b == other.b);
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  getComplement() {
    return new Color(255-this.r, 255-this.g, 255-this.b);
  }
}
