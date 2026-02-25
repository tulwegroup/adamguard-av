!include "MUI2.nsh"

; Custom installer pages
!define MUI_WELCOMEPAGE_TITLE "Welcome to AdamGuard Pro Setup"
!define MUI_WELCOMEPAGE_TEXT "AdamGuard Pro provides AI-powered antivirus protection with real-time threat detection, zero-day protection, and proactive security monitoring.$\r$\n$\r$\nClick Install to continue."

!define MUI_FINISHPAGE_TITLE "AdamGuard Pro Installation Complete"
!define MUI_FINISHPAGE_TEXT "AdamGuard Pro is now installed and protecting your system.$\r$\n$\r$\nYour system is being actively monitored by our AI-powered protection engine."
!define MUI_FINISHPAGE_RUN "$INSTDIR\AdamGuard Pro.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch AdamGuard Pro now"

; Custom header image
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "welcome.bmp"

; Interface settings
!define MUI_ABORTWARNING
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"

; Language
!insertmacro MUI_LANGUAGE "English"

; Install pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "license.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstall pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Installation directory
InstallDir "$PROGRAMFILES64\AdamGuard Pro"

; Request admin privileges
RequestExecutionLevel admin

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Copy all files
  File /r "${DIST_DIR}\*.*"
  
  ; Create directories
  CreateDirectory "$INSTDIR\data"
  CreateDirectory "$INSTDIR\logs"
  CreateDirectory "$INSTDIR\quarantine"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Register application
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AdamGuard Pro" \
                   "DisplayName" "AdamGuard Pro"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AdamGuard Pro" \
                   "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AdamGuard Pro" \
                   "DisplayIcon" "$INSTDIR\AdamGuard Pro.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AdamGuard Pro" \
                   "Publisher" "AdamGuard Security"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AdamGuard Pro" \
                   "DisplayVersion" "${VERSION}"
  
  ; Start menu shortcuts
  CreateDirectory "$SMPROGRAMS\AdamGuard Pro"
  CreateShortCut "$SMPROGRAMS\AdamGuard Pro\AdamGuard Pro.lnk" "$INSTDIR\AdamGuard Pro.exe"
  CreateShortCut "$SMPROGRAMS\AdamGuard Pro\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  
  ; Desktop shortcut
  CreateShortCut "$DESKTOP\AdamGuard Pro.lnk" "$INSTDIR\AdamGuard Pro.exe"
  
  ; Auto-start entry
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" \
                   "AdamGuard Pro" "$\"$INSTDIR\AdamGuard Pro.exe$\" --minimized"
SectionEnd

Section "Uninstall"
  ; Remove files
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  RMDir /r "$SMPROGRAMS\AdamGuard Pro"
  Delete "$DESKTOP\AdamGuard Pro.lnk"
  
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AdamGuard Pro"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "AdamGuard Pro"
  
  ; Remove AppData
  RMDir /r "$APPDATA\AdamGuard Pro"
SectionEnd
