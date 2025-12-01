<template>
  <div class="profile-page">
    <HeaderComponent />

    <main class="profile-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-card">
          <div class="error-icon">⚠️</div>
          <h2>{{ error.message }}</h2>
          <p v-if="error.error" class="error-code">Mã lỗi: {{ error.error }}</p>
          <div class="error-actions">
            <button @click="loadProfile" class="btn secondary">Thử lại</button>
            <router-link :to="{ name: 'dangnhap' }" class="btn primary">Đăng nhập</router-link>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="profile" class="profile-content">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar">
              {{ getInitials(profile.fullName) }}
            </div>
            <button class="change-avatar-btn">Đổi ảnh đại diện</button>
          </div>
          <div class="header-info">
            <h1>{{ profile.fullName }}</h1>
            <p class="email">{{ profile.email }}</p>
            <span class="badge verified">Đã xác thực</span>
          </div>
        </div>

        <div class="profile-sections">
          <!-- Thông báo -->
          <div v-if="successMessage" class="alert alert-success">
            ✅ {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert-error">
            ⚠️ {{ errorMessage }}
          </div>

          <!-- Thông tin cá nhân -->
          <div class="section-card">
            <h3>Thông tin cá nhân</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Họ và tên</label>
                <div class="info-value">{{ profile.fullName }}</div>
              </div>
              <div class="info-item">
                <label>Email</label>
                <div class="info-value">{{ profile.email }}</div>
              </div>
              <div class="info-item">
                <label>ID người dùng</label>
                <div class="info-value mono">{{ profile.id }}</div>
              </div>
            </div>
            <button @click="openEditModal" class="btn secondary">Chỉnh sửa thông tin</button>
          </div>

          <!-- Bảo mật -->
          <div class="section-card">
            <h3>Bảo mật</h3>
            <div class="security-items">
              <div class="security-item">
                <div class="security-icon">🔒</div>
                <div class="security-content">
                  <h4>Mật khẩu</h4>
                  <p>Đổi mật khẩu để bảo vệ tài khoản</p>
                </div>
                <button class="btn ghost">Đổi mật khẩu</button>
              </div>
              <div class="security-item">
                <div class="security-icon">📱</div>
                <div class="security-content">
                  <h4>Xác thực hai yếu tố</h4>
                  <p>Tăng cường bảo mật với 2FA</p>
                </div>
                <button class="btn ghost">Bật 2FA</button>
              </div>
            </div>
          </div>

          <!-- Hoạt động gần đây -->
          <div class="section-card">
            <h3>Hoạt động gần đây</h3>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">✅</div>
                <div class="activity-content">
                  <p>Đăng nhập thành công</p>
                  <span class="activity-time">Hôm nay lúc {{ getCurrentTime() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nguy hiểm -->
          <div class="section-card danger-zone">
            <h3>Vùng nguy hiểm</h3>
            <div class="danger-actions">
              <button @click="handleLogout" class="btn danger">Đăng xuất</button>
              <button class="btn danger-outline">Xóa tài khoản</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Chỉnh sửa thông tin</h2>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="fullName">Họ và tên *</label>
              <input 
                type="text" 
                id="fullName" 
                v-model="editForm.fullName"
                :class="{ 'error': editErrors.fullName }"
                placeholder="Nhập họ và tên"
              />
              <span v-if="editErrors.fullName" class="field-error">{{ editErrors.fullName }}</span>
            </div>

            <div class="form-group">
              <label>Email (không thể thay đổi)</label>
              <input 
                type="email" 
                :value="profile.email"
                disabled
                class="disabled-input"
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeEditModal" class="btn secondary">Hủy</button>
              <button type="submit" class="btn primary" :disabled="updating">
                {{ updating ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'ProfileView',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      loading: true,
      error: null,
      profile: null,
      showEditModal: false,
      updating: false,
      successMessage: '',
      errorMessage: '',
      editForm: {
        fullName: ''
      },
      editErrors: {}
    };
  },
  mounted() {
    this.loadProfile();
  },
  methods: {
    async loadProfile() {
      this.loading = true;
      this.error = null;

      try {
        // Lấy token từ localStorage hoặc sessionStorage
        let token = localStorage.getItem('techstore_token');
        if (!token) token = sessionStorage.getItem('techstore_token');

        if (!token) {
          this.error = {
            status: 401,
            error: 'TOKEN_MISSING',
            message: 'Bạn phải đăng nhập để thực hiện thao tác này.'
          };
          this.loading = false;
          return;
        }

        // Gọi API lấy thông tin profile
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const resp = await fetch(`${base}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const body = await resp.json();

        if (!resp.ok) {
          // Xử lý các trường hợp lỗi
          this.error = body;
          
          // Nếu token hết hạn hoặc không hợp lệ, xóa token
          if (body.error === 'TOKEN_EXPIRED' || body.error === 'INVALID_TOKEN') {
            localStorage.removeItem('techstore_token');
            sessionStorage.removeItem('techstore_token');
          }
        } else {
          // Success
          this.profile = body;
        }
      } catch (e) {
        console.error('Load profile error:', e);
        this.error = {
          status: 500,
          error: 'NETWORK_ERROR',
          message: 'Không thể kết nối đến server. Vui lòng thử lại.'
        };
      } finally {
        this.loading = false;
      }
    },

    getInitials(name) {
      if (!name) return '?';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    },

    getCurrentTime() {
      return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    },

    handleLogout() {
      // Xóa token và user data
      localStorage.removeItem('techstore_token');
      sessionStorage.removeItem('techstore_token');
      localStorage.removeItem('techstore_user');
      sessionStorage.removeItem('techstore_user');

      // Dispatch event để cập nhật header
      try {
        window.dispatchEvent(new Event('techstore:user-updated'));
      } catch (e) {
        console.warn('Failed to dispatch event', e);
      }

      // Chuyển về trang đăng nhập
      this.$router.push({ name: 'dangnhap' });
    },

    openEditModal() {
      this.editForm.fullName = this.profile.fullName;
      this.editErrors = {};
      this.showEditModal = true;
      this.successMessage = '';
      this.errorMessage = '';
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editForm = { fullName: '' };
      this.editErrors = {};
    },

    validateForm() {
      this.editErrors = {};
      const name = this.editForm.fullName?.trim() || '';

      if (!name) {
        this.editErrors.fullName = 'Tên không được để trống';
        return false;
      }

      if (name.length < 2) {
        this.editErrors.fullName = 'Tên phải có ít nhất 2 ký tự';
        return false;
      }

      if (name.length > 100) {
        this.editErrors.fullName = 'Tên không được vượt quá 100 ký tự';
        return false;
      }

      // Check for special characters
      const invalidChars = /[^\p{L}\p{N}\s]/u.test(name);
      if (invalidChars) {
        this.editErrors.fullName = 'Tên chứa ký tự đặc biệt không hợp lệ';
        return false;
      }

      return true;
    },

    async updateProfile() {
      // Clear messages
      this.successMessage = '';
      this.errorMessage = '';

      // Validate
      if (!this.validateForm()) {
        return;
      }

      this.updating = true;

      try {
        // Get token
        let token = localStorage.getItem('techstore_token');
        if (!token) token = sessionStorage.getItem('techstore_token');

        if (!token) {
          this.errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          this.updating = false;
          return;
        }

        // Call API
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const resp = await fetch(`${base}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: this.editForm.fullName.trim()
          })
        });

        const body = await resp.json();

        if (!resp.ok) {
          // Handle validation errors
          if (body.error === 'VALIDATION_ERROR' && body.details) {
            this.editErrors = body.details;
          } else {
            this.errorMessage = body.message || 'Không thể cập nhật thông tin';
          }
        } else {
          // Success
          this.profile.fullName = body.updatedUser.fullName;
          this.successMessage = body.message || 'Cập nhật thành công';
          this.closeEditModal();

          // Update stored user data
          const storedUser = localStorage.getItem('techstore_user') || sessionStorage.getItem('techstore_user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            user.fullName = body.updatedUser.fullName;
            if (localStorage.getItem('techstore_user')) {
              localStorage.setItem('techstore_user', JSON.stringify(user));
            } else {
              sessionStorage.setItem('techstore_user', JSON.stringify(user));
            }
            // Dispatch event to update header
            try {
              window.dispatchEvent(new Event('techstore:user-updated'));
            } catch (e) {}
          }

          // Auto hide success message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        }
      } catch (e) {
        console.error('Update profile error:', e);
        this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại.';
      } finally {
        this.updating = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-page {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;
}

.profile-container {
  flex: 1;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  margin-top: 16px;
  color: #6b7280;
  font-size: 14px;
}

/* Error State */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.error-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 48px 32px;
  text-align: center;
  max-width: 480px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #111827;
}

.error-code {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 24px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Profile Content */
.profile-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 16px;
  padding: 40px;
  color: white;
  display: flex;
  gap: 32px;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.change-avatar-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.change-avatar-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-info {
  flex: 1;
}

.header-info h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
}

.email {
  margin: 0 0 12px;
  opacity: 0.9;
  font-size: 16px;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.badge.verified {
  background: rgba(16, 185, 129, 0.2);
  color: #d1fae5;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* Profile Sections */
.profile-sections {
  display: grid;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #111827;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item label {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #111827;
  font-weight: 500;
}

.info-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #6b7280;
}

/* Security Items */
.security-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.security-item:hover {
  border-color: #3b82f6;
  background: #f9fafb;
}

.security-icon {
  font-size: 32px;
}

.security-content {
  flex: 1;
}

.security-content h4 {
  margin: 0 0 4px;
  font-size: 15px;
  color: #111827;
}

.security-content p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.activity-icon {
  font-size: 20px;
}

.activity-content p {
  margin: 0 0 4px;
  font-size: 14px;
  color: #111827;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
}

/* Danger Zone */
.danger-zone {
  border: 2px solid #fee2e2;
  background: #fef2f2;
}

.danger-zone h3 {
  color: #dc2626;
}

.danger-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn.secondary:hover {
  background: #e5e7eb;
}

.btn.ghost {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn.ghost:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn.danger {
  background: #dc2626;
  color: white;
}

.btn.danger:hover {
  background: #b91c1c;
}

.btn.danger-outline {
  background: transparent;
  border: 1px solid #dc2626;
  color: #dc2626;
}

.btn.danger-outline:hover {
  background: #dc2626;
  color: white;
}

/* Alert Messages */
.alert {
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  animation: slideDown 0.3s ease-out;
  font-weight: 500;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 24px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: #ef4444;
}

.form-group input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.disabled-input {
  background: #f9fafb !important;
  color: #6b7280 !important;
  cursor: not-allowed;
}

.field-error {
  display: block;
  margin-top: 6px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }

  .header-info h1 {
    font-size: 24px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .security-item {
    flex-direction: column;
    text-align: center;
  }

  .danger-actions {
    flex-direction: column;
  }

  .error-actions {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>

