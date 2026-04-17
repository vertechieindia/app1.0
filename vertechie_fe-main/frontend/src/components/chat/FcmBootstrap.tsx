import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/apiClient';
import { syncChatFcmToken } from '../../services/fcmService';

/**
 * Registers FCM after login / route changes (SPA navigation without full reload).
 */
const FcmBootstrap = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) return;
    void syncChatFcmToken().catch(() => undefined);
  }, [location.pathname]);

  return null;
};

export default FcmBootstrap;