<template>
  <div class="about-page">
    <HeaderComponent />
    
    <!-- Hero Section - Đơn giản, rõ ràng -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Về TechStore</h1>
          <p class="hero-subtitle">
            Đối tác tin cậy của bạn trong hành trình khám phá công nghệ. 
            Hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến sản phẩm chính hãng, 
            chất lượng cao với giá cả hợp lý nhất.
          </p>
        </div>
      </div>
    </section>

    <!-- Giới thiệu ngắn gọn -->
    <section class="intro-section">
      <div class="container">
        <div class="intro-content">
          <h2 class="section-title">Chúng tôi là ai?</h2>
          <div class="intro-content-text">
            <p class="text-paragraph">
              TechStore được thành lập năm 2013 tại TP. Hồ Chí Minh với mục tiêu 
              mang công nghệ đến gần hơn với mọi người. Chúng tôi tin rằng công nghệ 
              không chỉ là công cụ, mà còn là cầu nối kết nối con người, mở ra những 
              cơ hội mới và làm phong phú thêm cuộc sống.
            </p>
            <p class="text-paragraph">
              Từ một cửa hàng nhỏ, TechStore đã phát triển thành một trong những 
              địa chỉ tin cậy hàng đầu trong lĩnh vực bán lẻ công nghệ tại Việt Nam. 
              Chúng tôi tự hào đã phục vụ hơn 100.000 khách hàng và con số này vẫn 
              đang tiếp tục tăng lên mỗi ngày.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sứ mệnh -->
    <section class="mission-section">
      <div class="container">
        <h2 class="section-title">Sứ mệnh của chúng tôi</h2>
        <div class="mission-content">
          <p class="mission-text">
            Mang công nghệ đến gần hơn với mọi người. Chúng tôi cam kết cung cấp 
            những sản phẩm công nghệ chính hãng, chất lượng cao với giá cả hợp lý, 
            cùng dịch vụ tư vấn và hỗ trợ chu đáo, giúp khách hàng tìm được sản phẩm 
            phù hợp nhất với nhu cầu và ngân sách của mình.
          </p>
        </div>
      </div>
    </section>

    <!-- Giá trị cốt lõi -->
    <section class="values-section">
      <div class="container">
        <h2 class="section-title">Giá trị cốt lõi</h2>
        <div class="values-grid">
          <div 
            v-for="(value, index) in values" 
            :key="index"
            class="value-item"
          >
            <div class="value-icon">
              <img 
                src="/img/articles/Review/chatluong.png" 
                :alt="value.title"
                class="value-image"
              />
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Đội ngũ -->
    <section class="team-section">
      <div class="container">
        <h2 class="section-title">Đội ngũ của chúng tôi</h2>
        <div class="team-grid">
          <div 
            v-for="(member, index) in teamMembers" 
            :key="index"
            class="team-member"
          >
            <div class="member-avatar">
              <div class="avatar-circle">{{ member.avatar }}</div>
            </div>
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-description">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">Bạn có câu hỏi?</h2>
        <p class="cta-text">
          Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
          Hãy liên hệ với chúng tôi ngay hôm nay!
        </p>
        <router-link to="/contact" class="cta-button">
          Liên hệ ngay
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

// Icon components
const TrustIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  `
}

const QualityIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `
}

const ServiceIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const values = [
  {
    title: 'Uy tín & Tin cậy',
    description: 'Cam kết bán hàng minh bạch, chính hãng 100%. Mọi sản phẩm đều được bảo hành chính thức và hỗ trợ đổi trả theo chính sách.',
    icon: TrustIcon
  },
  {
    title: 'Chất lượng cao',
    description: 'Chỉ kinh doanh sản phẩm đã qua kiểm định chất lượng. Đội ngũ kỹ thuật viên giàu kinh nghiệm luôn sẵn sàng hỗ trợ.',
    icon: QualityIcon
  },
  {
    title: 'Dịch vụ tận tâm',
    description: 'Nhân viên chuyên nghiệp, tư vấn nhiệt tình giúp khách hàng chọn được sản phẩm phù hợp nhất với nhu cầu và ngân sách.',
    icon: ServiceIcon
  }
]

const teamMembers = [
  {
    name: 'Nguyễn Văn An',
    role: 'Giám đốc điều hành',
    avatar: 'NA',
    description: 'Với hơn 15 năm kinh nghiệm trong ngành công nghệ, anh An đã dẫn dắt TechStore trở thành một trong những cửa hàng điện tử hàng đầu.'
  },
  {
    name: 'Trần Thị Bình',
    role: 'Trưởng phòng Kinh doanh',
    avatar: 'TB',
    description: 'Chuyên gia về sản phẩm công nghệ và quan hệ khách hàng, chị Bình luôn đảm bảo khách hàng nhận được sản phẩm tốt nhất.'
  },
  {
    name: 'Lê Minh Cường',
    role: 'Kỹ thuật viên trưởng',
    avatar: 'LC',
    description: 'Với kiến thức sâu rộng về công nghệ, anh Cường đảm bảo mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.'
  },
  {
    name: 'Phạm Thị Dung',
    role: 'Trưởng phòng Chăm sóc khách hàng',
    avatar: 'PD',
    description: 'Luôn tận tâm với khách hàng, chị Dung đảm bảo mọi thắc mắc và yêu cầu của khách hàng đều được giải quyết nhanh chóng.'
  }
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding-top: 80px;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.95);
  max-width: 700px;
  margin: 0 auto;
  font-weight: 400;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 120px 0;
  }
  
  .hero-title {
    font-size: 4rem;
  }
  
  .hero-subtitle {
    font-size: 1.375rem;
  }
}

/* Section Title */
.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 48px;
  text-align: center;
  letter-spacing: -0.025em;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  border-radius: 2px;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 3rem;
  }
}

/* Intro Section */
.intro-section {
  padding: 80px 0;
  background-color: #ffffff;
}

.intro-content-text {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.text-paragraph {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4b5563;
  margin: 0;
  text-align: center;
}

@media (min-width: 768px) {
  .text-paragraph {
    font-size: 1.25rem;
    text-align: left;
  }
  
  .intro-content-text {
    text-align: left;
  }
}

/* Mission Section */
.mission-section {
  padding: 80px 0;
  background-color: #f8fafc;
  position: relative;
}

.mission-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
}

.mission-content {
  max-width: 800px;
  margin: 0 auto;
}

.mission-text {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #4b5563;
  text-align: center;
  margin: 0;
  font-weight: 500;
}

/* Values Section */
.values-section {
  padding: 80px 0;
  background-color: #ffffff;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .values-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }
}

.value-item {
  text-align: center;
  padding: 40px 24px;
  background-color: #ffffff;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.value-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
}

.value-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #e0e7ff;
}

.value-icon {
  width: 88px;
  height: 88px;
  margin: 0 auto 24px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.value-item:hover .value-icon {
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

.value-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.value-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  letter-spacing: -0.025em;
}

.value-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #6b7280;
  margin: 0;
}

/* Team Section */
.team-section {
  padding: 80px 0;
  background-color: #f8fafc;
  position: relative;
}

.team-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
}

.team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.team-member {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
}

.team-member::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
}

.team-member:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #e0e7ff;
}

.member-avatar {
  margin-bottom: 24px;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  transition: transform 0.3s ease;
}

.team-member:hover .avatar-circle {
  transform: scale(1.05);
}

.member-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
}

.member-role {
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.member-role::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  border-radius: 1px;
  opacity: 0.5;
}

.member-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #6b7280;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  letter-spacing: -0.025em;
}

@media (min-width: 768px) {
  .cta-title {
    font-size: 3rem;
  }
}

.cta-text {
  font-size: 1.25rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.95);
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
  z-index: 1;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background-color: white;
  color: #2563eb;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 16px 36px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  background-color: #f8fafc;
}

.cta-button svg {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.cta-button:hover svg {
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 640px) {
  .about-page {
    padding-top: 60px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-title::after {
    width: 60px;
  }
  
  .intro-section,
  .mission-section,
  .values-section,
  .team-section,
  .cta-section {
    padding: 60px 0;
  }
  
  .container {
    padding: 0 20px;
  }
  
  .value-item,
  .team-member {
    padding: 32px 20px;
  }
}
</style>