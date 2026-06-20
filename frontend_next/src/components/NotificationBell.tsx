'use client';
import { Bell } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useState, useRef, useEffect } from 'react';

export default function NotificationBell() {
  const { notifications, markNotificationsRead } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleOpen}
        className="p-2 hover:bg-paper-card rounded-full relative transition-colors"
      >
        <Bell className="w-5 h-5 text-ink-soft" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-saffron rounded-full border-2 border-paper"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-paper-card border border-line rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-line flex justify-between items-center">
            <h3 className="font-bold text-ink">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-ink-soft text-sm">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-3 border-b border-line last:border-b-0 ${!notif.read ? 'bg-indigo-soft/20' : ''}`}>
                  <p className="text-sm text-ink">{notif.message}</p>
                  <span className="text-xs text-ink-soft font-mono mt-1 block">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
