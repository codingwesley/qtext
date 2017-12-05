import * as ajaxUpload from "rc-upload/lib/request";
import { QText } from "./index";
import { AtomicBlockUtils, EditorState } from "draft-js";

function uploadPromise(
  option: any,
  onSuccess: Function,
  onError: Function,
  rcSuccess?: (data: any) => string | Promise<string>
): Promise<string> {
  return new Promise((re, rj) => {
    option.onSuccess = function(ret: any, file: any, xhr: any) {
      onSuccess(ret, file, xhr);
      if (rcSuccess) {
        const res = rcSuccess(ret);
        if (typeof res !== "string") {
          res.then(url => {
            re(url);
          });
        } else {
          re(res);
        }

        return;
      }
      re("error");
    };

    option.onError = function(err: any, ret: any, file: any) {
      onError(err, ret, file);
      rj(ret);

      rj("error");
    };

    ajaxUpload(option);
  });
}

export function onPasted(qtext: QText, files: Array<Blob>): void {
  // paste files handle function
  const uploadqueue: Promise<string>[] = [];
  const { rcUploadProps, rcSuccess } = qtext.props;

  // check pasted not is image
  if (files.some(file => file.type.indexOf("image") === -1)) {
    return;
  }

  files.forEach(file => {
    const data = { ...rcUploadProps.data, file };
    const option = {
      action: rcUploadProps.action,
      filename: rcUploadProps.name,
      file,
      data,
      headers: rcUploadProps.headers,
      withCredentials: rcUploadProps.withCredentials
    };

    uploadqueue.push(
      uploadPromise(
        option,
        (ret, xhr) => {
          if (rcUploadProps.onSuccess) {
            rcUploadProps.onSuccess(ret, file, xhr);
          }
        },
        (err, ret) => {
          if (rcUploadProps.onError) {
            rcUploadProps.onError(err, ret, file);
          }
        },
        rcSuccess
      )
    );
  });

  Promise.all(uploadqueue).then(listUrls => {
    if (listUrls.some(s => s === "error")) {
      console.warn(`onpasted upload file error`);
      return;
    }

    // 上传成功
    listUrls.forEach(urlValue => {
      const type = "IMAGE";
      const editorState = qtext.state.editorState;
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        type,
        "IMMUTABLE",
        { url: urlValue }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity
      });

      qtext.onChange(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
      );
    });
  });
}
