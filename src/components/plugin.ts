import { EditorState } from "draft-js";

export interface TPluginActionProps {
  editorState: EditorState;
  changeEditorState: (editorState: EditorState) => void;
}

export interface TPliginViewProps {
  type: string;
  className?: string;
  data: any;
}
