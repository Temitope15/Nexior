<template>
  <canvas ref="canvasRef" :class="['shapegrid-canvas', className]" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShapeGrid',
  props: {
    direction: {
      type: String,
      default: 'right'
    },
    speed: {
      type: Number,
      default: 1
    },
    borderColor: {
      type: String,
      default: '#999'
    },
    squareSize: {
      type: Number,
      default: 40
    },
    hoverFillColor: {
      type: String,
      default: '#222'
    },
    shape: {
      type: String,
      default: 'square'
    },
    hoverTrailAmount: {
      type: Number,
      default: 0
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      requestRef: null as number | null,
      numSquaresX: 0,
      numSquaresY: 0,
      gridOffset: { x: 0, y: 0 },
      hoveredSquare: null as { x: number; y: number } | null,
      trailCells: [] as { x: number; y: number }[],
      cellOpacities: new Map<string, number>()
    };
  },
  computed: {
    isHex(): boolean {
      return this.shape === 'hexagon';
    },
    isTri(): boolean {
      return this.shape === 'triangle';
    },
    hexHoriz(): number {
      return this.squareSize * 1.5;
    },
    hexVert(): number {
      return this.squareSize * Math.sqrt(3);
    }
  },
  mounted() {
    this.initializeCanvas();
  },
  beforeUnmount() {
    if (this.requestRef) {
      cancelAnimationFrame(this.requestRef);
    }
    const canvas = this.$refs.canvasRef as HTMLCanvasElement;
    if (canvas) {
      canvas.removeEventListener('mousemove', this.handleMouseMove);
      canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  },
  methods: {
    initializeCanvas() {
      const canvas = this.$refs.canvasRef as HTMLCanvasElement;
      if (!canvas) return;

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.numSquaresX = Math.ceil(canvas.width / this.squareSize) + 1;
        this.numSquaresY = Math.ceil(canvas.height / this.squareSize) + 1;
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      canvas.addEventListener('mousemove', this.handleMouseMove);
      canvas.addEventListener('mouseleave', this.handleMouseLeave);

      this.requestRef = requestAnimationFrame(this.updateAnimation);
    },

    resizeCanvas() {
      const canvas = this.$refs.canvasRef as HTMLCanvasElement;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      this.numSquaresX = Math.ceil(canvas.width / this.squareSize) + 1;
      this.numSquaresY = Math.ceil(canvas.height / this.squareSize) + 1;
    },

    drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const vx = cx + size * Math.cos(angle);
        const vy = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    },

    drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.closePath();
    },

    drawTriangle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, flip: boolean) {
      ctx.beginPath();
      if (flip) {
        ctx.moveTo(cx, cy + size / 2);
        ctx.lineTo(cx + size / 2, cy - size / 2);
        ctx.lineTo(cx - size / 2, cy - size / 2);
      } else {
        ctx.moveTo(cx, cy - size / 2);
        ctx.lineTo(cx + size / 2, cy + size / 2);
        ctx.lineTo(cx - size / 2, cy + size / 2);
      }
      ctx.closePath();
    },

    drawGrid() {
      const canvas = this.$refs.canvasRef as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (this.isHex) {
        const colShift = Math.floor(this.gridOffset.x / this.hexHoriz);
        const offsetX = ((this.gridOffset.x % this.hexHoriz) + this.hexHoriz) % this.hexHoriz;
        const offsetY = ((this.gridOffset.y % this.hexVert) + this.hexVert) % this.hexVert;

        const cols = Math.ceil(canvas.width / this.hexHoriz) + 3;
        const rows = Math.ceil(canvas.height / this.hexVert) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * this.hexHoriz + offsetX;
            const cy = row * this.hexVert + ((col + colShift) % 2 !== 0 ? this.hexVert / 2 : 0) + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = this.cellOpacities.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              this.drawHex(ctx, cx, cy, this.squareSize);
              ctx.fillStyle = this.hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            this.drawHex(ctx, cx, cy, this.squareSize);
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
          }
        }
      } else if (this.isTri) {
        const halfW = this.squareSize / 2;
        const colShift = Math.floor(this.gridOffset.x / halfW);
        const rowShift = Math.floor(this.gridOffset.y / this.squareSize);
        const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const cols = Math.ceil(canvas.width / halfW) + 4;
        const rows = Math.ceil(canvas.height / this.squareSize) + 4;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * halfW + offsetX;
            const cy = row * this.squareSize + this.squareSize / 2 + offsetY;
            const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;

            const cellKey = `${col},${row}`;
            const alpha = this.cellOpacities.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              this.drawTriangle(ctx, cx, cy, this.squareSize, flip);
              ctx.fillStyle = this.hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            this.drawTriangle(ctx, cx, cy, this.squareSize, flip);
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
          }
        }
      } else if (this.shape === 'circle') {
        const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const cols = Math.ceil(canvas.width / this.squareSize) + 3;
        const rows = Math.ceil(canvas.height / this.squareSize) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * this.squareSize + this.squareSize / 2 + offsetX;
            const cy = row * this.squareSize + this.squareSize / 2 + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = this.cellOpacities.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              this.drawCircle(ctx, cx, cy, this.squareSize);
              ctx.fillStyle = this.hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            this.drawCircle(ctx, cx, cy, this.squareSize);
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
          }
        }
      } else {
        const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const cols = Math.ceil(canvas.width / this.squareSize) + 3;
        const rows = Math.ceil(canvas.height / this.squareSize) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const sx = col * this.squareSize + offsetX;
            const sy = row * this.squareSize + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = this.cellOpacities.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              ctx.fillStyle = this.hoverFillColor;
              ctx.fillRect(sx, sy, this.squareSize, this.squareSize);
              ctx.globalAlpha = 1;
            }

            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(sx, sy, this.squareSize, this.squareSize);
          }
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    updateAnimation() {
      const effectiveSpeed = Math.max(this.speed, 0.1);
      const wrapX = this.isHex ? this.hexHoriz * 2 : this.squareSize;
      const wrapY = this.isHex ? this.hexVert : this.isTri ? this.squareSize * 2 : this.squareSize;

      switch (this.direction) {
        case 'right':
          this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
          break;
        case 'left':
          this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
          break;
        case 'up':
          this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
          break;
        case 'down':
          this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
          break;
        case 'diagonal':
          this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
          this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
          break;
      }

      this.updateCellOpacities();
      this.drawGrid();
      this.requestRef = requestAnimationFrame(this.updateAnimation);
    },

    updateCellOpacities() {
      const targets = new Map<string, number>();

      if (this.hoveredSquare) {
        targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
      }

      if (this.hoverTrailAmount > 0) {
        for (let i = 0; i < this.trailCells.length; i++) {
          const t = this.trailCells[i];
          const key = `${t.x},${t.y}`;
          if (!targets.has(key)) {
            targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
          }
        }
      }

      for (const [key] of targets) {
        if (!this.cellOpacities.has(key)) {
          this.cellOpacities.set(key, 0);
        }
      }

      for (const [key, opacity] of this.cellOpacities) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;
        if (next < 0.005) {
          this.cellOpacities.delete(key);
        } else {
          this.cellOpacities.set(key, next);
        }
      }
    },

    handleMouseMove(event: MouseEvent) {
      const canvas = this.$refs.canvasRef as HTMLCanvasElement;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let col: number, row: number;

      if (this.isHex) {
        const colShift = Math.floor(this.gridOffset.x / this.hexHoriz);
        const offsetX = ((this.gridOffset.x % this.hexHoriz) + this.hexHoriz) % this.hexHoriz;
        const offsetY = ((this.gridOffset.y % this.hexVert) + this.hexVert) % this.hexVert;
        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        col = Math.round(adjustedX / this.hexHoriz);
        const rowOffset = (col + colShift) % 2 !== 0 ? this.hexVert / 2 : 0;
        row = Math.round((adjustedY - rowOffset) / this.hexVert);
      } else if (this.isTri) {
        const halfW = this.squareSize / 2;
        const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        col = Math.round(adjustedX / halfW);
        row = Math.floor(adjustedY / this.squareSize);
      } else if (this.shape === 'circle') {
        const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        col = Math.round(adjustedX / this.squareSize);
        row = Math.round(adjustedY / this.squareSize);
      } else {
        const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        col = Math.floor(adjustedX / this.squareSize);
        row = Math.floor(adjustedY / this.squareSize);
      }

      if (!this.hoveredSquare || this.hoveredSquare.x !== col || this.hoveredSquare.y !== row) {
        if (this.hoveredSquare && this.hoverTrailAmount > 0) {
          this.trailCells.unshift({ ...this.hoveredSquare });
          if (this.trailCells.length > this.hoverTrailAmount) {
            this.trailCells.length = this.hoverTrailAmount;
          }
        }
        this.hoveredSquare = { x: col, y: row };
      }
    },

    handleMouseLeave() {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) {
          this.trailCells.length = this.hoverTrailAmount;
        }
      }
      this.hoveredSquare = null;
    }
  }
});
</script>

<style scoped>
.shapegrid-canvas {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
