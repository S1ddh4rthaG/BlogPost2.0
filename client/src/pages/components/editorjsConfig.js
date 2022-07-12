//Tools
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";

const tools = {
  header: { class: Header },
  embed: { class: Embed },
  table: { class: Table },
  list: { class: List },
  warning: { class: Warning },
  code: { class: Code },
  linkTool: { class: LinkTool },
  raw: { class: Raw },
  quote: { class: Quote },
  marker: { class: Marker },
  checklist: { class: CheckList },
  delimiter: { class: Delimiter },
  inlineCode: { class: InlineCode },
  SimpleImage: { class: SimpleImage },
};

export default tools;
