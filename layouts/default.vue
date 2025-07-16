<template>
  <v-app>
    <AppHeader />
    
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
</script>
