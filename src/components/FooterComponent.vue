<template>
  <footer class="footer">
    <!-- Main Footer -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="brand-info">
            <h3 class="brand-logo">TechStore</h3>
            <p class="brand-description">
              Cửa hàng công nghệ uy tín hàng đầu, chuyên cung cấp điện thoại, 
              tablet và phụ kiện chính hãng với giá tốt nhất.
            </p>
            
            <!-- Social Links -->
            <div class="social-links">
              <a v-for="social in socialLinks" :key="social.name" 
                 :href="social.url" 
                 class="social-link"
                 target="_blank"
                 :aria-label="social.name">
                <component :is="social.icon" />
              </a>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4 class="section-title">Liên kết nhanh</h4>
          <ul class="footer-links">
            <li v-for="link in quickLinks" :key="link.name">
              <a :href="link.url" class="footer-link">{{ link.name }}</a>
            </li>
          </ul>
        </div>

        <!-- Customer Support -->
        <div class="footer-section">
          <h4 class="section-title">Hỗ trợ khách hàng</h4>
          <ul class="footer-links">
            <li v-for="support in customerSupport" :key="support.name">
              <a :href="support.url" class="footer-link">{{ support.name }}</a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4 class="section-title">Thông tin liên hệ</h4>
          <div class="contact-info">
            <div v-for="contact in contactInfo" :key="contact.type" class="contact-item">
              <component :is="contact.icon" class="contact-icon" />
              <div>
                <p class="contact-type">{{ contact.type }}</p>
                <p class="contact-detail">{{ contact.detail }}</p>
              </div>
            </div>
          </div>
          
          <!-- Payment Methods -->
          <div class="payment-methods">
            <h5 class="payment-title">Chấp nhận thanh toán</h5>
            <div class="payment-icons">
              <div v-for="method in paymentMethods" :key="method" 
                   class="payment-icon" :class="method">
                {{ method }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="footer-container">
        <div class="bottom-content">
          <p class="copyright">
            © 2024 TechStore. Tất cả các quyền được bảo lưu.
          </p>
          <div class="legal-links">
            <a v-for="legal in legalLinks" :key="legal.name" 
               :href="legal.url" class="legal-link">
              {{ legal.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
// Icons (in a real project, you'd use actual SVG components or an icon library)
const FacebookIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
};

const ZaloIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/><path d="M12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>'
};

const YoutubeIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
};

const LocationIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
};

const PhoneIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
};

const EmailIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
};

export default { 
  name: 'FooterComponent',
  components: {
    FacebookIcon,
    ZaloIcon,
    YoutubeIcon,
    LocationIcon,
    PhoneIcon,
    EmailIcon
  },
  data() {
    return {
      socialLinks: [
        { name: 'Facebook', url: '#', icon: 'FacebookIcon' },
        { name: 'Zalo', url: '#', icon: 'ZaloIcon' },
        { name: 'YouTube', url: '#', icon: 'YoutubeIcon' }
      ],
      quickLinks: [
        { name: 'Sản phẩm', url: '#' },
        { name: 'Khuyến mãi', url: '#' },
        { name: 'Giới thiệu', url: '#' },
        { name: 'Tin tức', url: '#' },
        { name: 'Tuyển dụng', url: '#' }
      ],
      customerSupport: [
        { name: 'Trung tâm hỗ trợ', url: '#' },
        { name: 'Hướng dẫn mua hàng', url: '#' },
        { name: 'Chính sách thanh toán', url: '#' },
        { name: 'Chính sách đổi trả', url: '#' },
        { name: 'Chính sách bảo hành', url: '#' },
        { name: 'Vận chuyển & giao nhận', url: '#' }
      ],
      contactInfo: [
        { type: 'Địa chỉ', detail: '22 Đường ABC, Quận 1, TP. HCM', icon: 'LocationIcon' },
        { type: 'Hotline', detail: '1900 1234', icon: 'PhoneIcon' },
        { type: 'Email', detail: 'support@techstore.vn', icon: 'EmailIcon' }
      ],
      paymentMethods: ['Visa', 'Mastercard', 'JCB', 'Momo', 'ZaloPay'],
      legalLinks: [
        { name: 'Điều khoản sử dụng', url: '#' },
        { name: 'Chính sách bảo mật', url: '#' },
        { name: 'Cookies', url: '#' }
      ]
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #cbd5e1;
}

.footer-main {
  padding: 60px 0 40px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

/* Brand Info */
.brand-info {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.brand-logo {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #60a5fa 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

/* Section Titles */
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 2px;
  background: #3b82f6;
  border-radius: 2px;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 0;
}

.footer-link:hover {
  color: #60a5fa;
  padding-left: 8px;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.footer-link:hover::before {
  width: 4px;
}

/* Contact Info */
.contact-info {
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.contact-icon {
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-type {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-detail {
  color: #e2e8f0;
  font-weight: 500;
}

/* Payment Methods */
.payment-title {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-icons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.payment-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #94a3b8;
  font-size: 14px;
}

.legal-links {
  display: flex;
  gap: 24px;
}

.legal-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #60a5fa;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 40px 60px;
  }
}

@media (max-width: 768px) {
  .footer-main {
    padding: 40px 0 30px;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }
  
  .bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .legal-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 16px;
  }
  
  .brand-logo {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .legal-links {
    flex-direction: column;
    gap: 12px;
  }
  
  .payment-icons {
    justify-content: flex-start;
  }
}
</style>