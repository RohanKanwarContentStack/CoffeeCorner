/**
 * Development logger - only outputs in development mode.
 */
const isDev = process.env.NODE_ENV === 'development';
const styles = {
  info: 'color: #6B7280; font-weight: normal;',
  success: 'color: #059669; font-weight: normal;',
  warn: 'color: #D97706; font-weight: normal;',
  error: 'color: #DC2626; font-weight: bold;',
  group: 'color: #3B82F6; font-weight: bold;',
  data: 'color: #8B5CF6; font-weight: normal;',
};

const logger = {
  info: (message, ...args) => {
    if (!isDev) return;
    console.log(`%c[INFO] ${message}`, styles.info, ...args);
  },
  success: (message, ...args) => {
    if (!isDev) return;
    console.log(`%c[OK] ${message}`, styles.success, ...args);
  },
  warn: (message, ...args) => {
    if (!isDev) return;
    console.warn(`%c[WARN] ${message}`, styles.warn, ...args);
  },
  error: (message, ...args) => {
    if (!isDev) return;
    console.error(`%c[ERROR] ${message}`, styles.error, ...args);
  },
  group: (title) => {
    if (!isDev) return;
    console.groupCollapsed(`%c${title}`, styles.group);
  },
  groupEnd: () => {
    if (!isDev) return;
    console.groupEnd();
  },
  data: (label, data) => {
    if (!isDev) return;
    console.log(`%c[DATA] ${label}:`, styles.data, data);
  },
};

export default logger;
