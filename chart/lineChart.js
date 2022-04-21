const XAXIS_PADDING = 25;
const YXAIS_PADDING = 25;
const DURATION = 280 * 30; // 30s
const MAX_VALUE = 100;
const YTICK_COUNT = 5;
const EX_TEXT = "00:00";
const TOP_PADDING = 30;
class LineChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - YXAIS_PADDING;
    this.chartHeight = this.canvasHeight - XAXIS_PADDING;

    this.startTime = 0;
    this.endTime = 0;
    this.data = [];
    this.xFormatWidth = this.ctx.measureText(EX_TEXT).width;
    this.setTime();
    this.drwaChart();
  }

  //시간을 실시간으로 세팅
  setTime = () => {
    this.endTime = Date.now();
    this.startTime = this.endTime - DURATION;
    this.setXInterval();
  };

  setXInterval = () => {
    let xPoint = 0;
    let timeInterval = 1000;
    while (true) {
      xPoint = (timeInterval / DURATION) * this.chartWidth;
      if (xPoint > this.xFormatWidth) {
        break;
      }
      timeInterval += 2;
    }
    this.xTimeInterval = timeInterval;
  };
  //차트 그리는 함수
  drwaChart = () => {
    const { ctx, canvasWidth, canvasHeight, chartHeight, chartWidth } = this;

    this.setTime();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();

    ctx.moveTo(YXAIS_PADDING, 0);
    // draw YAXIS
    ctx.lineTo(YXAIS_PADDING, chartHeight);
    const yInterval = MAX_VALUE / (YTICK_COUNT - 1);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i < YTICK_COUNT; i++) {
      const value = i * yInterval;
      const yPoint =
        TOP_PADDING + chartHeight - (value / MAX_VALUE) * chartHeight;
      ctx.fillText(Math.floor(value), YXAIS_PADDING - 3, yPoint);
    }

    // draw XAXIS
    ctx.lineTo(canvasWidth, chartHeight);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.rect(YXAIS_PADDING, 0, chartWidth, canvasHeight);
    ctx.clip();

    let currentTime = this.startTime - (this.startTime % this.xTimeInterval);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    while (currentTime < this.endTime + this.xTimeInterval) {
      const xPoint = ((currentTime - this.startTime) / DURATION) * chartWidth;
      const date = new Date(currentTime);
      const text = date.getMinutes() + ":" + date.getSeconds();
      ctx.fillText(text, xPoint, chartHeight + 4);
      currentTime += this.xTimeInterval;
    }

    //drawData
    ctx.beginPath();
    this.data.forEach((datum, index) => {
      const [time, value] = datum;
      const xPoint = ((time - this.startTime) / DURATION) * chartWidth;
      const yPoint = chartHeight - (value / MAX_VALUE) * chartHeight;

      if (!index) {
        ctx.moveTo(xPoint, yPoint);
      } else {
        ctx.lineTo(xPoint, yPoint);
      }
    });
    ctx.stroke();

    requestAnimationFrame(this.drwaChart);
    setTimeout(() => {
      cancelAnimationFrame(this.drwaChart);
    }, 10000);
  };

  // 데이터를 갱신하는 함수
  updateData = (data) => {
    this.data.push(data);
    this.setTime();
    this.drwaChart();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const chart = new LineChart("lineChart");
  var myChart = window.setInterval(() => {
    chart.updateData([Date.now(), Math.random() * 100]);
  }, 1000);

  // 10 초만 수행하도록 했음
  setTimeout(() => {
    clearInterval(myChart);
  }, 10000);
});
