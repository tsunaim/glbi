let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const handleMove = (e) => {
      if (!this.rotating) {
        if (e.type === 'mousemove') {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          this.velX = this.mouseX - this.prevMouseX;
          this.velY = this.mouseY - this.prevMouseY;
        } else if (e.type === 'touchmove') {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
          this.velX = this.mouseX - this.prevMouseX;
          this.velY = this.mouseY - this.prevMouseY;
        }
      }

      const dirX = this.mouseX - this.touchX;
      const dirY = this.mouseY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });

    const handleStart = (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.type === 'mousedown' || (e.type === 'touchstart' && e.touches.length === 1)) {
        this.touchX = this.mouseX = e.clientX || e.touches[0].clientX;
        this.touchY = this.mouseY = e.clientY || e.touches[0].clientY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }

      if (e.type === 'mousedown' && e.button === 2) {
        this.rotating = true;
      }

      if (e.type === 'touchstart') {
        e.preventDefault();
      }
    };

    paper.addEventListener('mousedown', handleStart);
    paper.addEventListener('touchstart', handleStart);

    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
