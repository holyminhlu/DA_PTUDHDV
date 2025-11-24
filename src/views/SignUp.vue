<template>
  <div class="signup-page">
    <HeaderComponent />

    <main class="signup-container">
      <div class="card">
        <h2>Đăng ký tài khoản</h2>
        <p class="lead">Tạo tài khoản để trải nghiệm mua sắm nhanh chóng và nhận ưu đãi</p>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-row">
            <label for="fullName">Họ và tên</label>
            <input id="fullName" v-model="form.fullName" type="text" placeholder="Nguyễn Văn A" required />
            <div v-if="errors.fullName" class="field-error">{{ errors.fullName }}</div>
          </div>

          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" placeholder="email@domain.com" required />
            <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
          </div>

          <div class="form-row split">
            <div>
              <label for="password">Mật khẩu</label>
              <input id="password" v-model="form.password" type="password" placeholder="Ít nhất 8 ký tự" required />
              <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
            </div>

            <div>
              <label for="confirm">Xác nhận mật khẩu</label>
              <input id="confirm" v-model="form.confirm" type="password" placeholder="Nhập lại mật khẩu" required />
              <div v-if="errors.confirm" class="field-error">{{ errors.confirm }}</div>
            </div>
          </div>

          <div class="form-row">
            <label class="checkbox-row">
              <input type="checkbox" v-model="form.acceptTerms" />
              <span>Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật</span>
            </label>
            <div v-if="errors.acceptTerms" class="field-error">{{ errors.acceptTerms }}</div>
          </div>

          <div class="form-row actions">
            <button class="btn primary" :disabled="loading">
              <span v-if="!loading">Đăng ký</span>
              <span v-else>Đang xử lý...</span>
            </button>
            
            <router-link :to="{ name: 'dangnhap' }" class="btn ghost">Đã có tài khoản? Đăng nhập</router-link>
          </div>

          <div v-if="errorMessage" class="response-error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="response-success">{{ successMessage }}</div>
        </form>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'SignUpView',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      loading: false,
      errorMessage: null,
      successMessage: null,
      form: {
        fullName: '',
        email: '',
        password: '',
        confirm: '',
        acceptTerms: false
      },
      errors: {}
    };
  },
  methods: {
    validate() {
      this.errors = {};
      const { fullName, email, password, confirm, acceptTerms } = this.form;
      if (!fullName || fullName.trim().length < 2) {
        this.errors.fullName = 'Vui lòng nhập tên đầy đủ (ít nhất 2 ký tự).';
      }

      const emailRe = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
      if (!email || !emailRe.test(email)) {
        this.errors.email = 'Email không hợp lệ.';
      }

      if (!password || password.length < 8) {
        this.errors.password = 'Mật khẩu cần ít nhất 8 ký tự.';
      }

      if (confirm !== password) {
        this.errors.confirm = 'Mật khẩu xác nhận không khớp.';
      }

      if (!acceptTerms) {
        this.errors.acceptTerms = 'Bạn cần đồng ý với điều khoản.';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.errorMessage = null;
      this.successMessage = null;
      if (!this.validate()) return;

      this.loading = true;
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const resp = await fetch(`${base}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.form.fullName,
            email: this.form.email,
            password: this.form.password
          })
        });

        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          // clear previous field errors
          this.errors = {};

          // If API returns structured field errors, map them to local form fields
          // Example API: { "name": "Chứa ký tự đặc biệt", "password": "Mật khẩu phải tối thiểu 8 ký tự" }
          if (body.errors && typeof body.errors === 'object') {
            for (const [key, val] of Object.entries(body.errors)) {
              if (key === 'name') this.errors.fullName = val;
              else if (key === 'password') this.errors.password = val;
              else if (key === 'email') this.errors.email = val;
              else this.errors[key] = val;
            }
            this.errorMessage = body.message || 'Vui lòng kiểm tra các trường.';
          } else {
            // Some APIs may return field errors at top-level
            if (body.name) this.errors.fullName = body.name;
            if (body.password) this.errors.password = body.password;
            if (body.email) this.errors.email = body.email;
            this.errorMessage = body.error || body.message || Object.values(this.errors)[0] || 'Đăng ký thất bại.';
          }
        } else {
          const body = await resp.json().catch(() => ({}));
          this.successMessage = body.message || 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt (nếu có).';
          // Optionally clear form
          this.form.fullName = '';
          this.form.email = '';
          this.form.password = '';
          this.form.confirm = '';
          this.form.acceptTerms = false;
        }
      } catch (e) {
        console.error('SignUp error', e);
        this.errorMessage = e.message || 'Lỗi mạng. Vui lòng thử lại.';
      } finally {
        this.loading = false;
      }
    },

    goToLogin() {
      if (this.$router) this.$router.push({ name: 'Login' }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.signup-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 3rem;
}

.signup-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 20px;
}

.card {
  width: 100%;
  max-width: 760px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.08);
  padding: 28px;
  box-sizing: border-box;
}

.card h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
}

.card .lead {
  margin: 0 0 18px;
  color: #6b7280;
}

.form-row {
  margin-bottom: 14px;
}

.form-row.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-row label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #374151;
}

.form-row input[type="text"],
.form-row input[type="email"],
.form-row input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e6e9ef;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
}

.field-error {
  margin-top: 6px;
  color: #ef4444;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 6px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn.ghost {
  background: transparent;
  border: 1px solid #e6e9ef;
  color: #374151;
}

.response-error {
  margin-top: 12px;
  color: #dc2626;
  font-weight: 600;
}

.response-success {
  margin-top: 12px;
  color: #10b981;
  font-weight: 600;
}

@media (max-width: 720px) {
  .form-row.split { grid-template-columns: 1fr; }
  .card { padding: 20px; }
}
</style>
