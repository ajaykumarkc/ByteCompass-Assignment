// Editable Text Component

import { useState } from "react";

const EditableText = ({ text, onSave, placeholder, className }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);
  
    const handleDoubleClick = () => setIsEditing(true);
  
    const handleBlur = () => {
      setIsEditing(false);
      if (value !== text) {
        onSave(value);
      }
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    };
    return isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="bg-white border border-gray-300 rounded px-2 py-1 outline-none"
        />
      ) : (
        <div onDoubleClick={handleDoubleClick} className={className}>
          {text || placeholder}
        </div>
      );
    };

    export default EditableText