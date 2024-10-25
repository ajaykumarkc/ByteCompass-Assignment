# Vision Board Creator

A dynamic web application that allows users to create personalized vision boards by dragging, dropping, and manipulating various components on a canvas.

## Demo Video
[](https://github.com/user-attachments/assets/7afc69ea-76ca-418d-96cb-64531464d52c)

## Deployed On S3 Bucket Click To Try Out !! 
http://awsbucketajay.s3-website.ap-south-1.amazonaws.com/

## Core Components

### 1. Main Canvas
The primary workspace where users create and customize their vision boards.

### 2. Sidebar
Contains draggable elements that users can add to their canvas:
- Text components
- Cards
- Reordering elements of Navbar Vertically
- Image upload functionality with single click

### 3. Editable Text Component
A reusable component that allows inline text editing for various text elements on the board.

### 4. Component Controls
Provides manipulation options for each component on the canvas:
- Rotation controls
- Delete functionality 

## Key Functions

### Storage Management
```javascript
handleSave() // Manually saves the current board state to localStorage
handleClear() // Clears the entire board and localStorage
// Auto-save functionality using useEffect hooks to persist changes
```

### Drag and Drop Operations
```javascript
handleDragStart() // Initiates drag from sidebar elements
handleComponentDragStart() // Handles dragging of existing components
handleDrop() // Processes component placement on canvas
handleDragOver() // Manages drag visual feedback
handleDragEnd() // Cleanup after drag operations
handleDragLeave() // Handles cursor leaving drop zone
```

### Component Manipulation
```javascript
handleDelete() // Removes components from the board
handleRotate() // Rotates components by specified angles
handleContentUpdate() // Updates text content of components
handleImageUpload() // Processes and adds images to the board
```

## Technical Features

1. **Persistence**
   - Automatic saving of board state
   - Manual save/clear operations
   - localStorage-based persistence

2. **Image Handling**
   - Max width constraint: 300px
   - Automatic aspect ratio preservation
   - Support for various image formats

3. **Component Properties**
```javascript
{
  id: number,
  type: string,
  position: { x: number, y: number },
  rotation: number,
  content: {
    // Varies based on component type:
    // Text: string
    // Card: { title: string, description: string }
    // Image: { url: string, alt: string, width: number, height: number }
    // Navbar: { brand: string, about: string, contact: string }
  }
}
```

## User Interface Features
- Real-time drag and drop feedback
- Visual indicators for drag operations
- Success alerts for save/clear operations
- Ghost images during component dragging
- Responsive positioning system

## Error Handling
- Image upload error management
- Data persistence error handling
- Drag and drop operation safeguards

## Best Practices
1. Component isolation for reusability
2. Consistent state management
3. Efficient DOM updates
4. Responsive design principles
5. User feedback for all operations

## Development Notes
- Uses React's useState and useEffect hooks for state management
- Implements HTML5 Drag and Drop API
- Utilizes localStorage for data persistence
- Maintains component positioning relative to canvas boundaries

## Installation

```bash
# Clone the repository
git clone https://github.com/ajaykumarkc/ByteCompass-Assignment.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. Access the application through your web browser
2. Drag components from the sidebar onto the canvas
3. Use component controls to manipulate elements:
   - Drag to reposition
   - Click to edit text
   - Use control buttons to rotate or delete
4. Changes are automatically saved
5. Use the manual save button for explicit saves
6. Clear board button to start fresh

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

