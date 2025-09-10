import React, { lazy, Suspense } from "react";
import "react-quill/dist/quill.snow.css";

// Lazy load ReactQuill
const ReactQuill = lazy(() => import("react-quill"));

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="p-4">
      <Suspense fallback={<div>Loading editor...</div>}>
        <ReactQuill theme="snow" value={value} onChange={onChange} />
      </Suspense>
    </div>
  );
};

export default RichTextEditor;
