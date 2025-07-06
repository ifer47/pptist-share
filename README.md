# ProseMirror

## 基本概述

- prosemirror-model：schema 描述了文档中可能出现的节点类型，以及它们的嵌套方式，让开发者自己定义解析和渲染的行为，例如它可以说明顶层节点可以包含一个或多个区块，段落节点可以包含任意数量的内联节点。

- prosemirror-state：描述编辑器整体状态。

- prosemirror-view：UI 组件，用于将编辑器状态展现为可编辑的元素，处理用户交互。

- prosemirror-transform：修改文档的事务方法。

## 基本举例

```ts
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { schema } from "prosemirror-schema-basic";
import "prosemirror-view/style/prosemirror.css";

const id = "prosemirror-editor";
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<div id="${id}"></div>`;

const el = document.querySelector(`#${id}`);

// 1. 提供 schema
// 2. 根据 schema 生成 state
const editorState = EditorState.create({
  schema,
});

// 3. 根据 state 生成 view
const editorView = new EditorView(el, {
  state: editorState,
});
```

## 如何定义 Schema

```ts
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { Schema, DOMParser } from "prosemirror-model";
import "prosemirror-view/style/prosemirror.css";

const id = "prosemirror-editor";

const schema = new Schema({
  // 节点结构定义：定义文档中可以包含的节点类型（如段落、标题、列表等）
  // 描述该节点的解析规则/渲染成 DOM 的规则
  nodes: {
    // 文档根节点
    doc: {
      // 指定子节点规则。"block+" 表示必须包含至少一个块级节点（如段落、标题）
      content: "block+",
    },
    // 表示文本内容，是文档的最底层节点
    text: {
      // 将节点归类为 inline（内联元素），用于其他节点的 content 规则引用
      group: "inline",
    },
    // 定义段落节点
    paragraph: {
      // 表示可以包含零个或多个内联元素（如文本、标记）
      content: "inline*",
      // 归类为 block（块级元素），可被 doc 节点包含
      group: "block",
      // 从 HTML 解析时，将 <p> 标签转换为此节点
      // 定义了怎样解析 DOM 的规则，例如黏贴到文档内，粘贴板内有html格式的数据
      parseDOM: [{ tag: "p" }],
      // 渲染为 HTML 时，生成 <p> 标签。0 表示子内容的位置
      // 结合 node.attrs 的属性或其它信息，去定义需要渲染成怎样的 DOM 结构
      toDOM() {
        return ["p", 0];
      },
    },
    // heading 节点
    heading: {
      // 节点属性。level 表示标题级别（1-6），默认值为 1
      attrs: { level: { default: 1 } },
      // 同段落，可包含零个或多个内联元素
      content: "inline*",
      // 归类为 block
      group: "block",
      // 当分割节点时（如按 Enter），保持标题属性不变
      defining: true,
      // 将不同级别的 HTML 标题标签（<h1> 到 <h6>）映射到对应的 level 属性
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      // 根据 level 属性生成对应级别的标题标签
      toDOM(node) {
        return ["h" + node.attrs.level, 0];
      },
    },
  },
  // 节点标记定义：定义可以应用于文本的样式标记（如粗体、斜体、链接等）
  marks: {},
});

// 初始化一个 p 段落
const content = new window.DOMParser().parseFromString(`<p>this is paragraph</p><h1>this is h1</h1>`, "text/html").body;

export const mount = () => {
  const el = document.querySelector(`#${id}`);

  // 1. 提供 schema
  // 2. 创建 schema 生成 state
  const editorState = EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content),
  });

  // 3. 根据 state 生成 view
  const editorView = new EditorView(el, {
    state: editorState,
  });
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<div id="${id}"></div>`;

mount();
```

## 案例演示

```html
<template>
  <button @click="insertContent">插入文本</button>
  <button @click="handleText('bold')">加粗</button>
  <button @click="handleText('italic')">倾斜</button>
  <button @click="handleText('clear')">清除</button>
  <div class="prosemirror-editor" ref="prosemirror-editor"></div>
</template>

<script setup lang="ts">
  import { useTemplateRef } from "vue";
  import { EditorView } from "prosemirror-view";
  import { EditorState } from "prosemirror-state";
  import { schema } from "prosemirror-schema-basic";
  import { DOMParser } from "prosemirror-model";
  import "prosemirror-view/style/prosemirror.css";
  import { onMounted } from "vue";

  // 初始化一个 p 段落
  const content = new window.DOMParser().parseFromString(`<h1>我是标题</h1>`, "text/html").body;

  const prosemirrorEditor = useTemplateRef("prosemirror-editor");
  let editorView: EditorView;
  let isFirstInsert = true; // 标记是否为首次插入
  onMounted(() => {
    // 1. 提供 schema
    // 2. 创建 schema 生成 state
    const editorState = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content),
    });
    // 3. 根据 state 生成 view
    editorView = new EditorView(prosemirrorEditor.value, {
      state: editorState,
    });
  });

  const insertContent = () => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    // 创建一个 text 节点
    const textNode = schema.text("金山办公");
    const node = schema.nodes.paragraph.create({}, textNode);
    // 光标位置
    let pos;
    if (isFirstInsert) {
      // 首次插入到文档末尾
      pos = state.doc.content.size;
      isFirstInsert = false;
    } else {
      // 非首次插入从光标位置
      pos = selection.from;
    }
    // 插入
    tr.insert(pos, node);
    // 广播事件才会成功
    dispatch(tr);
  };

  const handleText = (type: "bold" | "italic" | "clear") => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    const { from, to } = selection;
    if (type === "bold") {
      // 将选区内容，添加上 strong 的标注
      tr.addMark(from, to, schema.marks.strong.create());
    } else if (type === "italic") {
      // 将选区内容，添加上 em 的标注
      tr.addMark(from, to, schema.marks.em.create());
    } else if (type === "clear") {
      // 清除选区内容的所有标注
      tr.removeMark(from, to);
    }
    dispatch(tr);
  };
</script>
<style scoped>
  .prosemirror-editor {
    border: 1px solid teal;
    padding: 12px;
    min-height: 200px;
  }
</style>
```

## 案例演示

```html
<template>
  <button @click="insertContent">插入文本</button>
  <button @click="handleText('bold')">加粗</button>
  <button @click="handleText('italic')">倾斜</button>
  <button @click="handleText('fontsize')">字体大小</button>
  <button @click="handleText('color')">字体颜色</button>

  <button @click="handleText('clear')">清除</button>
  <div class="prosemirror-editor" ref="prosemirror-editor"></div>
</template>

<script setup lang="ts">
  import { useTemplateRef } from "vue";
  import { EditorView } from "prosemirror-view";
  import { EditorState } from "prosemirror-state";
  import { DOMParser, Schema } from "prosemirror-model";
  import { toggleMark } from "prosemirror-commands";
  import "prosemirror-view/style/prosemirror.css";
  import { onMounted } from "vue";

  // 初始化一个 p 段落
  const content = new window.DOMParser().parseFromString(`<h1>我是标题</h1>`, "text/html").body;

  const prosemirrorEditor = useTemplateRef("prosemirror-editor");
  let editorView: EditorView;
  let isFirstInsert = true; // 标记是否为首次插入

  const customSchema = new Schema({
    nodes: {
      doc: {
        content: "block+",
      },
      paragraph: {
        group: "block",
        content: "inline*",
        parseDOM: [{ tag: "p" }],
        toDOM() {
          return ["p", 0];
        },
      },
      heading: {
        attrs: { level: { default: 1 } },
        content: "inline*",
        group: "block",
        defining: true,
        parseDOM: [
          { tag: "h1", attrs: { level: 1 } },
          { tag: "h2", attrs: { level: 2 } },
          { tag: "h3", attrs: { level: 3 } },
          { tag: "h4", attrs: { level: 4 } },
          { tag: "h5", attrs: { level: 5 } },
          { tag: "h6", attrs: { level: 6 } },
        ],
        toDOM(node) {
          return ["h" + node.attrs.level, 0];
        },
      },
      text: {
        group: "inline",
      },
    },
    marks: {
      strong: {
        parseDOM: [
          { tag: "strong" },
          {
            tag: "b",
            getAttrs: () => null,
          },
          {
            style: "font-weight",
            getAttrs: (value) => {
              return /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) ? null : false;
            },
          },
        ],
        toDOM() {
          return ["strong", 0];
        },
      },
      em: {
        parseDOM: [
          { tag: "i" },
          { tag: "em" },
          {
            style: "font-style=italic",
          },
        ],
        toDOM() {
          return ["em", 0];
        },
      },
      fontsize: {
        attrs: { size: {} },
        parseDOM: [
          {
            style: "font-size",
            getAttrs: (value) => ({ size: value }),
          },
        ],
        toDOM(mark) {
          return ["span", { style: `font-size: ${mark.attrs.size}` }, 0];
        },
      },
      color: {
        attrs: { color: {} },
        parseDOM: [
          {
            style: "color",
            getAttrs: (value) => ({ color: value }),
          },
        ],
        toDOM(mark) {
          return ["span", { style: `color: ${mark.attrs.color}` }, 0];
        },
      },
    },
  });

  onMounted(() => {
    // 1. 提供 schema
    // 2. 创建 schema 生成 state
    const editorState = EditorState.create({
      doc: DOMParser.fromSchema(customSchema).parse(content),
    });
    // 3. 根据 state 生成 view
    editorView = new EditorView(prosemirrorEditor.value, {
      state: editorState,
    });
  });

  const insertContent = () => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    // 创建一个 text 节点
    const textNode = schema.text("金山办公");
    const node = schema.nodes.paragraph.create({}, textNode);
    // 光标位置
    let pos;
    if (isFirstInsert) {
      // 首次插入到文档末尾
      pos = state.doc.content.size;
      isFirstInsert = false;
    } else {
      // 非首次插入从光标位置
      pos = selection.from;
    }
    // 插入
    tr.insert(pos, node);
    // 广播事件才会成功
    dispatch(tr);
  };

  const handleText = (type: "bold" | "italic" | "clear" | "fontsize" | "color") => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    const { from, to } = selection;
    if (from === to) return; // 无选中内容不处理

    if (type === "bold") {
      // tr.addMark(from, to, schema.marks.strong.create())
      toggleMark(schema.marks.strong)(state, dispatch);
    } else if (type === "italic") {
      // tr.addMark(from, to, schema.marks.em.create())
      toggleMark(schema.marks.em)(state, dispatch);
    } else if (type === "fontsize") {
      /* const fontSizeMark = schema.marks.fontsize.create({ size: "20px" })
    tr.addMark(from, to, fontSizeMark) */
      const markType = schema.marks.fontsize;
      const attrs = { size: "20px" };
      toggleMark(markType, attrs)(state, dispatch);
    } else if (type === "color") {
      /* const colorMark = schema.marks.color.create({ color: "red" })
    tr.addMark(from, to, colorMark) */
      const markType = schema.marks.color;
      const attrs = { color: "red" };
      toggleMark(markType, attrs)(state, dispatch);
    } else if (type === "clear") {
      // tr.removeMark(from, to)
      const { tr } = state;
      tr.removeMark(from, to);
      dispatch(tr);
    }

    // dispatch(tr)
    editorView.focus();
  };
</script>
<style scoped>
  .prosemirror-editor {
    border: 1px solid teal;
    padding: 12px;
    min-height: 200px;
  }

  ::selection {
    background-color: #ecd2cb;
    color: inherit; /* 尽量继承原色 */
  }

  ::-moz-selection {
    background-color: #ecd2cb;
    color: inherit;
  }
</style>
```
