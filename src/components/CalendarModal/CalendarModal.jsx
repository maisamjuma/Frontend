import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import './CalendarModal.css';

const CalendarModal = ({onClose, onSave, onRemoveDate}) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSave = () => {
        if (selectedDate) {
            onSave(selectedDate); // Pass the selected date to parent
            onClose(); // Close modal after saving
        }
    };

    const handleRemove = () => {
        onRemoveDate(); // Notify parent to remove date
        onClose(); // Close modal after removing
    };

    return (
        <div className="calendar-modal-overlay"
             onClick={(e) => e.target.classList.contains('calendar-modal-overlay') && onClose()}>
            <div className="calendar-modal-content">
                <h4 className="dates">Dates</h4>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={({date}) =>
                        selectedDate && date.toDateString() === new Date(selectedDate).toDateString() ? 'selected-date' : null
                    }
                />
                <div className="calendar-modal-actions">
                    <button onClick={handleSave} className="calendar-modal-save-button">Save</button>
                    <button onClick={handleRemove} className="calendar-modal-remove-button">Remove Date</button>
                    <button onClick={onClose} className="calendar-modal-cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

CalendarModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onRemoveDate: PropTypes.func.isRequired
};

export default CalendarModal;
