export const toastOptions = {
  duration: 3000,
  style: {
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  success: {
    style: {
      background: 'rgba(10, 20, 50, 0.95)',
      color: 'white',
      border: '1px solid rgba(147, 197, 253, 0.3)',
    },
    iconTheme: {
      primary: 'white',
      secondary: 'rgba(10, 20, 50, 0.95)',
    },
  },
  error: {
    style: {
      background: 'rgba(20, 10, 10, 0.95)',
      color: 'white',
      border: '1px solid rgba(248, 113, 113, 0.3)',
    },
    iconTheme: {
      primary: '#f87171',
      secondary: 'rgba(20, 10, 10, 0.95)',
    },
  },
};
