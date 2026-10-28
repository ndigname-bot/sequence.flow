// Web Notifications helper with OS notification support and in-app fallback
class NotificationManager {
  constructor() {
    this.permission = (typeof window !== 'undefined' && 'Notification' in window) 
      ? Notification.permission 
      : 'default';
  }

  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  async requestPermission() {
    if (!this.isSupported()) return 'denied';
    try {
      const res = await Notification.requestPermission();
      this.permission = res;
      return res;
    } catch (e) {
      console.warn('Error requesting notification permission', e);
      return 'denied';
    }
  }

  // Trigger a native OS notification
  notify({ title, body, icon, tag = 'sequence-alert' }) {
    if (!this.isSupported()) return null;

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: icon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563EB"><circle cx="12" cy="12" r="10"/></svg>',
          tag,
          renotify: true,
          requireInteraction: false,
          silent: false
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return notif;
      } catch (err) {
        console.warn('Notification failed:', err);
      }
    }
    return null;
  }
}

export const notifications = new NotificationManager();
