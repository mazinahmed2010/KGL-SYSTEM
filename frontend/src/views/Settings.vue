<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1><i class="fas fa-cog"></i> Settings</h1>
      <div class="breadcrumb">
        <router-link to="/dashboard">Dashboard</router-link>
        <i class="fas fa-chevron-right"></i>
        <span>Settings</span>
      </div>
    </div>

    <div class="settings-container">
      <!-- Settings Navigation -->
      <div class="settings-nav">
        <button 
          v-for="tab in availableTabs" 
          :key="tab.id"
          class="nav-item" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.name }}</span>
          <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
        </button>
      </div>

      <!-- Settings Content -->
      <div class="settings-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <LoadingSpinner text="Loading settings..." />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ error }}</p>
          <button class="btn-retry" @click="loadSettings">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>

        <!-- Settings Panels -->
        <template v-else>
          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="settings-panel">
            <h2>General Settings</h2>
            
            <div class="settings-group">
              <h3>Application Preferences</h3>
              
              <div class="setting-row">
                <div class="setting-info">
                  <label>Language</label>
                  <p>Select your preferred language</p>
                </div>
                <select v-model="settings.general.language" @change="markAsChanged">
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="lg">Luganda</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Date Format</label>
                  <p>How dates should be displayed</p>
                </div>
                <select v-model="settings.general.dateFormat" @change="markAsChanged">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Time Format</label>
                  <p>12-hour or 24-hour format</p>
                </div>
                <select v-model="settings.general.timeFormat" @change="markAsChanged">
                  <option value="12">12-hour (AM/PM)</option>
                  <option value="24">24-hour</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Currency Display</label>
                  <p>How currency values are shown</p>
                </div>
                <select v-model="settings.general.currency" @change="markAsChanged">
                  <option value="UGX">UGX (Ugandan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="KES">KES (Kenyan Shilling)</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Items per Page</label>
                  <p>Number of items to show in lists</p>
                </div>
                <select v-model="settings.general.itemsPerPage" @change="markAsChanged">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            <div class="settings-group">
              <h3>Default Values</h3>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Default Branch</label>
                  <p>Branch to show by default</p>
                </div>
                <select v-model="settings.general.defaultBranch" @change="markAsChanged">
                  <option value="Maganjo">Maganjo</option>
                  <option value="Matugga">Matugga</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Low Stock Threshold</label>
                  <p>Alert when stock falls below (kg)</p>
                </div>
                <input 
                  type="number" 
                  v-model.number="settings.general.lowStockThreshold"
                  min="100"
                  max="5000"
                  step="100"
                  @change="markAsChanged"
                  @input="validateThreshold"
                >
                <span class="threshold-warning" v-if="thresholdWarning">{{ thresholdWarning }}</span>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Auto-refresh Interval</label>
                  <p>How often to refresh data (seconds)</p>
                </div>
                <select v-model="settings.general.refreshInterval" @change="markAsChanged">
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="0">Never</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div v-if="activeTab === 'notifications'" class="settings-panel">
            <h2>Notification Settings</h2>
            
            <div class="settings-group">
              <h3>Email Notifications</h3>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Enable Email Notifications</label>
                  <p>Receive notifications via email</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifications.email.enabled" @change="markAsChanged">
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="setting-row" v-if="settings.notifications.email.enabled">
                <div class="setting-info">
                  <label>Notification Email</label>
                  <p>Email address for notifications</p>
                </div>
                <input 
                  type="email" 
                  v-model="settings.notifications.email.address"
                  :placeholder="userStore.userEmail"
                  @change="markAsChanged"
                >
              </div>

              <div class="setting-row" v-if="settings.notifications.email.enabled">
                <div class="setting-info">
                  <label>Email Frequency</label>
                  <p>How often to send email digests</p>
                </div>
                <select v-model="settings.notifications.email.frequency" @change="markAsChanged">
                  <option value="instant">Instant (real-time)</option>
                  <option value="hourly">Hourly digest</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>
            </div>

            <div class="settings-group">
              <h3>SMS Notifications</h3>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Enable SMS Alerts</label>
                  <p>Receive text messages for urgent alerts</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifications.sms.enabled" @change="markAsChanged">
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="setting-row" v-if="settings.notifications.sms.enabled">
                <div class="setting-info">
                  <label>Phone Number</label>
                  <p>Mobile number for SMS alerts</p>
                </div>
                <input 
                  type="tel" 
                  v-model="settings.notifications.sms.phone"
                  placeholder="0772123456"
                  pattern="[0-9]{10}"
                  @change="markAsChanged"
                  @input="validatePhone"
                >
                <span class="validation-error" v-if="phoneError">{{ phoneError }}</span>
              </div>
            </div>

            <div class="settings-group">
              <h3>Alert Triggers</h3>

              <div class="setting-row toggle-row" v-for="trigger in notificationTriggers" :key="trigger.key">
                <div class="setting-info">
                  <label>{{ trigger.label }}</label>
                  <p>{{ trigger.description }}</p>
                </div>
                <label class="switch">
                  <input 
                    type="checkbox" 
                    v-model="settings.notifications.triggers[trigger.key]" 
                    @change="markAsChanged"
                  >
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="settings-panel">
            <h2>Security Settings</h2>
            
            <div class="settings-group">
              <h3>Password Policy</h3>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Require Strong Passwords</label>
                  <p>Enforce minimum password requirements</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.security.strongPasswords" @change="markAsChanged">
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Password Expiry</label>
                  <p>Force password change after (days)</p>
                </div>
                <select v-model="settings.security.passwordExpiry" @change="markAsChanged">
                  <option value="0">Never</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Session Timeout</label>
                  <p>Auto logout after inactivity (minutes)</p>
                </div>
                <select v-model="settings.security.sessionTimeout" @change="markAsChanged">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Max Login Attempts</label>
                  <p>Lock account after failed attempts</p>
                </div>
                <select v-model="settings.security.maxLoginAttempts" @change="markAsChanged">
                  <option value="3">3 attempts</option>
                  <option value="5">5 attempts</option>
                  <option value="10">10 attempts</option>
                  <option value="0">Unlimited</option>
                </select>
              </div>
            </div>

            <div class="settings-group">
              <h3>Two-Factor Authentication</h3>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Enable 2FA</label>
                  <p>Add an extra layer of security</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.security.twoFactor.enabled" @change="toggle2FA">
                  <span class="slider round"></span>
                </label>
              </div>

              <div v-if="settings.security.twoFactor.enabled && !settings.security.twoFactor.verified" class="two-factor-setup">
                <div class="setup-steps">
                  <h4>Setup Two-Factor Authentication</h4>
                  <ol>
                    <li>Install Google Authenticator or Authy</li>
                    <li>Scan this QR code with the app</li>
                    <li>Enter the 6-digit code below</li>
                  </ol>
                  <div class="qr-code-container">
                    <div class="qr-placeholder" ref="qrCode"></div>
                    <p class="setup-key">Secret Key: <code>{{ twoFactorSecret }}</code></p>
                  </div>
                  <div class="verify-2fa">
                    <input 
                      type="text" 
                      v-model="twoFactorCode" 
                      placeholder="Enter 6-digit code"
                      maxlength="6"
                    >
                    <button class="btn-verify" @click="verify2FA" :disabled="verifying2FA">
                      <span v-if="verifying2FA" class="spinner-small"></span>
                      <i v-else class="fas fa-check"></i>
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="settings.security.twoFactor.enabled && settings.security.twoFactor.verified" class="two-factor-status">
                <i class="fas fa-check-circle"></i>
                <span>Two-factor authentication is enabled</span>
                <button class="btn-disable-2fa" @click="disable2FA">Disable</button>
              </div>
            </div>

            <div class="settings-group">
              <h3>Login History</h3>
              
              <div class="login-history">
                <div v-if="loadingHistory" class="history-loading">
                  <LoadingSpinner text="Loading login history..." />
                </div>
                <table v-else class="history-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>IP Address</th>
                      <th>Device</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="login in loginHistory" :key="login.id">
                      <td>{{ formatDate(login.createdAt) }}</td>
                      <td>{{ login.ipAddress }}</td>
                      <td>{{ login.device }}</td>
                      <td>{{ login.location || 'Unknown' }}</td>
                      <td>
                        <span class="status-badge" :class="login.success ? 'success' : 'failed'">
                          {{ login.success ? 'Success' : 'Failed' }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="loginHistory.length === 0">
                      <td colspan="5" class="text-center">No login history found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="settings-panel">
            <h2>Preferences</h2>
            
            <div class="settings-group">
              <h3>Theme Settings</h3>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Color Theme</label>
                  <p>Choose your preferred theme</p>
                </div>
                <div class="theme-selector">
                  <label class="theme-option">
                    <input type="radio" v-model="settings.preferences.theme" value="light" @change="applyTheme">
                    <span class="theme-preview light"></span>
                    <span>Light</span>
                  </label>
                  <label class="theme-option">
                    <input type="radio" v-model="settings.preferences.theme" value="dark" @change="applyTheme">
                    <span class="theme-preview dark"></span>
                    <span>Dark</span>
                  </label>
                  <label class="theme-option">
                    <input type="radio" v-model="settings.preferences.theme" value="system" @change="applyTheme">
                    <span class="theme-preview system"></span>
                    <span>System</span>
                  </label>
                </div>
              </div>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Compact Mode</label>
                  <p>Show more items with reduced spacing</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.preferences.compactMode" @change="applyCompactMode">
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Show Animations</label>
                  <p>Enable UI animations and transitions</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.preferences.animations" @change="markAsChanged">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

            <div class="settings-group">
              <h3>Dashboard Layout</h3>

              <div class="setting-row">
                <div class="setting-info">
                  <label>Default Dashboard</label>
                  <p>Page to show after login</p>
                </div>
                <select v-model="settings.preferences.defaultDashboard" @change="markAsChanged">
                  <option value="dashboard">Main Dashboard</option>
                  <option value="inventory">Inventory</option>
                  <option value="sales">Sales Terminal</option>
                  <option value="credit">Credit Sales</option>
                </select>
              </div>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Show Quick Stats</label>
                  <p>Display statistics on dashboard</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.preferences.showStats" @change="markAsChanged">
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="setting-row toggle-row">
                <div class="setting-info">
                  <label>Show Recent Activity</label>
                  <p>Display recent transactions</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.preferences.showActivity" @change="markAsChanged">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Branch Settings (Manager/Director only) -->
          <div v-if="activeTab === 'branch' && (userStore.isManager || userStore.isDirector)" class="settings-panel">
            <h2>Branch Settings</h2>
            
            <div class="branch-tabs">
              <button 
                v-for="branch in branches" 
                :key="branch"
                class="branch-tab" 
                :class="{ active: selectedBranch === branch }"
                @click="selectedBranch = branch"
              >
                {{ branch }} Branch
              </button>
            </div>

            <div class="settings-group">
              <h3>Branch Information</h3>

              <div class="setting-row" v-for="field in branchFields" :key="field.key">
                <div class="setting-info">
                  <label>{{ field.label }}</label>
                  <p>{{ field.description }}</p>
                </div>
                <input 
                  v-if="field.type === 'text'"
                  :type="field.type" 
                  v-model="branchSettings[selectedBranch][field.key]"
                  @change="markBranchChanged"
                >
                <input 
                  v-else-if="field.type === 'tel'"
                  type="tel" 
                  v-model="branchSettings[selectedBranch][field.key]"
                  @change="markBranchChanged"
                  @input="validateBranchPhone"
                >
                <input 
                  v-else-if="field.type === 'email'"
                  type="email" 
                  v-model="branchSettings[selectedBranch][field.key]"
                  @change="markBranchChanged"
                >
              </div>
            </div>

            <div class="settings-group">
              <h3>Operating Hours</h3>

              <div class="setting-row" v-for="day in weekDays" :key="day.key">
                <div class="setting-info">
                  <label>{{ day.label }}</label>
                </div>
                <div class="time-range">
                  <input 
                    type="time" 
                    v-model="branchSettings[selectedBranch].hours[day.key].open"
                    @change="markBranchChanged"
                    :disabled="branchSettings[selectedBranch].hours[day.key].closed"
                  >
                  <span>to</span>
                  <input 
                    type="time" 
                    v-model="branchSettings[selectedBranch].hours[day.key].close"
                    @change="markBranchChanged"
                    :disabled="branchSettings[selectedBranch].hours[day.key].closed"
                  >
                  <label class="closed-checkbox">
                    <input 
                      type="checkbox" 
                      v-model="branchSettings[selectedBranch].hours[day.key].closed"
                      @change="toggleClosed(day.key)"
                    >
                    Closed
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Backup & Restore (Manager only) -->
          <div v-if="activeTab === 'backup' && userStore.isManager" class="settings-panel">
            <h2>Backup & Restore</h2>
            
            <div class="backup-grid">
              <div class="backup-card">
                <i class="fas fa-download"></i>
                <h3>Create Backup</h3>
                <p>Download a complete backup of all data</p>
                <button class="btn-backup" @click="createBackup" :disabled="creatingBackup">
                  <span v-if="creatingBackup" class="spinner"></span>
                  <i v-else class="fas fa-file-export"></i>
                  {{ creatingBackup ? 'Creating...' : 'Download Backup' }}
                </button>
              </div>

              <div class="backup-card">
                <i class="fas fa-upload"></i>
                <h3>Restore Backup</h3>
                <p>Restore from a previous backup file</p>
                <label class="btn-restore">
                  <i class="fas fa-file-import"></i> Choose File
                  <input type="file" accept=".json,.kglbak" hidden @change="restoreBackup">
                </label>
              </div>

              <div class="backup-card">
                <i class="fas fa-history"></i>
                <h3>Automatic Backups</h3>
                <p>Configure automatic backup schedule</p>
                <select v-model="backupSchedule" @change="updateBackupSchedule">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>

            <div class="backup-history">
              <h3>Recent Backups</h3>
              <div v-if="loadingBackups" class="history-loading">
                <LoadingSpinner text="Loading backups..." />
              </div>
              <table v-else class="backup-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Type</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="backup in backupHistory" :key="backup.id">
                    <td>{{ formatDate(backup.createdAt) }}</td>
                    <td>{{ formatFileSize(backup.size) }}</td>
                    <td>{{ backup.type }}</td>
                    <td>{{ backup.createdBy }}</td>
                    <td>
                      <button class="btn-icon" @click="downloadBackup(backup)" title="Download">
                        <i class="fas fa-download"></i>
                      </button>
                      <button class="btn-icon" @click="restoreBackupFile(backup)" title="Restore">
                        <i class="fas fa-undo"></i>
                      </button>
                      <button class="btn-icon" @click="deleteBackup(backup)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="backupHistory.length === 0">
                    <td colspan="5" class="text-center">No backups found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- API Access (Director only) -->
          <div v-if="activeTab === 'api' && userStore.isDirector" class="settings-panel">
            <h2>API Access</h2>
            
            <div class="api-keys">
              <div class="api-key-header">
                <h3>API Keys</h3>
                <button class="btn-generate" @click="showGenerateKeyModal = true">
                  <i class="fas fa-plus"></i> Generate New Key
                </button>
              </div>

              <div v-if="loadingKeys" class="loading-state">
                <LoadingSpinner text="Loading API keys..." />
              </div>
              <table v-else class="api-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Created</th>
                    <th>Last Used</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="key in apiKeys" :key="key.id">
                    <td>{{ key.name }}</td>
                    <td>
                      <code>{{ maskApiKey(key.key) }}</code>
                      <button class="btn-copy" @click="copyApiKey(key.key)" title="Copy">
                        <i class="fas fa-copy"></i>
                      </button>
                    </td>
                    <td>{{ formatDate(key.createdAt) }}</td>
                    <td>{{ key.lastUsed ? formatDate(key.lastUsed) : 'Never' }}</td>
                    <td>
                      <span class="status-badge" :class="key.status">
                        {{ key.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-icon" @click="revokeApiKey(key.id)" title="Revoke">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="apiKeys.length === 0">
                    <td colspan="6" class="text-center">No API keys found</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="api-docs">
              <h3>API Documentation</h3>
              <div class="doc-card">
                <h4>Base URL</h4>
                <code>{{ apiBaseUrl }}</code>
              </div>
              <div class="doc-card">
                <h4>Authentication</h4>
                <p>Include your API key in the header:</p>
                <code>Authorization: Bearer YOUR_API_KEY</code>
              </div>
              <div class="doc-card">
                <h4>Rate Limits</h4>
                <ul>
                  <li><i class="fas fa-check"></i> 60 requests per minute</li>
                  <li><i class="fas fa-check"></i> 1000 requests per hour</li>
                  <li><i class="fas fa-check"></i> 10000 requests per day</li>
                </ul>
              </div>
              <button class="btn-docs" @click="viewFullDocs">
                <i class="fas fa-external-link-alt"></i> View Full Documentation
              </button>
            </div>
          </div>

          <!-- Save Indicator -->
          <div class="settings-footer">
            <div class="unsaved-indicator" v-if="hasUnsavedChanges">
              <i class="fas fa-circle"></i>
              <span>You have unsaved changes</span>
            </div>
            <div class="settings-actions">
              <button class="btn-save" @click="saveSettings" :disabled="saving || !hasUnsavedChanges">
                <span v-if="saving" class="spinner"></span>
                <i v-else class="fas fa-save"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button class="btn-reset" @click="resetSettings" :disabled="saving || !hasUnsavedChanges">
                <i class="fas fa-undo"></i> Reset
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Generate API Key Modal -->
    <div v-if="showGenerateKeyModal" class="modal-overlay" @click.self="showGenerateKeyModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-key"></i> Generate API Key</h3>
          <button class="modal-close" @click="showGenerateKeyModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Key Name</label>
            <input 
              type="text" 
              v-model="newKeyName" 
              placeholder="e.g., Production API Key"
              maxlength="50"
            >
          </div>
          <div class="form-group">
            <label>Permissions</label>
            <div class="checkbox-group">
              <label v-for="perm in availablePermissions" :key="perm.value">
                <input type="checkbox" v-model="newKeyPermissions" :value="perm.value">
                {{ perm.label }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Expiration</label>
            <select v-model="newKeyExpiration">
              <option value="never">Never</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="generateApiKey" :disabled="generatingKey">
            <span v-if="generatingKey" class="spinner"></span>
            <i v-else class="fas fa-check"></i>
            Generate
          </button>
          <button class="btn-secondary" @click="showGenerateKeyModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-content confirm-modal">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> {{ confirmTitle }}</h3>
          <button class="modal-close" @click="showConfirmModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn-danger" @click="confirmAction">
            <i class="fas fa-check"></i> Yes, {{ confirmButton }}
          </button>
          <button class="btn-secondary" @click="showConfirmModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useToast } from 'vue-toastification'
import QRCode from 'qrcode'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

// ==================== STATE ====================
const activeTab = ref('general')
const selectedBranch = ref('Maganjo')
const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const hasUnsavedChanges = ref(false)
const changedFields = ref(new Set())

// Settings state
const settings = reactive({
  general: {
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    currency: 'UGX',
    itemsPerPage: 25,
    defaultBranch: 'Maganjo',
    lowStockThreshold: 1000,
    refreshInterval: 60
  },
  notifications: {
    email: {
      enabled: true,
      address: '',
      frequency: 'instant'
    },
    sms: {
      enabled: false,
      phone: ''
    },
    triggers: {
      lowStock: true,
      outOfStock: true,
      creditDue: true,
      dailySummary: false,
      weeklyReport: false
    }
  },
  security: {
    strongPasswords: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactor: {
      enabled: false,
      verified: false,
      secret: ''
    }
  },
  preferences: {
    theme: 'light',
    compactMode: false,
    animations: true,
    defaultDashboard: 'dashboard',
    showStats: true,
    showActivity: true
  }
})

// Branch settings
const branchSettings = ref({
  Maganjo: {
    name: 'Maganjo Branch',
    location: 'Plot 12, Kampala Road, Maganjo',
    phone: '0700123456',
    email: 'maganjo@kgl.co.ug',
    manager: 'John Manager',
    hours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '16:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  Matugga: {
    name: 'Matugga Branch',
    location: 'Plot 45, Matugga Town Centre',
    phone: '0700789012',
    email: 'matugga@kgl.co.ug',
    manager: 'Sarah Manager',
    hours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '16:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  }
})

// Login history
const loginHistory = ref([])
const loadingHistory = ref(false)

// Backup
const backupHistory = ref([])
const loadingBackups = ref(false)
const creatingBackup = ref(false)
const backupSchedule = ref('daily')

// API Keys
const apiKeys = ref([])
const loadingKeys = ref(false)
const showGenerateKeyModal = ref(false)
const generatingKey = ref(false)
const newKeyName = ref('')
const newKeyPermissions = ref([])
const newKeyExpiration = ref('never')

// 2FA
const twoFactorSecret = ref('')
const twoFactorCode = ref('')
const verifying2FA = ref(false)
const qrCode = ref(null)

// Confirm modal
const showConfirmModal = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButton = ref('')
let confirmCallback = null

// Validation
const thresholdWarning = ref('')
const phoneError = ref('')
const branchPhoneError = ref('')

// ==================== COMPUTED ====================
const availableTabs = computed(() => {
  const tabs = [
    { id: 'general', name: 'General', icon: 'fas fa-sliders-h' },
    { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', name: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'preferences', name: 'Preferences', icon: 'fas fa-palette' }
  ]

  if (userStore.isManager || userStore.isDirector) {
    tabs.push({ id: 'branch', name: 'Branches', icon: 'fas fa-store', badge: '2' })
  }

  if (userStore.isManager) {
    tabs.push({ id: 'backup', name: 'Backup', icon: 'fas fa-database' })
  }

  if (userStore.isDirector) {
    tabs.push({ id: 'api', name: 'API', icon: 'fas fa-code' })
  }

  return tabs
})

const branches = computed(() => ['Maganjo', 'Matugga'])

const branchFields = computed(() => [
  { key: 'name', label: 'Branch Name', description: 'Official branch name', type: 'text' },
  { key: 'location', label: 'Location', description: 'Physical address', type: 'text' },
  { key: 'phone', label: 'Phone Number', description: 'Branch contact number', type: 'tel' },
  { key: 'email', label: 'Email', description: 'Branch email address', type: 'email' },
  { key: 'manager', label: 'Branch Manager', description: 'Current branch manager', type: 'text' }
])

const weekDays = computed(() => [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
])

const notificationTriggers = computed(() => [
  { key: 'lowStock', label: 'Low Stock Alerts', description: 'Notify when products fall below threshold' },
  { key: 'outOfStock', label: 'Out of Stock Alerts', description: 'Notify when products run out' },
  { key: 'creditDue', label: 'Credit Payment Due', description: 'Remind when credit payments are due' },
  { key: 'dailySummary', label: 'Daily Sales Summary', description: 'Receive end-of-day sales report' },
  { key: 'weeklyReport', label: 'Weekly Report', description: 'Receive weekly performance report' }
])

const availablePermissions = computed(() => [
  { value: 'read', label: 'Read Only' },
  { value: 'write', label: 'Read & Write' },
  { value: 'admin', label: 'Full Access' }
])

const apiBaseUrl = computed(() => {
  return import.meta.env.VITE_API_URL || 'https://api.kgl.co.ug/v1'
})

// ==================== METHODS ====================
const loadSettings = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Load user settings from backend
    const response = await api.get('/user/settings')
    const userSettings = response.data
    
    // Merge with defaults
    Object.assign(settings, userSettings)
    
    // Load branch settings
    const branchResponse = await api.get('/branches')
    branchSettings.value = branchResponse.data
    
    // Load settings from localStorage as backup
    const localSettings = localStorage.getItem('kgl-settings')
    if (localSettings) {
      const parsed = JSON.parse(localSettings)
      Object.assign(settings, parsed)
    }
    
    // Apply theme
    applyTheme()
    
    toast.success('Settings loaded successfully')
  } catch (err) {
    console.error('Failed to load settings:', err)
    error.value = 'Failed to load settings. Using local defaults.'
    
    // Load from localStorage as fallback
    const localSettings = localStorage.getItem('kgl-settings')
    if (localSettings) {
      Object.assign(settings, JSON.parse(localSettings))
    }
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  
  try {
    // Save to backend
    await api.put('/user/settings', settings)
    
    // Save to localStorage as backup
    localStorage.setItem('kgl-settings', JSON.stringify(settings))
    
    // Apply settings that need immediate effect
    applyTheme()
    updateRefreshInterval()
    
    hasUnsavedChanges.value = false
    changedFields.value.clear()
    
    toast.success('Settings saved successfully')
  } catch (err) {
    console.error('Failed to save settings:', err)
    toast.error('Failed to save settings. Please try again.')
  } finally {
    saving.value = false
  }
}

const resetSettings = () => {
  showConfirm('Reset Settings', 'Are you sure you want to reset all settings to defaults?', 'Reset', async () => {
    try {
      // Reset to defaults
      const response = await api.post('/user/settings/reset')
      Object.assign(settings, response.data)
      
      // Clear localStorage backup
      localStorage.removeItem('kgl-settings')
      
      hasUnsavedChanges.value = false
      changedFields.value.clear()
      
      toast.success('Settings reset to defaults')
    } catch (err) {
      toast.error('Failed to reset settings')
    }
  })
}

const markAsChanged = (field) => {
  hasUnsavedChanges.value = true
  if (field) {
    changedFields.value.add(field)
  }
}

const validateThreshold = () => {
  if (settings.general.lowStockThreshold < 100) {
    thresholdWarning.value = 'Threshold too low - may cause excessive alerts'
  } else if (settings.general.lowStockThreshold > 5000) {
    thresholdWarning.value = 'Threshold too high - may miss critical stock outs'
  } else {
    thresholdWarning.value = ''
  }
  markAsChanged('lowStockThreshold')
}

const validatePhone = () => {
  const phone = settings.notifications.sms.phone
  if (phone && !/^[0-9]{10}$/.test(phone)) {
    phoneError.value = 'Phone number must be 10 digits'
  } else {
    phoneError.value = ''
  }
  markAsChanged('smsPhone')
}

const validateBranchPhone = () => {
  const phone = branchSettings.value[selectedBranch.value].phone
  if (phone && !/^[0-9]{10}$/.test(phone)) {
    branchPhoneError.value = 'Phone number must be 10 digits'
  } else {
    branchPhoneError.value = ''
  }
  markBranchChanged()
}

const markBranchChanged = () => {
  hasUnsavedChanges.value = true
  changedFields.value.add(`branch_${selectedBranch.value}`)
}

const saveBranchSettings = async () => {
  saving.value = true
  
  try {
    await api.put('/branches', branchSettings.value)
    
    hasUnsavedChanges.value = false
    changedFields.value.clear()
    
    toast.success('Branch settings saved successfully')
  } catch (err) {
    toast.error('Failed to save branch settings')
  } finally {
    saving.value = false
  }
}

const toggleClosed = (day) => {
  const hours = branchSettings.value[selectedBranch.value].hours[day]
  if (hours.closed) {
    hours.open = '00:00'
    hours.close = '00:00'
  } else {
    hours.open = '09:00'
    hours.close = '17:00'
  }
  markBranchChanged()
}

const loadLoginHistory = async () => {
  loadingHistory.value = true
  
  try {
    const response = await api.get('/auth/history')
    loginHistory.value = response.data
  } catch (err) {
    console.error('Failed to load login history:', err)
    toast.error('Failed to load login history')
  } finally {
    loadingHistory.value = false
  }
}

const loadBackupHistory = async () => {
  if (!userStore.isManager) return
  
  loadingBackups.value = true
  
  try {
    const response = await api.get('/admin/backups')
    backupHistory.value = response.data
  } catch (err) {
    console.error('Failed to load backups:', err)
  } finally {
    loadingBackups.value = false
  }
}

const loadApiKeys = async () => {
  if (!userStore.isDirector) return
  
  loadingKeys.value = true
  
  try {
    const response = await api.get('/admin/api-keys')
    apiKeys.value = response.data
  } catch (err) {
    console.error('Failed to load API keys:', err)
  } finally {
    loadingKeys.value = false
  }
}

const createBackup = async () => {
  creatingBackup.value = true
  
  try {
    const response = await api.post('/admin/backups', {
      type: 'manual',
      include: ['users', 'inventory', 'sales', 'procurements', 'credits']
    })
    
    // Trigger download
    const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kgl-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    toast.success('Backup created successfully')
    await loadBackupHistory()
  } catch (err) {
    toast.error('Failed to create backup')
  } finally {
    creatingBackup.value = false
  }
}

const restoreBackup = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('backup', file)
  
  showConfirm(
    'Restore Backup',
    'This will overwrite all current data. Are you absolutely sure?',
    'Restore',
    async () => {
      try {
        const response = await api.post('/admin/backups/restore', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        toast.success('Backup restored successfully')
        
        // Reload relevant data
        await productStore.fetchProducts()
      } catch (err) {
        toast.error('Failed to restore backup')
      }
    }
  )
}

const downloadBackup = async (backup) => {
  try {
    const response = await api.get(`/admin/backups/${backup.id}/download`, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kgl-backup-${backup.id}.json`
    a.click()
    
    toast.success('Download started')
  } catch (err) {
    toast.error('Failed to download backup')
  }
}

const restoreBackupFile = (backup) => {
  showConfirm(
    'Restore Backup',
    `Restore backup from ${formatDate(backup.createdAt)}?`,
    'Restore',
    async () => {
      try {
        await api.post(`/admin/backups/${backup.id}/restore`)
        toast.success('Backup restored successfully')
        await productStore.fetchProducts()
      } catch (err) {
        toast.error('Failed to restore backup')
      }
    }
  )
}

const deleteBackup = (backup) => {
  showConfirm(
    'Delete Backup',
    `Are you sure you want to delete the backup from ${formatDate(backup.createdAt)}?`,
    'Delete',
    async () => {
      try {
        await api.delete(`/admin/backups/${backup.id}`)
        toast.success('Backup deleted')
        await loadBackupHistory()
      } catch (err) {
        toast.error('Failed to delete backup')
      }
    }
  )
}

const updateBackupSchedule = async () => {
  try {
    await api.put('/admin/backups/schedule', { schedule: backupSchedule.value })
    toast.success('Backup schedule updated')
  } catch (err) {
    toast.error('Failed to update schedule')
  }
}

const generateApiKey = async () => {
  if (!newKeyName.value) {
    toast.warning('Please enter a key name')
    return
  }
  
  generatingKey.value = true
  
  try {
    const response = await api.post('/admin/api-keys', {
      name: newKeyName.value,
      permissions: newKeyPermissions.value,
      expiresIn: newKeyExpiration.value
    })
    
    apiKeys.value.push(response.data)
    
    // Show the new key to the user
    toast.success(`API Key generated: ${response.data.key}`, {
      timeout: 0,
      closeOnClick: false
    })
    
    showGenerateKeyModal.value = false
    newKeyName.value = ''
    newKeyPermissions.value = ['read']
    newKeyExpiration.value = 'never'
  } catch (err) {
    toast.error('Failed to generate API key')
  } finally {
    generatingKey.value = false
  }
}

const revokeApiKey = (keyId) => {
  showConfirm(
    'Revoke API Key',
    'This will immediately invalidate this API key. Any applications using it will lose access. Continue?',
    'Revoke',
    async () => {
      try {
        await api.delete(`/admin/api-keys/${keyId}`)
        apiKeys.value = apiKeys.value.filter(k => k.id !== keyId)
        toast.success('API key revoked')
      } catch (err) {
        toast.error('Failed to revoke API key')
      }
    }
  )
}

const maskApiKey = (key) => {
  if (!key) return ''
  if (key.length <= 8) return '***'
  return key.substring(0, 4) + '...' + key.substring(key.length - 4)
}

const copyApiKey = (key) => {
  navigator.clipboard.writeText(key)
  toast.success('API key copied to clipboard')
}

const viewFullDocs = () => {
  window.open('https://docs.kgl.co.ug', '_blank')
}

const toggle2FA = async () => {
  if (settings.security.twoFactor.enabled) {
    // Generate 2FA secret
    try {
      const response = await api.post('/auth/2fa/setup')
      twoFactorSecret.value = response.data.secret
      
      // Generate QR code
      if (qrCode.value) {
        QRCode.toCanvas(qrCode.value, response.data.otpauthUrl, {
          width: 200,
          margin: 2
        })
      }
    } catch (err) {
      toast.error('Failed to setup 2FA')
      settings.security.twoFactor.enabled = false
    }
  } else {
    // Disable 2FA
    if (settings.security.twoFactor.verified) {
      showConfirm(
        'Disable 2FA',
        'Are you sure you want to disable two-factor authentication? This will reduce your account security.',
        'Disable',
        async () => {
          try {
            await api.post('/auth/2fa/disable')
            settings.security.twoFactor.verified = false
            twoFactorSecret.value = ''
            toast.success('2FA disabled')
          } catch (err) {
            toast.error('Failed to disable 2FA')
            settings.security.twoFactor.enabled = true
          }
        }
      )
    }
  }
  markAsChanged('2fa')
}

const verify2FA = async () => {
  if (!twoFactorCode.value || twoFactorCode.value.length !== 6) {
    toast.warning('Please enter a 6-digit code')
    return
  }
  
  verifying2FA.value = true
  
  try {
    await api.post('/auth/2fa/verify', { code: twoFactorCode.value })
    settings.security.twoFactor.verified = true
    toast.success('2FA enabled successfully')
    twoFactorCode.value = ''
  } catch (err) {
    toast.error('Invalid verification code')
  } finally {
    verifying2FA.value = false
  }
}

const disable2FA = () => {
  showConfirm(
    'Disable 2FA',
    'Are you sure you want to disable two-factor authentication?',
    'Disable',
    async () => {
      try {
        await api.post('/auth/2fa/disable')
        settings.security.twoFactor.enabled = false
        settings.security.twoFactor.verified = false
        toast.success('2FA disabled')
      } catch (err) {
        toast.error('Failed to disable 2FA')
      }
    }
  )
}

const applyTheme = () => {
  const theme = settings.preferences.theme
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    // System preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  }
}

const applyCompactMode = () => {
  if (settings.preferences.compactMode) {
    document.body.classList.add('compact-mode')
  } else {
    document.body.classList.remove('compact-mode')
  }
  markAsChanged('compactMode')
}

const updateRefreshInterval = () => {
  const interval = settings.general.refreshInterval
  if (interval > 0) {
    // Clear existing interval
    if (window.refreshInterval) {
      clearInterval(window.refreshInterval)
    }
    // Set new interval
    window.refreshInterval = setInterval(() => {
      productStore.fetchProducts()
    }, interval * 1000)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }
  return `${size.toFixed(1)} ${units[unit]}`
}

const showConfirm = (title, message, button, callback) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmButton.value = button
  confirmCallback = callback
  showConfirmModal.value = true
}

const confirmAction = () => {
  if (confirmCallback) {
    confirmCallback()
  }
  showConfirmModal.value = false
  confirmCallback = null
}

// ==================== WATCHERS ====================
watch(activeTab, (newTab) => {
  if (newTab === 'security') {
    loadLoginHistory()
  } else if (newTab === 'backup') {
    loadBackupHistory()
  } else if (newTab === 'api') {
    loadApiKeys()
  }
})

// ==================== LIFECYCLE ====================
onMounted(() => {
  loadSettings()
  
  // Set notification email to user email
  settings.notifications.email.address = userStore.userEmail
  
  // Apply saved preferences
  applyTheme()
  applyCompactMode()
  updateRefreshInterval()
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleThemeChange = (e) => {
    if (settings.preferences.theme === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
  }
  mediaQuery.addEventListener('change', handleThemeChange)
  
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleThemeChange)
    if (window.refreshInterval) {
      clearInterval(window.refreshInterval)
    }
  })
})
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 25px;
}

.page-header h1 {
  font-size: 28px;
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.page-header h1 i {
  color: var(--gold);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-light);
}

.breadcrumb a {
  color: var(--deep-green);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--gold);
}

.breadcrumb i {
  font-size: 10px;
  color: var(--gold);
}

/* Settings Container */
.settings-container {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 25px;
}

/* Settings Navigation */
.settings-nav {
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.nav-item {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 5px;
  border: none;
  background: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-dark);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  position: relative;
}

.nav-item i {
  width: 20px;
  color: var(--gold);
}

.nav-item:hover {
  background: var(--warm-white);
}

.nav-item.active {
  background: var(--deep-green);
  color: white;
}

.nav-item.active i {
  color: var(--gold);
}

.nav-badge {
  position: absolute;
  right: 12px;
  background: var(--gold);
  color: var(--deep-green);
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

/* Settings Content */
.settings-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.settings-panel h2 {
  color: var(--deep-green);
  font-size: 24px;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--gold);
}

.settings-group {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}

.settings-group:last-child {
  border-bottom: none;
}

.settings-group h3 {
  color: var(--deep-green);
  font-size: 18px;
  margin-bottom: 20px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-row.toggle-row {
  padding: 10px 0;
}

.setting-info {
  flex: 1;
  max-width: 60%;
}

.setting-info label {
  font-weight: 600;
  color: var(--text-dark);
  display: block;
  margin-bottom: 3px;
  font-size: 14px;
}

.setting-info p {
  font-size: 12px;
  color: var(--text-light);
  margin: 0;
}

.setting-row input[type="text"],
.setting-row input[type="email"],
.setting-row input[type="tel"],
.setting-row input[type="number"],
.setting-row select {
  width: 250px;
  padding: 8px 12px;
  border: 2px solid var(--border-light);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.setting-row input:focus,
.setting-row select:focus {
  outline: none;
  border-color: var(--gold);
}

.threshold-warning {
  font-size: 11px;
  color: var(--warning);
  margin-left: 15px;
}

.validation-error {
  font-size: 11px;
  color: var(--danger);
  margin-left: 15px;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--deep-green);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--deep-green);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Theme Selector */
.theme-selector {
  display: flex;
  gap: 20px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.theme-option input[type="radio"] {
  display: none;
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  border: 3px solid transparent;
  transition: all 0.3s;
}

.theme-option input[type="radio"]:checked + .theme-preview {
  border-color: var(--gold);
}

.theme-preview.light {
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.theme-preview.dark {
  background: linear-gradient(135deg, #333333, #1a1a1a);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.theme-preview.system {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 2px 8px rgba(102,126,234,0.3);
}

/* Branch Tabs */
.branch-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.branch-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: var(--warm-white);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.branch-tab:hover {
  background: var(--gold);
  color: var(--deep-green);
}

.branch-tab.active {
  background: var(--deep-green);
  color: var(--gold);
}

/* Time Range */
.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.time-range input[type="time"] {
  width: 100px;
  padding: 6px;
  border: 2px solid var(--border-light);
  border-radius: 5px;
}

.time-range input[type="time"]:disabled {
  background: var(--warm-white);
  opacity: 0.6;
}

.closed-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--text-light);
}

/* Two Factor Setup */
.two-factor-setup {
  background: var(--warm-white);
  padding: 25px;
  border-radius: 10px;
  margin-top: 15px;
}

.setup-steps h4 {
  color: var(--deep-green);
  margin-bottom: 15px;
}

.setup-steps ol {
  margin-left: 20px;
  margin-bottom: 20px;
  color: var(--text-dark);
}

.setup-steps li {
  margin-bottom: 8px;
}

.qr-code-container {
  text-align: center;
  margin: 20px 0;
}

.qr-placeholder {
  display: inline-block;
  background: white;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid var(--border-light);
}

.setup-key {
  margin-top: 15px;
  font-size: 14px;
}

.setup-key code {
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.verify-2fa {
  display: flex;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

.verify-2fa input {
  flex: 1;
  padding: 10px;
  border: 2px solid var(--border-light);
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  letter-spacing: 2px;
}

.btn-verify {
  background: var(--deep-green);
  color: var(--gold);
  border: none;
  padding: 0 20px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-verify:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.two-factor-status {
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.two-factor-status i {
  font-size: 20px;
}

.btn-disable-2fa {
  margin-left: auto;
  background: none;
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-disable-2fa:hover {
  background: var(--danger);
  color: white;
}

/* Login History */
.login-history {
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.history-table th {
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px;
  text-align: left;
  position: sticky;
  top: 0;
}

.history-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-light);
}

.history-table tr:hover {
  background: var(--warm-white);
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.success {
  background: var(--success);
  color: white;
}

.status-badge.failed {
  background: var(--danger);
  color: white;
}

.status-badge.active {
  background: var(--success);
  color: white;
}

.status-badge.revoked {
  background: var(--text-light);
  color: white;
}

/* Backup Grid */
.backup-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.backup-card {
  background: var(--warm-white);
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  border-left: 4px solid var(--gold);
}

.backup-card i {
  font-size: 40px;
  color: var(--gold);
  margin-bottom: 15px;
}

.backup-card h3 {
  color: var(--deep-green);
  margin-bottom: 10px;
}

.backup-card p {
  color: var(--text-light);
  font-size: 13px;
  margin-bottom: 20px;
}

.btn-backup {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--deep-green);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-backup:hover:not(:disabled) {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.btn-backup:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-restore {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--info);
  color: white;
  display: inline-block;
}

.btn-restore:hover {
  background: #138496;
  transform: translateY(-2px);
}

.backup-card select {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-light);
  border-radius: 5px;
}

/* Backup History */
.backup-history {
  margin-top: 30px;
}

.backup-history h3 {
  color: var(--deep-green);
  margin-bottom: 15px;
}

.backup-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.backup-table th {
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px;
  text-align: left;
}

.backup-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-light);
}

.backup-table tr:hover {
  background: var(--warm-white);
}

/* API Keys */
.api-key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-generate {
  background: var(--deep-green);
  color: var(--gold);
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-generate:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 13px;
}

.api-table th {
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px;
  text-align: left;
}

.api-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-light);
}

.api-table code {
  background: var(--warm-white);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.btn-copy {
  background: none;
  border: none;
  color: var(--text-light);
  margin-left: 8px;
  cursor: pointer;
  padding: 4px;
}

.btn-copy:hover {
  color: var(--gold);
}

.btn-icon {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 5px;
  margin: 0 3px;
  transition: color 0.3s;
}

.btn-icon:hover {
  color: var(--danger);
}

/* API Docs */
.api-docs {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid var(--border-light);
}

.api-docs h3 {
  color: var(--deep-green);
  margin-bottom: 20px;
}

.doc-card {
  background: var(--warm-white);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.doc-card h4 {
  color: var(--deep-green);
  margin-bottom: 10px;
  font-size: 15px;
}

.doc-card code {
  display: block;
  background: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  border: 1px solid var(--border-light);
  font-size: 13px;
}

.doc-card ul {
  list-style: none;
  padding: 0;
}

.doc-card li {
  padding: 5px 0;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 8px;
}

.doc-card li i {
  color: var(--success);
}

.btn-docs {
  background: none;
  border: 2px solid var(--gold);
  color: var(--deep-green);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-docs:hover {
  background: var(--gold);
  color: var(--deep-green);
}

/* Loading States */
.loading-state {
  text-align: center;
  padding: 60px;
}

.error-state {
  text-align: center;
  padding: 60px;
  color: var(--danger);
}

.error-state i {
  font-size: 48px;
  margin-bottom: 15px;
}

.btn-retry {
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--deep-green);
  color: var(--gold);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.history-loading {
  padding: 40px;
}

/* Settings Footer */
.settings-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unsaved-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--warning);
  font-size: 13px;
}

.unsaved-indicator i {
  font-size: 8px;
}

.settings-actions {
  display: flex;
  gap: 15px;
}

.btn-save {
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reset {
  background: none;
  border: 2px solid var(--border-light);
  color: var(--text-light);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-reset:hover:not(:disabled) {
  border-color: var(--warning);
  color: var(--warning);
}

.btn-reset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h3 i {
  color: var(--gold);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.3s;
}

.modal-close:hover {
  color: var(--danger);
}

.modal-body {
  margin-bottom: 25px;
}

.modal-body p {
  color: var(--text-dark);
  margin-bottom: 10px;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.btn-primary {
  flex: 2;
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  flex: 1;
  background: none;
  border: 2px solid var(--border-light);
  color: var(--text-light);
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger {
  flex: 2;
  background: var(--danger);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Confirm Modal */
.confirm-modal {
  max-width: 400px;
}

/* Spinner */
.spinner {
  border: 2px solid var(--warm-white);
  border-top: 2px solid var(--gold);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.spinner-small {
  border: 2px solid var(--warm-white);
  border-top: 2px solid var(--gold);
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

/* Text Center */
.text-center {
  text-align: center;
  color: var(--text-light);
  padding: 20px;
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
  
  .settings-nav {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    position: static;
  }
  
  .nav-item {
    white-space: nowrap;
    width: auto;
  }
  
  .backup-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-footer {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .settings-page {
    padding: 10px;
  }
  
  .setting-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .setting-info {
    max-width: 100%;
  }
  
  .setting-row input,
  .setting-row select {
    width: 100%;
  }
  
  .theme-selector {
    flex-wrap: wrap;
  }
  
  .settings-actions {
    width: 100%;
  }
  
  .btn-save, .btn-reset {
    flex: 1;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .time-range {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-range input[type="time"] {
    width: 100%;
  }
  
  .api-table {
    font-size: 12px;
  }
  
  .api-table td code {
    font-size: 10px;
  }
  
  .backup-table {
    font-size: 12px;
  }
}
</style>