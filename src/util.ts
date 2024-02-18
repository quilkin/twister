import { SourceMap } from "module";

export type image = { label: number, size: number  };

export enum imageTypes {
  words, additions, sums
}
export enum Options {
  timer = 'showTimer',
  colours = 'multiColour',
  numWords = 'numberOfWords',
  numRings = 'numberOfRings',
  wiggles = 'wiggles',
  imageType = 'imageType',
  showAnswer = 'showAnswer'

}

export function randInteger(max: number, min: number = 0){

  return Math.floor(Math.random() * (max - min)) + min;
}

// /**
//  * find position of svg graphic (text or image)
//  * @param size : radius of circle
//  * @param index : which segemnt it's in
//  * @param total : number of segments
//  * @returns coords{x,y}
//  */
export function valueToPoint(size: number,  index:number, total: number, letterPos: number, increment: number) {
  
  const x = 0
  const y = -letterPos;

  // find angle to centre of segment
  const angle = ((Math.PI * 2) / total) * (index - increment)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  var tx = x * cos - y * sin + size;
  var ty = x * sin + y * cos + size;

  ty += 5;

  return {
    x: tx,
    y: ty
  }
}


