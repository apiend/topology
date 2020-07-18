import { Store } from 'le5le-store';
import { Options } from './options';
import { Canvas } from './canvas';

export class RenderLayer extends Canvas {
  offscreen;

  bkImg: HTMLImageElement;
  bkImgRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constructor(public parentElem: HTMLElement, public options: Options = {}, TID: String) {
    super(parentElem, options, TID);
    this.offscreen = Store.get(this.generateStoreKey('LT:offscreen'));
    this.parentElem.appendChild(this.canvas);
  }

  loadBkImg(cb?: any) {
    if (!this.data.bkImage) {
      return;
    }

    this.bkImg = new Image();
    this.bkImg.crossOrigin = 'anonymous';
    this.bkImg.src = this.data.bkImage;
    this.bkImg.onload = () => {
      this.bkImgRect = this.coverRect(this.canvas.width, this.canvas.height, this.bkImg.width, this.bkImg.height);
      if (cb) {
        cb();
      }
    };
  }

  clearBkImg() {
    this.bkImgRect = null;
  }

  render = () => {
    if (this.data.bkImage && !this.bkImgRect) {
      this.loadBkImg(this.render);
      return;
    }

    if (!this.width || !this.height || !this.offscreen) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.data.bkColor) {
      ctx.fillStyle = this.data.bkColor;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    if (this.bkImg && this.bkImgRect) {
      // ctx.drawImage(this.bkImg, this.bkImgRect.x, this.bkImgRect.y, this.bkImgRect.width,
      //   this.bkImgRect.height, 0, 0, this.width, this.height);
      ctx.drawImage(this.bkImg, 0, 0, this.width, this.height);
    }

    ctx.drawImage(this.offscreen, 0, 0, this.width, this.height);
  };

  coverRect(canvasWidth: number, canvasHeight: number, imgWidth: number, imgHeight: number) {
    let x = 0;
    let y = 0;
    let width = imgWidth;
    let height = imgHeight;
    if (imgWidth > imgHeight || (imgWidth === imgHeight && canvasWidth < canvasHeight)) {
      width = canvasWidth * height / canvasHeight;
      x = (imgWidth - width) / 2;
    } else if (imgWidth < imgHeight || (imgWidth === imgHeight && canvasWidth > canvasHeight)) {
      height = canvasHeight * width / canvasWidth;
      y = (imgHeight - height) / 2;
    }
    return {
      x,
      y,
      width,
      height
    };
  }
}
