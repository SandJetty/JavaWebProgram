import { encrypt_text, decrypt_text } from './crypto.js';

// 세션 저장
export async function session_set() {
  let id = document.querySelector('#typeEmailX');
  let password = document.querySelector('#typePasswordX'); // DOM 트리에서 pass 검색
  let random = new Date();

  const obj = {
    id: id.value,
    otp: random,
  };
  if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체 -> json문자열 변환
    let en_text = encrypt_text(objString);

    sessionStorage.setItem('Session_Storage_id', id.value);
    sessionStorage.setItem('Session_Storage_pass', en_text);
    sessionStorage.setItem('Session_Storage_object', objString);

    sessionStorage.setItem('Session_Storage_pass2', en_text2); // 암호화된 비밀번호 저장
    // 키를 세션에 저장 (실제 서비스에서는 안전하게 관리 필요)
    sessionStorage.setItem(
      'Session_Storage_key',
      JSON.stringify(await window.crypto.subtle.exportKey('jwk', key))
    );
  } else {
    alert('세션 스토리지 지원 x');
  }
}

// 회원가입 세션 저장
export function session_set2(obj) {
  if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체 -> json문자열 변환
    // let en_text = encrypt_text(session_pass.value);
    sessionStorage.setItem('Session_Storage_join', objString);
  } else {
    alert('세션 스토리지 지원 x');
  }
}

// 세션 읽기
export function session_get() {
  if (sessionStorage) {
    return sessionStorage.getItem('Session_Storage_pass');
  } else {
    alert('세션 스토리지 지원 x');
  }
}

// 세션 검사
export function session_check() {
  if (window.location.pathname.includes('logout.html')) {
    return;
  }
  if (sessionStorage.getItem('Session_Storage_pass')) {
    alert('이미 로그인 되었습니다.');
    location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
  }
}

// 세션 삭제
export function session_del() {
  if (sessionStorage) {
    sessionStorage.removeItem('Session_Storage_pass');
    alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
  } else {
    alert('세션 스토리지 지원 x');
  }
}
