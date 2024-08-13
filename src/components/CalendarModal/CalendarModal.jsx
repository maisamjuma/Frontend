import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import './CalendarModal.css';

const CalendarModal = ({ onClose, onSave, onRemoveDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSave = () => {
        if (selectedDate) {
            onSave(selectedDate);
            onClose();
        }
    };

    const handleRemove = () => {
        onRemoveDate();
        onClose();
    };

    return (
        <div className="calendar-modal-overlay" onClick={(e) => e.target.classList.contains('calendar-modal-overlay') && onClose()}>
            <div className="calendar-modal-content">
                <button className="calendar-modal-close" onClick={onClose}>
                    ×
                </button>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate || new Date()}
                    tileClassName={({ date }) =>
                        selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected-date' : null
                    }
                />
                <div className="calendar-modal-actions">
                    <button onClick={handleSave} className="calendar-modal-save-button">
                        Save
                    </button>
                    <button onClick={handleRemove} className="calendar-modal-remove-button">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

CalendarModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onRemoveDate: PropTypes.func.isRequired,
};

export default CalendarModal;
