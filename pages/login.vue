<template>
  <v-app>
    <v-main>
      <v-container fill-height class="d-flex align-center justify-center">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card elevation="12" class="mx-auto">
              <v-card-title class="text-h4 text-center pa-6">
                <v-icon left color="primary" size="large">mdi-login</v-icon>
                Đăng nhập
              </v-card-title>
              
              <v-card-text class="pa-6">
                <v-form ref="form" @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginForm.username"
                    label="Tên đăng nhập"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    :rules="[rules.required]"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model="loginForm.password"
                    label="Mật khẩu"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    type="password"
                    :rules="[rules.required]"
                    class="mb-3"
                  />
                  
                  <v-alert v-if="error" type="error" class="mb-4">
                    {{ error }}
                  </v-alert>
                  
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-3"
                  >
                    <v-icon left>mdi-login</v-icon>
                    Đăng nhập
                  </v-btn>
                </v-form>
                
                <v-divider class="my-4"></v-divider>
                
                <div class="text-center">
                  <p class="text-body-2">
                    Chưa có tài khoản?
                    <NuxtLink to="/register" class="text-primary text-decoration-none">
                      Đăng ký ngay
                    </NuxtLink>
                  </p>
                  
                  <v-btn
                    text
                    color="grey"
                    @click="$router.push('/')"
                    class="mt-2"
                  >
                    <v-icon left>mdi-home</v-icon>
                    Về trang chủ
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import type { LoginInput } from '~/shared/types'

definePageMeta({
  layout: false,
  auth: false
})

const { login } = useAuth()
const router = useRouter()

const loginForm = ref<LoginInput>({
  username: '',
  password: ''
})

const form = ref()
const loading = ref(false)
const error = ref('')

const rules = {
  required: (value: string) => !!value || 'Trường này là bắt buộc'
}

const handleLogin = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    await login(loginForm.value)
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Đăng nhập - Nuxt App'
})
</script>
