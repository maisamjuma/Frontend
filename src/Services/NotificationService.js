import axios from 'axios';

const NOTIFICATIONS_API_BASE_URL = 'http://10.10.30.77:8080/api/notifications';

class NotificationService {

    // Get Notification by notificationId
    getNotificationById(notificationId) {
        return axios.get(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`);
    }

    // Get Notifications by userId
    getNotificationsByUserId(userId) {
        return axios.get(`${NOTIFICATIONS_API_BASE_URL}/user/${userId}`);
    }

    // Delete Notification by notificationId
    deleteNotificationById(notificationId) {
        return axios.delete(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`);
    }

    // Update Notification by notificationId
    updateNotificationById(notificationId, notificationData) {
        return axios.put(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`, notificationData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Get All Notifications
    getAllNotifications() {
        return axios.get(NOTIFICATIONS_API_BASE_URL);
    }

    // Create Notification
    createNotification(notificationData) {
        return axios.post(NOTIFICATIONS_API_BASE_URL, notificationData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default new NotificationService();
