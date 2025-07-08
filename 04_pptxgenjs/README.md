[官方文档](https://gitbrent.github.io/PptxGenJS/docs/quick-start/)

# 四步（支持 Node 和 Web），添加文本框

```html
<script setup>
  import PptxGenJS from "pptxgenjs";
  const getPPTx = () => {
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
</script>

<template><button @click="getPPTx">生成 PPT</button></template>
```

```html
<script setup>
  import PptxGenJS from "pptxgenjs";
  import hua from "./assets/hua.jpeg";
  const getPPTx = () => {
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

    // 4. Save the Presentation
    slide.addText("一串文本", {
      x: 1,
      y: 1.5,
      w: 8,
      h: 2.625,
      fontSize: 32, // 字体大小
      fontFace: "楷体", // 楷体字族
      color: "00FF00", // 绿色字体
      italic: true, // 开启斜体
      bold: true, // 开启粗体
      align: "center", // 水平居中
      valign: "bottom", // 垂直置底
    });

    pres.writeFile({ fileName: "Hello-World.pptx" });
  };
</script>

<template><button @click="getPPTx">生成 PPT</button></template>
```

# 添加表格

```ts
const rows = [
  [
    {
      text: [
        { text: "姓", options: { color: "FF0000" } }, // 红色字
        { text: "名", options: { color: "00FF00" } }, // 绿色字
      ],
      options: { bold: true },
    },
    { text: "年龄", options: { bold: true } },
    { text: "爱好", options: { bold: true } },
  ],
  ["小明", 18, "敲代码"],
  ["小红", 16, "看小明敲代码"],
];

slide.addTable(rows, {
  x: 1, // 水平位置
  y: 1, // 垂直位置
  w: 8, // 表格宽度
  border: { pt: "1", color: "000000" }, // 边框：1磅黑色线条
  fontSize: 14, // 字体大小
  fontFace: "Arial", // 字体
  align: "center", // 文字居中对齐
  valign: "middle", // 垂直居中对齐
});
```

# 添加图形



# 添加媒体



# 添加图表

```ts
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
```

# 添加图片

```ts
import hua from "./assets/hua.jpeg";
slide.addImage({
  path: hua,
  x: "25%", // 水平位置：距离左边25%
  y: "25%", // 垂直位置：距离顶部25%
  w: "50%", // 容器宽度：幻灯片宽度的50% (外部容器框架)
  h: "50%", // 容器高度：幻灯片高度的50% (外部容器框架)
  sizing: {
    type: "contain", // 保持宽高比，图片完全显示在容器内
    w: 5, // 实际显示区域宽度(英寸) - 图片内容的实际尺寸
    h: 3, // 实际显示区域高度(英寸) - 图片内容的实际尺寸
  },
});
```

# HTML2PPT

```html
<script setup>
import PptxGenJS from "pptxgenjs";
import hua from "./assets/hua.jpeg";
const getPPTx = () => {
  // STEP 1: Instantiate
  let pptx = new PptxGenJS();

  // STEP 2: Provide HTML Element ID and options
  pptx.tableToSlides("html2ppt", { x: 1.0, y: 1.0, w: 10 });

  // STEP 3: Create Presentation
  pptx.writeFile({ fileName: "table2slides_demo.pptx" });
};
</script>

<template>
  <table id="html2ppt" className="table table-dark d-none">
    <thead className="table-dark">
      <tr>
        <th>col 1</th>
        <th>col 2</th>
        <th>col 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>cell 1</td>
        <td>cell 2</td>
        <td>cell 3</td>
      </tr>
    </tbody>
  </table>
  <button @click="getPPTx">生成 PPT</button>
</template>

```

