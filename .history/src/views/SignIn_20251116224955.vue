<template>
  <div class="signin-page">
    <HeaderComponent />

    <main class="signin-container">
      <div class="card">
        <h2>Đăng nhập</h2>
        <p class="lead">Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng</p>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" placeholder="email@domain.com" required />
            <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
          </div>

          <div class="form-row">
            <label for="password">Mật khẩu</label>
            <input id="password" v-model="form.password" type="password" placeholder="Mật khẩu" required />
            <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
          </div>

          <div class="form-row">
            <label class="checkbox-row">
              <input type="checkbox" v-model="form.remember" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <div class="form-row actions">
            <button class="btn primary" :disabled="loading">
              <span v-if="!loading">Đăng nhập</span>
              <span v-else>Đang xử lý...</span>
            </button>
            <button type="button" class="btn ghost" href="dangnhap">Chưa có tài khoản? Đăng ký</button>
          </div>

          <div v-if="errorMessage" class="response-error">{{ errorMessage }}</div>
        </form>

        <div class="divider">Hoặc</div>
        <div class="socials">
          <button class="social-btn google">Đăng nhập với Google</button>
          <button class="social-btn facebook">Đăng nhập với Facebook</button>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'SignInView',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      loading: false,
      errorMessage: null,
      form: {
        email: '',
        password: '',
        remember: true
      },
      errors: {}
    };
  },
  methods: {
    validate() {
      this.errors = {};
      const { email, password } = this.form;
      const emailRe = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
      if (!email || !emailRe.test(email)) {
        this.errors.email = 'Email không hợp lệ.';
      }
      if (!password || password.length < 6) {
        this.errors.password = 'Mật khẩu cần ít nhất 6 ký tự.';
      }
      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.errorMessage = null;
      if (!this.validate()) return;

      this.loading = true;
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const resp = await fetch(`${base}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.form.email, password: this.form.password })
        });

        const body = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          this.errorMessage = body.error || body.message || 'Đăng nhập thất bại.';
        } else {
          // success
          // assume backend returns user info and optionally token
          const user = body.user || body;
          // store user in localStorage (or use a store)
          try {
            if (this.form.remember) localStorage.setItem('techstore_user', JSON.stringify(user));
            else sessionStorage.setItem('techstore_user', JSON.stringify(user));
          } catch (e) {
            console.warn('Storage failed', e);
          }

          // redirect to intended page or named Home route
          const redirectQuery = this.$route && this.$route.query && this.$route.query.redirect;
          try {
            if (redirectQuery) {
              // if redirectQuery is a path string or an object
              if (typeof redirectQuery === 'string') this.$router.push(redirectQuery);
              else this.$router.push(redirectQuery);
            } else {
              this.$router.push({ name: 'home' });
            }
          } catch (e) {
            // swallow navigation errors
          }
        }
      } catch (e) {
        console.error('SignIn error', e);
        this.errorMessage = e.message || 'Lỗi mạng. Vui lòng thử lại.';
      } finally {
        this.loading = false;
      }
    },

    goToSignUp() {
      if (this.$router) this.$router.push({ name: 'SignUp' }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.signin-page { margin-top: 3rem; display:flex; flex-direction:column; min-height:100vh; }
.signin-container { flex:1; display:flex; align-items:center; justify-content:center; padding:56px 20px; }
.card { width:100%; max-width:480px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(2,6,23,0.06); padding:24px; box-sizing:border-box; }
.card h2 { margin:0 0 6px; font-size:1.4rem; }
.lead { margin:0 0 14px; color:#6b7280; }
.form-row { margin-bottom:12px; }
.form-row label { display:block; margin-bottom:6px; font-size:13px; color:#374151; }
.form-row input[type="email"], .form-row input[type="password"] { width:100%; padding:10px 12px; border:1px solid #e6e9ef; border-radius:8px; font-size:14px; }
.checkbox-row { display:flex; align-items:center; gap:8px; font-size:13px; color:#374151; }
.actions { display:flex; gap:12px; align-items:center; margin-top:6px; }
.btn { padding:10px 14px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
.btn.primary { background:linear-gradient(135deg,#3b82f6,#1d4ed8); color:white; }
.btn.ghost { background:transparent; border:1px solid #e6e9ef; color:#374151; }
.field-error { margin-top:6px; color:#ef4444; font-size:12px; }
.response-error { margin-top:12px; color:#dc2626; font-weight:600; }
.divider { text-align:center; margin-top:16px; color:#9ca3af; }
.socials { display:flex; gap:8px; margin-top:12px; }
.social-btn { flex:1; padding:10px; border-radius:8px; border:1px solid #e6e9ef; background:white; cursor:pointer; }
.social-btn.google { color:#DB4437; }
.social-btn.facebook { color:#1877F2; }
@media (max-width:480px) { .card { padding:18px; } }
</style>
