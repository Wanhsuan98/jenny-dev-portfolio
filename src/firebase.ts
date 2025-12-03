/**
 * Firebase 設定
 */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC7GUS-q_5y4RGKtvje16FZdmQhvWZ0dbs',
  authDomain: 'martech-line-crm.firebaseapp.com',
  projectId: 'martech-line-crm',
  storageBucket: 'martech-line-crm.firebasestorage.app',
  messagingSenderId: '382795265020',
  appId: '1:382795265020:web:cc4dbd594224c8e8423879',
}

// 初始化 Firebase App
const app = initializeApp(firebaseConfig)

// 取得 Firestore 資料庫實體
const db = getFirestore(app)

// 取得 Auth 實體
const auth = getAuth(app)

// 匯出 db 和 auth
export { db, auth }
