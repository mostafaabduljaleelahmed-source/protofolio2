import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastState {
  title: string;
  msg: string;
  visible: boolean;
}

export interface UIContextType {
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  isAIChatOpen: boolean;
  openAIChat: () => void;
  closeAIChat: () => void;
  toggleAIChat: () => void;
  isAnalyticsOpen: boolean;
  openAnalytics: () => void;
  closeAnalytics: () => void;
  toggleAnalytics: () => void;
  isGuestbookFormOpen: boolean;
  openGuestbookForm: () => void;
  closeGuestbookForm: () => void;
  toggleGuestbookForm: () => void;
  isGuestbookAdminOpen: boolean;
  openGuestbookAdmin: () => void;
  closeGuestbookAdmin: () => void;
  toggleGuestbookAdmin: () => void;
  isAdminPanelOpen: boolean;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  toggleAdminPanel: () => void;
  isPinModalOpen: boolean;
  openPinModal: () => void;
  closePinModal: () => void;
  isAchievementsOpen: boolean;
  openAchievements: () => void;
  closeAchievements: () => void;
  toggleAchievements: () => void;
  toast: ToastState;
  showToast: (title: string, msg: string) => void;
  hideToast: () => void;
  matrixMode: boolean;
  setMatrixMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isGuestbookFormOpen, setIsGuestbookFormOpen] = useState<boolean>(false);
  const [isGuestbookAdminOpen, setIsGuestbookAdminOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [matrixMode, setMatrixMode] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    title: '',
    msg: '',
    visible: false
  });
  const [timerId, setTimerId] = useState<number | null>(null);

  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const toggleCommandPalette = useCallback(() => setIsCommandPaletteOpen(prev => !prev), []);

  const openAIChat = useCallback(() => setIsAIChatOpen(true), []);
  const closeAIChat = useCallback(() => setIsAIChatOpen(false), []);
  const toggleAIChat = useCallback(() => setIsAIChatOpen(prev => !prev), []);

  const openAnalytics = useCallback(() => setIsAdminPanelOpen(true), []);
  const closeAnalytics = useCallback(() => setIsAdminPanelOpen(false), []);
  const toggleAnalytics = useCallback(() => setIsAdminPanelOpen(prev => !prev), []);

  const openGuestbookForm = useCallback(() => setIsGuestbookFormOpen(true), []);
  const closeGuestbookForm = useCallback(() => setIsGuestbookFormOpen(false), []);
  const toggleGuestbookForm = useCallback(() => setIsGuestbookFormOpen(prev => !prev), []);

  const openGuestbookAdmin = useCallback(() => setIsGuestbookAdminOpen(true), []);
  const closeGuestbookAdmin = useCallback(() => setIsGuestbookAdminOpen(false), []);
  const toggleGuestbookAdmin = useCallback(() => setIsGuestbookAdminOpen(prev => !prev), []);

  const openAdminPanel = useCallback(() => setIsAdminPanelOpen(true), []);
  const closeAdminPanel = useCallback(() => setIsAdminPanelOpen(false), []);
  const toggleAdminPanel = useCallback(() => setIsAdminPanelOpen(prev => !prev), []);

  const openPinModal = useCallback(() => setIsPinModalOpen(true), []);
  const closePinModal = useCallback(() => setIsPinModalOpen(false), []);

  const openAchievements = useCallback(() => setIsAchievementsOpen(true), []);
  const closeAchievements = useCallback(() => setIsAchievementsOpen(false), []);
  const toggleAchievements = useCallback(() => setIsAchievementsOpen(prev => !prev), []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((title: string, msg: string) => {
    setToast({ title, msg, visible: true });
    if (timerId) {
      window.clearTimeout(timerId);
    }
    const newTimer = window.setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
    setTimerId(newTimer);
  }, [timerId]);

  return (
    <UIContext.Provider
      value={{
        isCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        toggleCommandPalette,
        isAIChatOpen,
        openAIChat,
        closeAIChat,
        toggleAIChat,
        isAnalyticsOpen,
        openAnalytics,
        closeAnalytics,
        toggleAnalytics,
        isGuestbookFormOpen,
        openGuestbookForm,
        closeGuestbookForm,
        toggleGuestbookForm,
        isGuestbookAdminOpen,
        openGuestbookAdmin,
        closeGuestbookAdmin,
        toggleGuestbookAdmin,
        isAdminPanelOpen,
        openAdminPanel,
        closeAdminPanel,
        toggleAdminPanel,
        isPinModalOpen,
        openPinModal,
        closePinModal,
        isAchievementsOpen,
        openAchievements,
        closeAchievements,
        toggleAchievements,
        toast,
        showToast,
        hideToast,
        matrixMode,
        setMatrixMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
