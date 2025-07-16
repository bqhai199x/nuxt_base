<template>
  <v-app>
    <v-main>
      <v-container fill-height class="d-flex align-center justify-center">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card elevation="12" class="mx-auto">
              <v-card-title class="text-h4 text-center pa-6">
                <v-icon left color="success" size="large">mdi-account-plus</v-icon>
                Đăng ký
              </v-card-title>
              
              <v-card-text class="pa-6">
                <v-form ref="form" @submit.prevent="handleRegister">
                  <v-text-field
                    v-model="registerForm.username"
                    label="Tên đăng nhập"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    :rules="[rules.required, rules.username]"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model="registerForm.password"
                    label="Mật khẩu"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    type="password"
                    :rules="[rules.required, rules.password]"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model="confirmPassword"
                    label="Xác nhận mật khẩu"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                    type="password"
                    :rules="[rules.required, rules.confirmPassword]"
                    class="mb-3"
                  />
                  
                  <v-alert v-if="error" type="error" class="mb-4">
                    {{ error }}
                  </v-alert>
                  
                  <v-alert v-if="success" type="success" class="mb-4">
                    {{ success }}
                  </v-alert>
                  
                  <v-btn
                    type="submit"
                    color="success"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-3"
                  >
                    <v-icon left>mdi-account-plus</v-icon>
                    Đăng ký
                  </v-btn>
                </v-form>
                
                <v-divider class="my-4"></v-divider>
                
                <div class="text-center">
                  <p class="text-body-2">
                    Đã có tài khoản?
                    <NuxtLink to="/login" class="text-primary text-decoration-none">
                      Đăng nhập ngay
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
import type { RegisterInput } from '~/shared/types'

definePageMeta({
  layout: false,
  auth: false
})

const router = useRouter()

const registerForm = ref<RegisterInput>({
  username: '',
  password: ''
})

const confirmPassword = ref('')
const form = ref()
const loading = ref(false)
const error = ref('')
const success = ref('')

const rules = {
  required: (value: string) => !!value || 'Trường này là bắt buộc',
  username: (value: string) => {
    return value.length >= 3 || 'Tên đăng nhập phải có ít nhất 4 ký tự'
  },
  password: (value: string) => {
    return value.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự'
  },
  confirmPassword: (value: string) => {
    return value === registerForm.value.password || 'Mật khẩu xác nhận không khớp'
  }
}

const handleRegister = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const { data } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: registerForm.value
    })

    success.value = 'Đăng ký thành công! Đang chuyển hướng...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.data?.message || 'Đăng ký thất bại'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Đăng ký - Nuxt App'
})
</script>