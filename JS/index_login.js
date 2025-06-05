//
window.addEventListener('DOMContentLoaded', () => {
  const encrypted = sessionStorage.getItem('Session_Storage_pass2');
  if (encrypted) {
    decryptAESGCM(encrypted, 'mySecretKey').then((decrypted) => {
      console.log('복호화된 값:', decrypted);
      // 복호화된 비밀번호 사용
    });
  }
});
