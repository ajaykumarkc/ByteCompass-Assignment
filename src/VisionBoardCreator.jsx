import React, { useState, useEffect, useRef } from 'react';
import ComponentControls from './components/ComponentControls';
import EditableText from './components/EditableText';
import Sidebar from './components/Sidebar';
import { Save, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';


// Component Types
const componentTypes = {
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  CARD: 'card',
  NAVBAR: 'navbar',
  IMAGE: 'image'
}; 

// Main Component
const VisionBoardCreator = () => {

  const [components, setComponents] = useState(() => {
    const savedComponents = localStorage.getItem('visionBoardComponents');
    return savedComponents ? JSON.parse(savedComponents) : [];
  });

  const [draggedComponent, setDraggedComponent] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);


  //SAVE FUNCTION
  const handleSave = () => {
    const savedData = JSON.stringify(components);
    localStorage.setItem('visionBoardData', savedData);
    setAlertMessage('Vision board saved successfully! ✨');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };


  //CLEAR BOARD FUNCTION
  const handleClear = () => {
    localStorage.clear();
    setComponents([]);
    setAlertMessage('Vision board cleared! Start fresh 🎨');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
    
  };

  // Load saved components on mount
  useEffect(() => {
    const savedComponents = localStorage.getItem('visionBoardComponents');
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
  }, []);

  // Save components when updated (AUTOSAVE FEATURE)
  useEffect(() => {
    localStorage.setItem('visionBoardComponents', JSON.stringify(components));
  }, [components]);

  //FUNCTION FOR DRAG START FROM SIDEBAR TO CANVAS
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  //FUNCTION FOR DRAG START INSIDE THE CANVAS
  const handleComponentDragStart = (e, component) => {
    e.stopPropagation();
    setDraggedComponent(component);
    e.dataTransfer.setData('componentId', component.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image
    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.opacity = '0.5';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  //FUNCTION FOR DROP ON CANVAS MAKING THE CANVAS A DROP TARGET
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const componentType = e.dataTransfer.getData('componentType');
    const componentId = e.dataTransfer.getData('componentId');
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (componentId && draggedComponent) {
      // Moving existing component
      setComponents(components.map(comp =>
        comp.id.toString() === componentId
          ? { ...comp, position: { x, y } }
          : comp
      ));
    } else if (componentType) {
      // Creating new component
      const newComponent = {
        id: Date.now(),
        type: componentType,
        position: { x, y },
        rotation: 0,
        content: componentType === componentTypes.CARD 
          ? { title: 'Card Title', description: 'Card Description' }
          : componentType === componentTypes.NAVBAR
          ? { brand: 'Brand', about: 'About', contact: 'Contact' }
          : 'New Component'
      };
      setComponents([...components, newComponent]);
    }
    setDraggedComponent(null);
  };

  //FUNCTION TO DRAG OVER THE CANVAS
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
    e.dataTransfer.dropEffect = 'move';
  };

  //DRAG END FUNCTION FOR AN EXISTING COMPONENT ON CANVAS
  const handleDragEnd = () => {
    setDraggedComponent(null);
    
  };

  //FUCTION TO INDICATE UI CHANGE AFTER DRAG COMPLETES
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };


  //IMAGE UPLOAD FUNCTION
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          // Create new image element to get dimensions
          const img = new Image();
          img.onload = () => {
            const maxWidth = 300; // Maximum width for uploaded images
            const scale = maxWidth / img.width;
            const width = maxWidth;
            const height = img.height * scale;

            const newComponent = {
              id: Date.now(),
              type: componentTypes.IMAGE,
              position: { x: 100, y: 100 },
              rotation: 0,
              content: {
                url: reader.result,
                alt: file.name,
                width,
                height
              }
            };
            setComponents([...components, newComponent]);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
    // Reset file input
    e.target.value = '';
  };


  //CONDITIONAL RENDERING
  const renderComponent = (component) => {
    // Base border style class that will be applied to all components
    const baseBorderClass = "border-2 border-gray-200 hover:border-blue-400";
    
    switch (component.type) {
      case componentTypes.HEADING:
        return (
          <div className={`relative group rounded-lg ${baseBorderClass}`} style={{ transition: 'transform 0.5s ease-in-out' }}>
            <EditableText
              text={component.content}
              onSave={(newContent) => handleContentUpdate(component.id, newContent)}
              placeholder="Enter heading"
              className="text-3xl font-bold p-4 cursor-move min-w-[200px]"
            />
            <ComponentControls
              onDelete={() => handleDelete(component.id)}
              onRotate={(angle) => handleRotate(component.id, angle)}
            />
          </div>
        );

      case componentTypes.PARAGRAPH:
        return (
          <div className={`relative group rounded-lg ${baseBorderClass}`} style={{ transition: 'transform 0.5s ease-in-out' }}>
            <EditableText
              text={component.content}
              onSave={(newContent) => handleContentUpdate(component.id, newContent)}
              placeholder="Enter text"
              className="p-4 cursor-move min-w-[200px]"
            />
            <ComponentControls
              onDelete={() => handleDelete(component.id)}
              onRotate={(angle) => handleRotate(component.id, angle)}
            />
          </div>
        );

      case componentTypes.CARD:
        return (
          <div className={`relative group rounded-lg ${baseBorderClass}`} style={{ transition: 'transform 0.5s ease-in-out' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-64">
              <EditableText
                text={component.content.title}
                onSave={(newContent) => handleContentUpdate(component.id, newContent, 'title')}
                placeholder="Card Title"
                className="text-xl font-semibold mb-2"
              />
              <EditableText
                text={component.content.description}
                onSave={(newContent) => handleContentUpdate(component.id, newContent, 'description')}
                placeholder="Card Description"
                className="text-gray-600"
              />
            </div>
            <ComponentControls
              onDelete={() => handleDelete(component.id)}
              onRotate={(angle) => handleRotate(component.id, angle)}
            />
          </div>
        );

      case componentTypes.NAVBAR:
        return (
          <div className={`relative group rounded-lg ${baseBorderClass}`} style={{ transition: 'transform 0.5s ease-in-out' }}>
            <nav className="bg-white shadow-lg p-4 flex justify-between items-center min-w-[400px]">
              <EditableText
                text={component.content.brand}
                onSave={(newContent) => handleContentUpdate(component.id, newContent, 'brand')}
                placeholder="Brand"
                className="font-bold text-xl"
              />
              <div className="space-x-6">
                <EditableText
                  text={component.content.about}
                  onSave={(newContent) => handleContentUpdate(component.id, newContent, 'about')}
                  placeholder="About"
                  className="inline-block"
                />
                <EditableText
                  text={component.content.contact}
                  onSave={(newContent) => handleContentUpdate(component.id, newContent, 'contact')}
                  placeholder="Contact"
                  className="inline-block"
                />
              </div>
            </nav>
            <ComponentControls
              onDelete={() => handleDelete(component.id)}
              onRotate={(angle) => handleRotate(component.id, angle)}
            />
          </div>
        );

      case componentTypes.IMAGE:
        return (
          <div className={`relative group rounded-lg ${baseBorderClass}`} style={{ transition: 'transform 0.5s ease-in-out' }}>
            <img 
              src={component.content.url} 
              alt={component.content.alt} 
              style={{
                width: component.content.width || 'auto',
                height: component.content.height || 'auto'
              }}
              className="rounded-lg shadow-lg"
            />
            <ComponentControls
              onDelete={() => handleDelete(component.id)}
              onRotate={(angle) => handleRotate(component.id, angle)}
            />
          </div>
        );

      default:
        return null;
    }
  };


  //DELETE , ROTATE AND TEXT UPDATE FUNCTIONS
  const handleDelete = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const handleRotate = (id, angle) => {
    setComponents(components.map(comp =>
      comp.id === id ? { ...comp, rotation: (comp.rotation + angle) % 360 } : comp
    ));
  };

  const handleContentUpdate = (id, newContent, field = null) => {
    setComponents(components.map(comp =>
      comp.id === id
        ? {
            ...comp,
            content: field
              ? { ...comp.content, [field]: newContent }
              : newContent
          }
        : comp
    ));
  };


  //HTML
  return (
    <div className="flex h-screen bg-gray-100">
    <Sidebar 
      onDragStart={handleDragStart}
      onImageClick={() => fileInputRef.current?.click()} 
      className="shadow-lg"
    />
    
    <div className="flex-1 relative">
      <div className="flex justify-between items-center p-6 bg-gray-50 shadow-md relative">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75" />
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
          Vision Board Creator
        </h1>
        
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg 
              hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out
              transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Save size={20} className="transform group-hover:rotate-12 transition-transform duration-300" />
            <span>Save Board</span>
          </button>
          
          <button
            onClick={handleClear}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg
              hover:from-red-700 hover:to-red-800 transition-all duration-300 ease-in-out
              transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Trash2 size={20} className="transform group-hover:-rotate-12 transition-transform duration-300" />
            <span>Clear Board</span>
          </button>
        </div>
      </div>
      
      {showSaveAlert && (
        <div className="absolute top-24 right-6 z-50 flex items-center gap-3 bg-gray-50 border-l-4 border-green-600 
          text-gray-800 px-6 py-4 rounded-lg shadow-xl animate-slide-in">
          <CheckCircle size={20} className="text-green-600 animate-bounce-subtle" />
          <span className="font-medium">{alertMessage}</span>
        </div>
      )}

      <div
        ref={canvasRef}
        className={`h-[calc(100vh-88px)] relative bg-gray-200 overflow-auto p-8 transition-colors duration-300
          ${isDraggingOver ? 'bg-blue-100 ring-2 ring-blue-400 ring-opacity-50' : ''}
          bg-[url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300
          ${isDraggingOver ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-blue-200 bg-opacity-90 rounded-xl p-8 shadow-lg">
            <ImageIcon size={48} className="text-blue-600 mx-auto mb-4 animate-bounce-subtle" />
            <p className="text-blue-800 font-medium text-lg text-center">Drop elements here to add to your vision board</p>
          </div>
        </div>
        
        {components.map((component) => (
          <div
            key={component.id}
            className="absolute cursor-move transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out"
            style={{
              left: component.position.x,
              top: component.position.y,
              zIndex: components.indexOf(component),
              transform: `rotate(${component.rotation}deg)`,
              transformOrigin: 'center',
            }}
            draggable
            onDragStart={(e) => handleComponentDragStart(e, component)}
            onDragEnd={handleDragEnd}
          >
            {renderComponent(component)}
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  </div>
  );
};

export default VisionBoardCreator;