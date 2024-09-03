import axios from 'axios';

// const NOTIFICATIONS_API_BASE_URL = 'http://10.10.30.77:8080/api/notifications';
const NOTIFICATIONS_API_BASE_URL = 'http://10.10.30.77:8080/api/notifications';

class NotificationService {

    // Get Notification by notificationId
    getNotificationById(notificationId) {
        const token = localStorage.getItem("token");
        return axios.get(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Get Notifications by userId
    getNotificationsByUserId(userId) {
        const token = localStorage.getItem("token");
        return axios.get(`${NOTIFICATIONS_API_BASE_URL}/user/${userId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Delete Notification by notificationId
    deleteNotificationById(notificationId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Update Notification by notificationId
    updateNotificationById(notificationId, notificationData) {
        const token = localStorage.getItem("token");
        return axios.put(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`, notificationData, {
            headers: {
                'X-Auth-Token': token,
                'Content-Type': 'application/json'
            }
        });
    }

    // Get All Notifications
    getAllNotifications() {
        const token = localStorage.getItem("token");
        return axios.get(NOTIFICATIONS_API_BASE_URL, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Create Notification
    createNotification(notificationData) {
        const token = localStorage.getItem("token");
        return axios.post(NOTIFICATIONS_API_BASE_URL, notificationData, {
            headers: {
                'X-Auth-Token': token,
                'Content-Type': 'application/json'
            }
        });
    }
}

export default new NotificationService();
