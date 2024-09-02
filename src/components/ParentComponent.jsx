import React, {useState} from 'react';
import TaskModal from './TaskModal';

const ParentComponent = () => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Define the function to handle moving tasks
    const handleMoveTask = (task, boardId, statusId, priority) => {
        console.log('Moving Task:', task, 'Board:', boardId, 'Status:', statusId, 'Priority:', priority);
        // Implement task move logic here
    };

    return (
        <div>
            <button onClick={() => setIsTaskModalOpen(true)}>Open Task Modal</button>
            {isTaskModalOpen && (
                <TaskModal
                    task={{id: '1', name: 'Sample Task', statusId: 1, labels: ['label1']}}
                    onClose={() => setIsTaskModalOpen(false)}
                    onDelete={(id) => console.log('Delete Task ID:', id)}
                    boards={[{id: 'back', name: 'Back'}, {id: 'front', name: 'Front'}]}
                    statuses={[{id: 1, title: 'To Do'}]}
                    labels={[{id: 'label1', name: 'Label 1', color: 'red'}]}
                    onSaveDate={(date) => console.log('Save Date:', date)}
                    onRemoveDate={() => console.log('Remove Date')}
                    onSavePriority={(priority) => console.log('Save Priority:', priority)}
                    onSaveLabels={(labels) => console.log('Save Labels:', labels)}
                    onMoveTask={handleMoveTask} // Ensure this is included
                />
            )}
        </div>
    );
};

export default ParentComponent;
