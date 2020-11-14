export class Color {
  // args can be String or Int, Int, Int
  constructor(...args) {
    if (args.length == 1) {
      // String is either of the form "#xxxxxx" or "rgb(r,g,b)"
      const c = args[0];

      if (c.charAt(0) == '#') { // hex format
        this.r = parseInt(c.slice(1, 3), 16);
        this.g = parseInt(c.slice(3, 5), 16);
        this.b = parseInt(c.slice(5), 16);
      } else {  // rgb format
        const arr = c.split(',');
        this.r = parseInt(arr[0].slice(4));
        this.g = parseInt(arr[1].slice(1));
        this.b = parseInt(arr[2].slice(1));
      }
    } else {
      // args will be r, g, b, in that order
      this.r = args[0];
      this.g = args[1];
      this.b = args[2];
    }
  }

  // null -> int
  // generate a random integer in the range [0, 255]
  static getRandNum() {
    return Math.floor(Math.random()*256);
  }

  // null -> Color
  // generate a random Color
  static getRandColor() {
    return new Color(Color.getRandNum(), Color.getRandNum(), Color.getRandNum());
  }

  // int int -> int
  // given two numbers, returns a number 10% closer to the second number than the first
  static getCloserPart(a, b) {
    return (a < b) ? Math.ceil(a + (b-a)/10) : Math.floor(a + (b-a)/10);
  }

  // Color Color -> Color
  // given another Color, returns a Color 10% closer to the other Color than "this" Color
  getCloserColor(other) {
    const newRed = Color.getCloserPart(this.r, other.r);
    const newGreen = Color.getCloserPart(this.g, other.g);
    const newBlue = Color.getCloserPart(this.b, other.b);

    return new Color(newRed, newGreen, newBlue);
  }

  // Color Color -> boolean
  // checks if two colors are the same
  checkIfSame(other) {
    return (this.r == other.r && this.g == other.g && this.b == other.b);
  }

  // Color -> String
  // returns a rgb-fomratted string based on the values of "this"
  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  // Color -> Color
  // returns the complementary color of "this"
  getComplement() {
    return new Color(255-this.r, 255-this.g, 255-this.b);
  }
}
