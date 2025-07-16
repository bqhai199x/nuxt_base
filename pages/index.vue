<template>
  <div>
    <v-container class="features-section">
      <!-- Function Menu Cards -->
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/dashboard')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="blue" size="60" class="mb-4">mdi-view-dashboard</v-icon>
              <h3 class="text-h5 mb-2">Dashboard</h3>
              <p class="text-body-2">Tổng quan hệ thống và thống kê</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/users')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="green" size="60" class="mb-4">mdi-account-group</v-icon>
              <h3 class="text-h5 mb-2">Quản lý người dùng</h3>
              <p class="text-body-2">Quản lý tài khoản và quyền hạn</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/reports')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="orange" size="60" class="mb-4">mdi-chart-line</v-icon>
              <h3 class="text-h5 mb-2">Báo cáo</h3>
              <p class="text-body-2">Xem báo cáo và thống kê</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/settings')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="purple" size="60" class="mb-4">mdi-cog</v-icon>
              <h3 class="text-h5 mb-2">Cài đặt</h3>
              <p class="text-body-2">Cấu hình hệ thống</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/profile')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="teal" size="60" class="mb-4">mdi-account-circle</v-icon>
              <h3 class="text-h5 mb-2">Hồ sơ</h3>
              <p class="text-body-2">Quản lý thông tin cá nhân</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/notifications')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="red" size="60" class="mb-4">mdi-bell</v-icon>
              <h3 class="text-h5 mb-2">Thông báo</h3>
              <p class="text-body-2">Xem thông báo và cập nhật</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card
            elevation="6"
            hover
            class="function-card"
            @click="$router.push('/help')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="indigo" size="60" class="mb-4">mdi-help-circle</v-icon>
              <h3 class="text-h5 mb-2">Trợ giúp</h3>
              <p class="text-body-2">Hướng dẫn sử dụng</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3" v-if="isAdmin">
          <v-card
            elevation="6"
            hover
            class="function-card admin-card"
            @click="$router.push('/admin')"
          >
            <v-card-text class="text-center pa-6">
              <v-icon color="deep-orange" size="60" class="mb-4">mdi-shield-crown</v-icon>
              <h3 class="text-h5 mb-2">Admin Panel</h3>
              <p class="text-body-2">Quản trị hệ thống</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const { isAdmin } = useAuth()

// Page metadata
useHead({
  title: 'Trang chủ',
  meta: [
    { name: 'description', content: 'Trang chủ' }
  ]
})
</script>

<style scoped>
.function-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.function-card:hover {
  transform: translateY(-4px);
}

.admin-card {
  border: 2px solid #FF5722;
}

.features-section {
  padding-top: 2rem;
}

.gap-4 {
  gap: 1rem;
}

.h-100 {
  height: 100%;
}
</style>
