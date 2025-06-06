import {
  session_set,
  session_get,
  session_check,
  session_del,
} from './session.js';
import {
  encrypt_text,
  decrypt_text,
  encodeByAES256,
  decodeByAES256,
} from './crypto.js';
import {
  generateJWT,
  checkAuth,
  verifyJWT,
  isAuthenticated,
  removeJWT,
} from './jwt_token.js';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  init_logined();

  const encrypted = sessionStorage.getItem('session_Storage_encrypt_join');
  if (encrypted) {
    const decrypted = decrypt_text(encrypted);
    if (decrypted) {
      try {
        const userObj = JSON.parse(decrypted);
        console.log('복호화된 회원가입 객체:', userObj);
      } catch (e) {
        console.warn('복호화는 성공했으나 JSON 파싱에 실패:', decrypted);
      }
    }
  }
});

// 세션 복호화 함수
function init_logined() {
  if (sessionStorage) {
    decrypt_text(); // 복호화 함수
  } else {
    alert('세션 스토리지 지원 x');
  }
}

// 로그아웃(카운트, 세션 삭제) 함수
function logout() {
  logout_count(); // 로그아웃 카운트
  session_del(); //세션 삭제
  removeJWT(); // jwt토큰 삭제
  location.href = '../index.html';
}

// 로그아웃 버튼 이벤트
const logoutBtn = document.getElementById('logout_btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
