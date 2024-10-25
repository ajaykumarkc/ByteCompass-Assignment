// Component Controls

import { Trash2, RotateCcw, RotateCw } from 'lucide-react';

const ComponentControls = ({ onDelete, onRotate }) => (
    <div className="absolute -top-3 -right-3 hidden group-hover:flex gap-1 bg-white rounded-lg shadow-lg p-1">
      <button
        onClick={() => onRotate(-90)}
        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={() => onRotate(90)}
        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <RotateCw className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 hover:bg-red-100 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );

  export default ComponentControls