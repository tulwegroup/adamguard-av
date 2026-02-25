// Localization System for AdamGuard Pro
// Supports 20+ languages with download-on-demand language packs

export type LanguageCode = 
  | 'en'    // English
  | 'hi'    // Hindi
  | 'es'    // Spanish
  | 'pt'    // Portuguese
  | 'fr'    // French
  | 'ar'    // Arabic
  | 'bn'    // Bengali
  | 'ru'    // Russian
  | 'ja'    // Japanese
  | 'de'    // German
  | 'it'    // Italian
  | 'zh'    // Chinese (Simplified)
  | 'ko'    // Korean
  | 'tr'    // Turkish
  | 'vi'    // Vietnamese
  | 'th'    // Thai
  | 'id'    // Indonesian
  | 'ms'    // Malay
  | 'pl'    // Polish
  | 'nl'    // Dutch
  | 'sw'    // Swahili
  | 'ha';   // Hausa

export interface LanguagePack {
  code: LanguageCode;
  name: string;
  nativeName: string;
  rtl: boolean; // Right-to-left language
  region: string[];
  population: number; // Speaker population in millions
  priority: number; // Implementation priority (1 = highest)
  downloaded: boolean;
  lastUpdated?: Date;
}

// Available languages with metadata
export const AVAILABLE_LANGUAGES: LanguagePack[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, region: ['US', 'GB', 'AU', 'CA'], population: 1500, priority: 1, downloaded: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, region: ['IN'], population: 600, priority: 1, downloaded: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, region: ['ES', 'MX', 'AR', 'CO'], population: 550, priority: 1, downloaded: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, region: ['BR', 'PT'], population: 260, priority: 1, downloaded: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, region: ['FR', 'CA', 'BE', 'CH'], population: 300, priority: 2, downloaded: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, region: ['SA', 'AE', 'EG'], population: 420, priority: 2, downloaded: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', rtl: false, region: ['IN', 'BD'], population: 265, priority: 2, downloaded: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, region: ['RU', 'UA', 'BY'], population: 260, priority: 2, downloaded: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, region: ['JP'], population: 125, priority: 2, downloaded: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, region: ['DE', 'AT', 'CH'], population: 135, priority: 2, downloaded: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, region: ['IT', 'CH'], population: 70, priority: 3, downloaded: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, region: ['CN', 'TW', 'HK'], population: 1300, priority: 2, downloaded: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, region: ['KR'], population: 80, priority: 3, downloaded: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, region: ['TR'], population: 80, priority: 3, downloaded: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false, region: ['VN'], population: 95, priority: 3, downloaded: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false, region: ['TH'], population: 60, priority: 3, downloaded: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false, region: ['ID'], population: 270, priority: 2, downloaded: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', rtl: false, region: ['MY'], population: 80, priority: 3, downloaded: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false, region: ['PL'], population: 45, priority: 3, downloaded: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, region: ['NL', 'BE'], population: 25, priority: 3, downloaded: false },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', rtl: false, region: ['KE', 'TZ', 'UG'], population: 75, priority: 3, downloaded: false },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', rtl: false, region: ['NG', 'NE'], population: 80, priority: 3, downloaded: false }
];

// Translation key structure
export type TranslationKey = string; // Dot-notation key like 'dashboard.title'

// Translation strings interface
export interface TranslationStrings {
  // Common
  [key: string]: string | TranslationStrings;
}

// English translations (base)
export const ENGLISH_TRANSLATIONS: TranslationStrings = {
  common: {
    appName: 'AdamGuard Pro',
    tagline: 'AI-Powered Protection',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    search: 'Search',
    settings: 'Settings',
    help: 'Help',
    logout: 'Logout',
    upgrade: 'Upgrade',
    learnMore: 'Learn More'
  },
  dashboard: {
    title: 'Dashboard',
    protection: 'Protection',
    protected: 'Protected',
    notProtected: 'Not Protected',
    lastScan: 'Last Scan',
    threatsBlocked: 'Threats Blocked',
    filesProtected: 'Files Protected',
    systemHealth: 'System Health',
    runScan: 'Run Scan',
    quickScan: 'Quick Scan',
    fullScan: 'Full Scan',
    customScan: 'Custom Scan',
    aiDeepScan: 'AI Deep Scan'
  },
  scan: {
    title: 'Scan',
    scanning: 'Scanning...',
    filesScanned: 'files scanned',
    threatsFound: 'threats found',
    scanComplete: 'Scan Complete',
    noThreats: 'No threats detected',
    threatsDetected: 'threats detected',
    scanCancelled: 'Scan Cancelled',
    scanProgress: 'Scan Progress'
  },
  quarantine: {
    title: 'Quarantine',
    empty: 'No quarantined files',
    restore: 'Restore',
    delete: 'Delete Permanently',
    restoreConfirm: 'Are you sure you want to restore this file?',
    deleteConfirm: 'Are you sure you want to permanently delete this file?'
  },
  ai: {
    title: 'AI Protection',
    agents: 'AI Agents',
    zeroDay: 'Zero-Day Protection',
    behavioral: 'Behavioral Analysis',
    learning: 'Adaptive Learning',
    active: 'Active',
    idle: 'Idle',
    processing: 'Processing',
    agentSentinel: 'Sentinel Alpha',
    agentGuardian: 'Guardian Beta',
    agentHunter: 'Hunter Gamma',
    agentSentry: 'Sentry Delta'
  },
  settings: {
    title: 'Settings',
    protection: 'Protection Settings',
    notifications: 'Notifications',
    updates: 'Updates',
    language: 'Language',
    theme: 'Theme',
    account: 'Account',
    privacy: 'Privacy',
    about: 'About'
  },
  modes: {
    child: 'Child Mode',
    grandparent: 'Grandparent Mode',
    parent: 'Parent Mode',
    guest: 'Guest Mode',
    normal: 'Normal Mode'
  },
  childMode: {
    title: 'Child Mode',
    contentFilter: 'Content Filter',
    screenTime: 'Screen Time',
    screenTimeLimit: 'Daily Screen Time Limit',
    blockedApps: 'Blocked Apps',
    allowedApps: 'Allowed Apps',
    safeSearch: 'Safe Search',
    geoFencing: 'Geo-Fencing',
    activityReport: 'Activity Report'
  },
  grandparentMode: {
    title: 'Grandparent Mode',
    simplifiedUI: 'Simplified Interface',
    scamProtection: 'Scam Protection',
    scamCallDetection: 'Scam Call Detection',
    suspiciousEmailAlert: 'Suspicious Email Alert',
    oneClickScan: 'One-Click Security Check',
    familySharing: 'Family Sharing',
    largeText: 'Large Text',
    highContrast: 'High Contrast'
  },
  pricing: {
    title: 'Choose Your Plan',
    free: 'Free',
    family: 'Family',
    power: 'Power User',
    monthly: 'Monthly',
    yearly: 'Yearly',
    lifetime: 'Lifetime',
    perMonth: '/month',
    perYear: '/year',
    savePercent: 'Save {percent}%',
    mostPopular: 'Most Popular',
    startFree: 'Start Free',
    upgrade: 'Upgrade',
    currentPlan: 'Current Plan',
    features: 'Features'
  },
  notifications: {
    threatDetected: 'Threat Detected',
    threatBlocked: 'Threat Blocked',
    scanComplete: 'Scan Complete',
    updateAvailable: 'Update Available',
    subscriptionExpiring: 'Subscription Expiring',
    newDevice: 'New Device Connected',
    suspiciousActivity: 'Suspicious Activity'
  },
  errors: {
    networkError: 'Network connection error',
    scanFailed: 'Scan failed',
    updateFailed: 'Update failed',
    loginFailed: 'Login failed',
    permissionDenied: 'Permission denied'
  }
};

// Hindi translations
export const HINDI_TRANSLATIONS: TranslationStrings = {
  common: {
    appName: 'एडमगार्ड प्रो',
    tagline: 'AI-संचालित सुरक्षा',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
    retry: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    back: 'वापस',
    next: 'अगला',
    done: 'हो गया',
    yes: 'हां',
    no: 'नहीं',
    ok: 'ठीक है',
    search: 'खोजें',
    settings: 'सेटिंग्स',
    help: 'मदद',
    logout: 'लॉग आउट',
    upgrade: 'अपग्रेड करें',
    learnMore: 'और जानें'
  },
  dashboard: {
    title: 'डैशबोर्ड',
    protection: 'सुरक्षा',
    protected: 'सुरक्षित',
    notProtected: 'असुरक्षित',
    lastScan: 'अंतिम स्कैन',
    threatsBlocked: 'धमकियां अवरुद्ध',
    filesProtected: 'फाइलें सुरक्षित',
    systemHealth: 'सिस्टम स्वास्थ्य',
    runScan: 'स्कैन करें',
    quickScan: 'त्वरित स्कैन',
    fullScan: 'पूर्ण स्कैन',
    customScan: 'कस्टम स्कैन',
    aiDeepScan: 'AI डीप स्कैन'
  },
  scan: {
    title: 'स्कैन',
    scanning: 'स्कैन हो रहा है...',
    filesScanned: 'फाइलें स्कैन की गईं',
    threatsFound: 'धमकियां मिलीं',
    scanComplete: 'स्कैन पूर्ण',
    noThreats: 'कोई धमकी नहीं मिली',
    threatsDetected: 'धमकियां पाई गईं',
    scanCancelled: 'स्कैन रद्द',
    scanProgress: 'स्कैन प्रगति'
  },
  modes: {
    child: 'बाल मोड',
    grandparent: 'दादा-दादी मोड',
    parent: 'माता-पिता मोड',
    guest: 'अतिथि मोड',
    normal: 'सामान्य मोड'
  },
  pricing: {
    title: 'अपनी योजना चुनें',
    free: 'मुफ्त',
    family: 'परिवार',
    power: 'पावर यूजर',
    monthly: 'मासिक',
    yearly: 'वार्षिक',
    lifetime: 'जीवनभर',
    perMonth: '/महीना',
    perYear: '/साल',
    savePercent: '{percent}% बचाएं',
    mostPopular: 'सबसे लोकप्रिय',
    startFree: 'मुफ्त शुरू करें',
    upgrade: 'अपग्रेड करें',
    currentPlan: 'वर्तमान योजना',
    features: 'विशेषताएं'
  }
};

// Spanish translations
export const SPANISH_TRANSLATIONS: TranslationStrings = {
  common: {
    appName: 'AdamGuard Pro',
    tagline: 'Protección con IA',
    loading: 'Cargando...',
    error: 'Se produjo un error',
    retry: 'Reintentar',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    done: 'Hecho',
    yes: 'Sí',
    no: 'No',
    ok: 'Aceptar',
    search: 'Buscar',
    settings: 'Configuración',
    help: 'Ayuda',
    logout: 'Cerrar sesión',
    upgrade: 'Actualizar',
    learnMore: 'Más información'
  },
  dashboard: {
    title: 'Panel de control',
    protection: 'Protección',
    protected: 'Protegido',
    notProtected: 'Sin protección',
    lastScan: 'Último análisis',
    threatsBlocked: 'Amenazas bloqueadas',
    filesProtected: 'Archivos protegidos',
    systemHealth: 'Estado del sistema',
    runScan: 'Ejecutar análisis',
    quickScan: 'Análisis rápido',
    fullScan: 'Análisis completo',
    customScan: 'Análisis personalizado',
    aiDeepScan: 'Análisis profundo con IA'
  },
  scan: {
    title: 'Análisis',
    scanning: 'Analizando...',
    filesScanned: 'archivos analizados',
    threatsFound: 'amenazas encontradas',
    scanComplete: 'Análisis completado',
    noThreats: 'Sin amenazas detectadas',
    threatsDetected: 'amenazas detectadas',
    scanCancelled: 'Análisis cancelado',
    scanProgress: 'Progreso del análisis'
  },
  modes: {
    child: 'Modo infantil',
    grandparent: 'Modo abuelos',
    parent: 'Modo padres',
    guest: 'Modo invitado',
    normal: 'Modo normal'
  },
  pricing: {
    title: 'Elige tu plan',
    free: 'Gratis',
    family: 'Familia',
    power: 'Usuario avanzado',
    monthly: 'Mensual',
    yearly: 'Anual',
    lifetime: 'Vitalicio',
    perMonth: '/mes',
    perYear: '/año',
    savePercent: 'Ahorra {percent}%',
    mostPopular: 'Más popular',
    startFree: 'Empezar gratis',
    upgrade: 'Actualizar',
    currentPlan: 'Plan actual',
    features: 'Características'
  }
};

// Portuguese translations
export const PORTUGUESE_TRANSLATIONS: TranslationStrings = {
  common: {
    appName: 'AdamGuard Pro',
    tagline: 'Proteção com IA',
    loading: 'Carregando...',
    error: 'Ocorreu um erro',
    retry: 'Tentar novamente',
    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    done: 'Concluído',
    yes: 'Sim',
    no: 'Não',
    ok: 'OK',
    search: 'Buscar',
    settings: 'Configurações',
    help: 'Ajuda',
    logout: 'Sair',
    upgrade: 'Atualizar',
    learnMore: 'Saiba mais'
  },
  dashboard: {
    title: 'Painel',
    protection: 'Proteção',
    protected: 'Protegido',
    notProtected: 'Desprotegido',
    lastScan: 'Última verificação',
    threatsBlocked: 'Ameaças bloqueadas',
    filesProtected: 'Arquivos protegidos',
    systemHealth: 'Saúde do sistema',
    runScan: 'Executar verificação',
    quickScan: 'Verificação rápida',
    fullScan: 'Verificação completa',
    customScan: 'Verificação personalizada',
    aiDeepScan: 'Verificação profunda com IA'
  },
  scan: {
    title: 'Verificação',
    scanning: 'Verificando...',
    filesScanned: 'arquivos verificados',
    threatsFound: 'ameaças encontradas',
    scanComplete: 'Verificação concluída',
    noThreats: 'Nenhuma ameaça detectada',
    threatsDetected: 'ameaças detectadas',
    scanCancelled: 'Verificação cancelada',
    scanProgress: 'Progresso da verificação'
  },
  modes: {
    child: 'Modo infantil',
    grandparent: 'Modo avôs',
    parent: 'Modo pais',
    guest: 'Modo convidado',
    normal: 'Modo normal'
  },
  pricing: {
    title: 'Escolha seu plano',
    free: 'Grátis',
    family: 'Família',
    power: 'Usuário avançado',
    monthly: 'Mensal',
    yearly: 'Anual',
    lifetime: 'Vitalício',
    perMonth: '/mês',
    perYear: '/ano',
    savePercent: 'Economize {percent}%',
    mostPopular: 'Mais popular',
    startFree: 'Começar grátis',
    upgrade: 'Atualizar',
    currentPlan: 'Plano atual',
    features: 'Recursos'
  }
};

// Language pack store
const LANGUAGE_PACKS: Partial<Record<LanguageCode, TranslationStrings>> = {
  en: ENGLISH_TRANSLATIONS,
  hi: HINDI_TRANSLATIONS,
  es: SPANISH_TRANSLATIONS,
  pt: PORTUGUESE_TRANSLATIONS
};

// Localization manager class
export class LocalizationManager {
  private currentLanguage: LanguageCode = 'en';
  private translations: TranslationStrings = ENGLISH_TRANSLATIONS;
  private downloadedPacks: Set<LanguageCode> = new Set(['en']);
  
  constructor(initialLanguage?: LanguageCode) {
    if (initialLanguage) {
      this.setLanguage(initialLanguage);
    }
  }
  
  public getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }
  
  public getLanguageInfo(code?: LanguageCode): LanguagePack | undefined {
    return AVAILABLE_LANGUAGES.find(l => l.code === (code || this.currentLanguage));
  }
  
  public getAllLanguages(): LanguagePack[] {
    return AVAILABLE_LANGUAGES;
  }
  
  public async setLanguage(code: LanguageCode): Promise<boolean> {
    // Check if language pack is downloaded
    if (!this.downloadedPacks.has(code)) {
      const downloaded = await this.downloadLanguagePack(code);
      if (!downloaded) {
        console.warn(`Failed to download language pack for ${code}, falling back to English`);
        return false;
      }
    }
    
    const translations = LANGUAGE_PACKS[code];
    if (translations) {
      this.currentLanguage = code;
      this.translations = translations;
      return true;
    }
    
    return false;
  }
  
  public async downloadLanguagePack(code: LanguageCode): Promise<boolean> {
    // In production, this would fetch from CDN
    // For now, we'll simulate with available translations
    
    if (LANGUAGE_PACKS[code]) {
      this.downloadedPacks.add(code);
      return true;
    }
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mark as downloaded even if we don't have translations
    // (fallback to English will be used)
    this.downloadedPacks.add(code);
    return true;
  }
  
  public isLanguageDownloaded(code: LanguageCode): boolean {
    return this.downloadedPacks.has(code);
  }
  
  public translate(key: TranslationKey, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: string | TranslationStrings = this.translations;
    
    for (const k of keys) {
      if (typeof value === 'string') {
        return key; // Key path too deep
      }
      value = value[k];
      if (value === undefined) {
        // Fallback to English
        let fallback: string | TranslationStrings = ENGLISH_TRANSLATIONS;
        for (const fk of keys) {
          if (typeof fallback === 'string') break;
          fallback = fallback[fk];
        }
        value = typeof fallback === 'string' ? fallback : key;
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return String(params[paramKey] ?? `{${paramKey}}`);
      });
    }
    
    return value;
  }
  
  public t(key: TranslationKey, params?: Record<string, string | number>): string {
    return this.translate(key, params);
  }
  
  public isRTL(): boolean {
    const lang = this.getLanguageInfo();
    return lang?.rtl ?? false;
  }
  
  public detectLanguageFromSystem(): LanguageCode {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0] as LanguageCode;
      if (AVAILABLE_LANGUAGES.some(l => l.code === browserLang)) {
        return browserLang;
      }
    }
    return 'en';
  }
  
  public getDownloadedPacks(): LanguageCode[] {
    return Array.from(this.downloadedPacks);
  }
}

// Singleton instance
let localizationInstance: LocalizationManager | null = null;

export function getLocalizationManager(): LocalizationManager {
  if (!localizationInstance) {
    localizationInstance = new LocalizationManager();
  }
  return localizationInstance;
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  return getLocalizationManager().translate(key, params);
}

export function resetLocalization(): void {
  localizationInstance = null;
}
