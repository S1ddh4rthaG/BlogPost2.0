import React, { useEffect, useState } from "react";
import tools from "./editorjsConfig.js";
import EditorJS from "@editorjs/editorjs";

export default function ReadOnlyEditor(props) {
  const [editor, setEditor] = useState();

  useEffect(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      placeholder: "Start writing here",
      tools: tools,
      minHeight: 0,
      readOnly: true,
      data: props.data,
      onReady: () => {
        setEditor(editor);
      },
    });
  }, []);

  return (
    <div className="editor m-4 position-relative">
      <div className="mt-3" id="editorjs"></div>
    </div>
  );
}
