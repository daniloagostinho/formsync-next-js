interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  url?: string;
  method?: string;
  status?: number;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogEntry['level'], message: string, data?: any, context?: { url?: string; method?: string; status?: number }) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      ...context
    };

    this.logs.push(logEntry);
    
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console
    const consoleMethod = level === 'error' ? console.error : 
                         level === 'warn' ? console.warn : 
                         console.log;
    
    consoleMethod(`[${level.toUpperCase()}] ${message}`, data || '');

    // Save to localStorage for persistence
    this.saveToStorage();
  }

  info(message: string, data?: any, context?: { url?: string; method?: string; status?: number }) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: { url?: string; method?: string; status?: number }) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: { url?: string; method?: string; status?: number }) {
    this.log('error', message, data, context);
  }

  debug(message: string, data?: any, context?: { url?: string; method?: string; status?: number }) {
    this.log('debug', message, data, context);
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('app_logs', JSON.stringify(this.logs));
      } catch (error) {
        console.error('Failed to save logs to localStorage:', error);
      }
    }
  }

  loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('app_logs');
        if (stored) {
          this.logs = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load logs from localStorage:', error);
      }
    }
  }

  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.saveToStorage();
  }

  exportLogs(): string {
    const logText = this.logs.map(log => {
      const context = log.url ? ` | ${log.method} ${log.url}` : '';
      const status = log.status ? ` | Status: ${log.status}` : '';
      return `[${log.timestamp}] [${log.level.toUpperCase()}]${context}${status} ${log.message}${log.data ? ' | Data: ' + JSON.stringify(log.data) : ''}`;
    }).join('\n');

    return logText;
  }

  downloadLogs() {
    const logText = this.exportLogs();
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Get logs filtered by level
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs filtered by URL
  getLogsByUrl(url: string): LogEntry[] {
    return this.logs.filter(log => log.url?.includes(url));
  }

  // Get error logs only
  getErrorLogs(): LogEntry[] {
    return this.getLogsByLevel('error');
  }

  // Get API-related logs
  getApiLogs(): LogEntry[] {
    return this.logs.filter(log => log.url || log.message.includes('API_CLIENT'));
  }
}

export const logger = new Logger();

// Initialize logger on module load
if (typeof window !== 'undefined') {
  logger.loadFromStorage();
}
