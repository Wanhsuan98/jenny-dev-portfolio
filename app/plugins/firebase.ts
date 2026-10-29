import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

let db: Firestore

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // 伺服器端每個請求都會執行 plugin，沿用已初始化的 app 避免重複初始化錯誤
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  db = getFirestore(app)

  return {
    provide: {
      db,
    },
  }
})

export { db }
