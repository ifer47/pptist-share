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
const content = new window.DOMParser().parseFromString(
  `<h1>我是标题</h1>`,
  "text/html"
).body;

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
            return /^(bold(er)?|[5-9]\d{2,})$/.test(value as string)
              ? null
              : false;
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

const handleText = (
  type: "bold" | "italic" | "clear" | "fontsize" | "color"
) => {
  const { state, dispatch } = editorView;
  const { schema, selection } = state;
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
