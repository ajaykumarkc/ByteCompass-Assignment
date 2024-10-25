import React, { useState } from 'react';
import { Image as ImageIcon, Type, IdCard, Menu, Upload } from 'lucide-react';

const componentTypes = {
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  CARD: 'card',
  NAVBAR: 'navbar',
  IMAGE: 'image'
};

const Sidebar = ({ onDragStart, onImageClick }) => {
  const [components, setComponents] = useState([
    { type: componentTypes.HEADING, icon: <Type />, label: 'Heading' },
    { type: componentTypes.PARAGRAPH, icon: <Type className="w-4" />, label: 'Paragraph' },
    { type: componentTypes.CARD, icon: <IdCard />, label: 'Card' },
    { type: componentTypes.NAVBAR, icon: <Menu />, label: 'Navbar' },
    { type: componentTypes.IMAGE, icon: <Upload />, label: 'Upload Image', isUploadButton: true }
  ]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

  const handleDragStart = (e, index, type) => {
    setDraggedItem(index);
    onDragStart(e, type);
    
    // Create an empty transparent image to remove the default drag preview
    const emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== draggedItem) {
      setDraggedOverItem(index);
    }
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedOverItem !== null && draggedItem !== draggedOverItem) {
      const newComponents = [...components];
      const [reorderedItem] = newComponents.splice(draggedItem, 1);
      newComponents.splice(draggedOverItem, 0, reorderedItem);
      setComponents(newComponents);
    }

    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-screen">
      <h2 className="text-xl font-bold mb-6 text-center">Components</h2>
      <div className="space-y-4">
        {components.map((component, index) => (
          <div
            key={component.type + index}
            className={`p-4 bg-gray-700 rounded-lg cursor-move hover:bg-gray-600 transition-all flex items-center gap-3
              ${draggedItem === index ? 'opacity-50' : ''}
              ${draggedOverItem === index ? 'border-t-2 border-blue-500' : ''}
            `}
            draggable
            onDragStart={(e) => handleDragStart(e, index, component.type)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={() => setDraggedOverItem(null)}
            onClick={component.isUploadButton ? onImageClick : undefined}
            style={{
              transform: `translateY(${draggedOverItem === index ? '8px' : '0'})`,
              transition: 'transform 0.2s ease'
            }}
          >
            {component.icon}
            <span>{component.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;