import React, { useEffect, useState } from "react";
import tools from "./editorjsConfig.js";
import EditorJS from "@editorjs/editorjs";

export default function Editor(props) {
  const [state, setState] = useState({ status: false, data: {} });
  const [editor, setEditor] = useState();
  const parentSave = props.parentSave;

  useEffect(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      placeholder: "Start writing here",
      minHeight: 0,
      data: props.content,
      tools: tools,
      onReady: (props) => {
        setEditor(editor);
      },
    });
  }, []);

  useEffect(() => {
    if (props.readOnly) editor.readOnly.toggle();
  }, [props.readOnly]);

  useEffect(() => {
    parentSave(state);
  }, [state]);

  function handleSave() {
    editor
      .save()
      .then((editorData) => {
        setState({
          status: true,
          data: editorData,
        });
      })
      .catch((err) => {});
  }

  return (
    <div className="editor ms-4 p-3 position-relative">
      <div
        className="row m-2 position-absolute d-inline-block end-0"
        style={{ top: -65 }}
      >
        <button className="btn span2 text-success" onClick={handleSave}>
          <i className="bi bi-save"></i>
        </button>
      </div>
      <div className="mt-3" id="editorjs"></div>
    </div>
  );
}
