import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

class NotificationManager {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.permission = (typeof window !== 'undefined' && 'Notification' in window) 
      ? Notification.permission 
      : 'default';
  }

  isSupported() {
    return this.isNative || (typeof window !== 'undefined' && 'Notification' in window);
  }

  async requestPermission() {
    if (this.isNative) {
      try {
        const status = await LocalNotifications.requestPermissions();
        return status.display;
      } catch (e) {
        console.warn('Native notification permission error', e);
        return 'denied';
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        this.permission = res;
        return res;
      } catch (e) {
        console.warn('Error requesting web notification permission', e);
        return 'denied';
      }
    }
    return 'denied';
  }

  // Trigger a native OS notification (Android Notification Bar or Desktop OS Notification)
  async notify({ title, body, icon, tag = 'sequence-alert', id = Date.now() }) {
    if (this.isNative) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Number(String(id).slice(-7)),
              schedule: { at: new Date(Date.now() + 100) },
              sound: 'beep.wav',
              smallIcon: 'ic_launcher_round',
              actionTypeId: 'SEQUENCE_ACTION'
            }
          ]
        });
        return;
      } catch (err) {
        console.warn('Capacitor local notification error:', err);
      }
    }

    // Web Notification Fallback
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: icon || '/icon.svg',
          tag,
          renotify: true,
          silent: false
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return notif;
      } catch (err) {
        console.warn('Web notification failed:', err);
      }
    }
  }
}

export const notifications = new NotificationManager();
