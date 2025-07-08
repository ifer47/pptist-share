<script setup lang="ts">
import PptxGenJS from "pptxgenjs";
import hua from "./assets/hua.jpeg";
const demo1 = () => {
  // 1. Create a Presentation
  let pres = new PptxGenJS();
  // 2. Add a Slide to the presentation
  let slide = pres.addSlide();
  // 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
  let textboxText = "Hello World from PptxGenJS!";
  let textboxOpts = { x: 1, y: 1, color: "363636" };
  // 4. Save the Presentation
  slide.addText(textboxText, textboxOpts);

  pres.writeFile({ fileName: "Hello-World.pptx" });
};

const demo2 = () => {
  // 1. Create a Presentation
  let pres = new PptxGenJS();

  // 可选：设置不同的幻灯片布局

  // pres.layout = "LAYOUT_16x9"; // 16 x 5.625 英寸 // 默认
  // pres.layout = "LAYOUT_16x10"; // 10 x 6.25 英寸
  // pres.layout = 'LAYOUT_4x3';    // 10 x 7.5 英寸
  // pres.layout = 'LAYOUT_WIDE';   // 13.3 x 7.5 英寸

  // 2. Add a Slide to the presentation
  let slide = pres.addSlide();
  // 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide

  slide.addText("这是谁的部将", {
    x: 1,
    y: 1.5,
    w: 8,
    h: 2.625,
    fontSize: 42, // 字体大小
    fontFace: "华文行楷", // 楷体字族
    color: "008080", // 绿色字体
    // italic: true, // 开启斜体
    bold: true, // 开启粗体
    align: "center", // 水平居中
    valign: "bottom", // 垂直置底
  });
  // 4. Save the Presentation
  pres.writeFile({ fileName: "Hello-World.pptx" });
};

const demo3 = () => {
  // 1. Create a Presentation
  let pres = new PptxGenJS();
  // 2. Add a Slide to the presentation
  let slide = pres.addSlide();
  // 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
  const BarData = [
    {
      name: "每月数据",
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: Array(12)
        .fill(1)
        .map((i) => Math.floor(Math.random() * 10000 + 100)),
    },
  ];
  slide.addChart(pres.ChartType.bar, BarData, { x: 1, y: 1, w: 8, h: 4 });
  // 4. Save the Presentation
  pres.writeFile({ fileName: "Hello-World.pptx" });
};

const demo4 = () => {
  // 1. Create a Presentation
  let pres = new PptxGenJS();
  // 2. Add a Slide to the presentation
  let slide = pres.addSlide();
  // 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
  slide.addImage({
    path: hua,
    x: 2.5, // 水平居中：(10 - 5) / 2 = 2.5 英寸
    y: 1.3125, // 垂直居中：(5.625 - 3) / 2 = 1.3125 英寸
    w: 5, // 图片宽度：5 英寸
    h: 3, // 图片高度：3 英寸
    sizing: {
      type: "contain", // 保持宽高比，图片完全显示在容器内
      w: 5, // 实际显示区域宽度(英寸)
      h: 3, // 实际显示区域高度(英寸)
    },
  });
  // 4. Save the Presentation
  pres.writeFile({ fileName: "Hello-World.pptx" });
};

const demo5 = () => {
  // STEP 1: Instantiate
  let pptx = new PptxGenJS();

  // STEP 2: Provide HTML Element ID and options
  pptx.tableToSlides("html2ppt");

  // STEP 3: Create Presentation
  pptx.writeFile({ fileName: "Team-Members.pptx" });
};

const demo6 = () => {
  let pptx = new PptxGenJS();
  let slide = pptx.addSlide();

  // 添加居中的循环箭头图形
  slide.addShape(pptx.ShapeType.circularArrow, {
    x: 3.5, // 水平居中：(10 - 3) / 2 = 3.5 英寸
    y: 1.3125, // 垂直居中：(5.625 - 3) / 2 = 1.3125 英寸
    w: 3, // 宽度：3 英寸
    h: 3, // 高度：3 英寸
    fill: { color: "4A90E2" }, // 填充颜色：蓝色
    line: { color: "2C5282", width: 2 }, // 边框：深蓝色，2磅宽
    shadow: {
      // 阴影效果
      type: "outer",
      color: "808080",
      blur: 5,
      offset: 3,
      angle: 45,
    },
  });

  // 添加标题文字
  slide.addText("循环流程图", {
    x: 1,
    y: 0.5,
    w: 8,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: "2C5282",
    bold: true,
    align: "center",
  });

  pptx.writeFile({ fileName: "Shape-Demo.pptx" });
};

const demo7 = () => {
  let pptx = new PptxGenJS();
  let slide = pptx.addSlide();

  // 方法1：添加YouTube视频（推荐）
  slide.addMedia({
    type: "video",
    path: "https://vjs.zencdn.net/v/oceans.mp4",
    x: 2, // 水平居中：(10 - 6) / 2 = 2 英寸
    y: 1.3125, // 垂直居中：(5.625 - 3) / 2 = 1.3125 英寸
    w: 6, // 宽度：6 英寸
    h: 3, // 高度：3 英寸
  });

  // 添加标题
  slide.addText("演示视频", {
    x: 1,
    y: 0.5,
    w: 8,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: "2C5282",
    bold: true,
    align: "center",
  });

  pptx.writeFile({ fileName: "Media-Demo.pptx" });
};
</script>

<template>
  <table id="html2ppt">
    <thead className="table-dark">
      <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>职业</th>
        <th>城市</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>张三</td>
        <td>28</td>
        <td>前端工程师</td>
        <td>北京</td>
      </tr>
      <tr>
        <td>李四</td>
        <td>32</td>
        <td>产品经理</td>
        <td>上海</td>
      </tr>
      <tr>
        <td>王五</td>
        <td>25</td>
        <td>UI设计师</td>
        <td>深圳</td>
      </tr>
      <tr>
        <td>赵六</td>
        <td>30</td>
        <td>后端工程师</td>
        <td>杭州</td>
      </tr>
      <tr>
        <td>孙七</td>
        <td>27</td>
        <td>数据分析师</td>
        <td>广州</td>
      </tr>
    </tbody>
  </table>
  <button @click="demo1">四步生成 PPT</button>
  <button @click="demo2">配置文字样式</button>
  <button @click="demo3">添加图表</button>
  <button @click="demo4">添加图片</button>
  <button @click="demo6">导出图形</button>
  <button @click="demo7">导出媒体</button>
  <button @click="demo5">HTML2PPT</button>
</template>

<style scoped>
#html2ppt {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

#html2ppt thead th {
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  padding: 16px 20px;
  text-align: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

#html2ppt tbody td {
  padding: 14px 20px;
  border-bottom: 1px solid #e9ecef;
  color: #333;
  font-size: 14px;
}

#html2ppt tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

#html2ppt tbody tr:hover {
  background-color: #e3f2fd;
  transition: background-color 0.2s ease;
}

#html2ppt tbody tr:last-child td {
  border-bottom: none;
}

/* 按钮样式 */
button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px 5px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #357abd;
}

button:active {
  transform: translateY(1px);
}
</style>
