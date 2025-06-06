document.addEventListener('DOMContentLoaded', () => {
  // 세션에 로그인 정보가 없으면 메인 페이지로 이동
  if (!sessionStorage.getItem('Session_Storage_pass')) {
    alert('로그인 후 이용 가능합니다.');
    window.location.href = '../index.html'; // 메인 페이지로 이동
  }
});
