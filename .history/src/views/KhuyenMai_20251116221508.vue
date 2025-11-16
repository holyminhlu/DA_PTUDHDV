<template>
  <div class="promo-info">
    <div class="container">
      <h2 class="title">Thông tin khuyến mãi</h2>
      <p class="subtitle">Tổng hợp các chương trình hấp dẫn đang được áp dụng</p>

      <div class="promo-list">
        <div 
          v-for="promo in promos" 
          :key="promo.id" 
          class="promo-card"
        >
          <div class="promo-header">
            <span class="badge" :class="badgeClass(promo.type)">
              {{ promo.type }}
            </span>
            <h3>{{ promo.title }}</h3>
          </div>

          <p class="desc">{{ promo.description }}</p>

          <div class="promo-meta">
            <p>⏱ Thời gian: <strong>{{ promo.time }}</strong></p>
            <p v-if="promo.discount">💸 Giảm: <strong>-{{ promo.discount }}%</strong></p>
          </div>

          <button @click="viewDetail(promo)" class="more-btn">Xem chi tiết</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromotionInfo",
  props: {
    promos: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    viewDetail(promo) {
      this.$emit("view-detail", promo);
    },
    badgeClass(type) {
      switch (type) {
        case "Hot":
          return "hot";
        case "Flash Sale":
          return "flash";
        default:
          return "normal";
      }
    }
  }
};
</script>

<style scoped>
.promo-info {
  padding: 50px 20px;
  background: #f8fafc;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 6px;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 30px;
}

.promo-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
}

.promo-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.07);
  transition: 0.2s;
}

.promo-card:hover {
  transform: translateY(-4px);
}

.promo-header h3 {
  margin: 10px 0 6px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.badge.hot { background: #ef4444; }
.badge.flash { background: #eab308; }
.badge.normal { background: #3b82f6; }

.desc {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 12px;
}

.promo-meta p {
  font-size: 0.9rem;
  color: #334155;
  margin: 3px 0;
}

.more-btn {
  margin-top: 14px;
  width: 100%;
  border: none;
  background: #0ea5e9;
  padding: 10px;
  color: white;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.more-btn:hover {
  background: #0284c7;
}
</style>
