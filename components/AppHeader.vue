<template>
  <div>
    <!-- Navigation Drawer -->
    <ClientOnly>
      <v-navigation-drawer
        v-model="drawer"
        app
        temporary
      >
        <v-list>
          <v-list-item prepend-icon="mdi-home" title="Trang chủ" @click="navigateTo('/')"></v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-subheader>CHỨC NĂNG</v-list-subheader>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" @click="navigateTo('/dashboard')"></v-list-item>
          
          <v-divider></v-divider>
          
          <template v-if="$vuetify.display.smAndDown">
            <v-list-subheader>TÀI KHOẢN</v-list-subheader>
            <template v-if="isAuthenticated">
              <v-list-item v-if="isAdmin" prepend-icon="mdi-shield-crown" title="Admin Panel" @click="navigateTo('/admin')"></v-list-item>
              <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" @click="handleLogout"></v-list-item>
            </template>
            <template v-else>
              <v-list-item prepend-icon="mdi-login" title="Đăng nhập" @click="navigateTo('/login')"></v-list-item>
              <v-list-item prepend-icon="mdi-account-plus" title="Đăng ký" @click="navigateTo('/register')"></v-list-item>
            </template>
          </template>
        </v-list>
      </v-navigation-drawer>
    </ClientOnly>

    <!-- App Bar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none text-white">
          <v-icon left>mdi-rocket-launch</v-icon>
          Tofu App
        </NuxtLink>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <ClientOnly>
        <template v-if="$vuetify.display.mdAndUp">
          <template v-if="isAuthenticated">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" append-icon="mdi-chevron-down">
                  {{ (user?.name || user?.username) }}
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item v-if="isAdmin" @click="navigateTo('/admin')">
                  <v-list-item-title>
                    <v-icon left>mdi-shield-crown</v-icon>
                    Admin Panel
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="handleLogout">
                  <v-list-item-title>
                    <v-icon left>mdi-logout</v-icon>
                    Đăng xuất
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          
          <!-- Auth buttons chỉ hiển thị trên desktop -->
          <v-btn v-if="!isAuthenticated" text @click="navigateTo('/login')">
            <v-icon left>mdi-login</v-icon>
            Đăng nhập
          </v-btn>
          <v-btn v-if="!isAuthenticated" text @click="navigateTo('/register')">
            <v-icon left>mdi-account-plus</v-icon>
            Đăng ký
          </v-btn>
        </template>
      </ClientOnly>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, isAdmin, logout } = useAuth()
const router = useRouter()

const drawer = ref(false)

const handleLogout = async () => {
  await logout()
}

const navigateTo = (path: string) => {
  router.push(path)
  drawer.value = false
}
</script>