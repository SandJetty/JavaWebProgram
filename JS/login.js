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

const check_xss = (input) => {
  // DOMPurify 라이브러리 로드 (CDN사용)
  const DOMPurify = window.DOMPurify;

  // 입력값을 정화하여 XSS 공격을 방지
  const sanitizedInput = DOMPurify.sanitize(input);

  // Sanitized된 값과 원본 입력값 비교
  if (sanitizedInput !== input) {
    // XSS 공격 가능성이 있는 입력값 발견시 에러 처리
    alert('입력값에 XSS 공격이 감지되었습니다. 올바른 값을 입력해주세요.');
    return false;
  }

  // Sanitized된 값 반환
  return sanitizedInput;
};

// init함수
function init() {
  const emailInput = document.getElementById('typeEmailX');
  const idsave_check = document.getElementById('idSaveCheck');
  let get_id = getCookie('id');

  if (emailInput && idsave_check && get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
  }
  session_check(); // 세션 유무 검사
}
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// set 쿠키
function setCookie(name, value, expiredays) {
  var date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie =
    escape(name) +
    '=' +
    escape(value) +
    '; expires=' +
    date.toUTCString() +
    ';path=/' +
    ';SameSite=None; Secure';
}

// get쿠키
function getCookie(name) {
  var cookie = document.cookie;
  // console.log('쿠키를 요청합니다.');
  if (cookie != '') {
    var cookie_array = cookie.split('; ');
    for (var index in cookie_array) {
      var cookie_name = cookie_array[index].split('=');
      if (cookie_name[0] == name) {
        return cookie_name[1];
      }
    }
  }
  return;
}

// 세션 복호화 함수
function init_logined() {
  if (sessionStorage) {
    decrypt_text(); // 복호화 함수
  } else {
    alert('세션 스토리지 지원 x');
  }
}

// 로그인 횟수 증가 함수
function login_count() {
  let cnt = parseInt(getCookie('login_cnt')) || 0;
  cnt += 1;
  setCookie('login_cnt', cnt, 1); // 1일간 저장
  console.log('로그인 횟수:', cnt);
}

// 로그아웃 횟수 증가 함수
function logout_count() {
  let cnt = parseInt(getCookie('logout_cnt')) || 0;
  cnt += 1;
  setCookie('logout_cnt', cnt, 1); // 1일간 저장
  console.log('로그아웃 횟수:', cnt);
}

// 로그인 실패 카운트 함수
function login_failed() {
  let cnt = parseInt(getCookie('login_fail_cnt')) || 0;
  cnt += 1;
  setCookie('login_fail_cnt', cnt, 1); // 1일간 저장

  // 3회 이상 실패 시 제한 시간 저장 (1분)
  if (cnt === 3) {
    setCookie('login_block_time', Date.now(), 1);
  }
  show_login_status();
  return cnt;
}

// 로그인 실패 카운트 초기화 함수
function reset_login_failed() {
  setCookie('login_fail_cnt', 0, 1);
  setCookie('login_block_time', '', 0);
  show_login_status();
}

// 로그인 상태/실패횟수 출력 함수
function show_login_status() {
  let cnt = parseInt(getCookie('login_fail_cnt')) || 0;
  let blockTime = getCookie('login_block_time');
  const statusDiv = document.getElementById('login_status');
  if (!statusDiv) return;

  if (blockTime) {
    const now = Date.now();
    const blockStart = parseInt(blockTime);
    const remain = 60 - Math.floor((now - blockStart) / 1000);
    if (remain > 0) {
      statusDiv.innerText = `로그인 실패 ${cnt}회. 로그인 제한 중 (${remain}초 남음)`;
    } else {
      // 1분 경과 시 제한 해제
      reset_login_failed();
      statusDiv.innerText = '';
    }
  } else if (cnt > 0) {
    statusDiv.innerText = `로그인 실패 ${cnt}회`;
  } else {
    statusDiv.innerText = '';
  }
}

// 입력값 검증 및 submit
const check_input = () => {
  const loginForm = document.getElementById('login_form');
  const loginBtn = document.getElementById('login_btn');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idsave_check = document.getElementById('idSaveCheck');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  const payload = {
    id: emailValue,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 (3600초)
  };
  const jwtToken = generateJWT(payload);

  const sanitizedPassword = check_xss(passwordValue);
  // check_xss 함수로 비밀번호 const Sanitize
  const sanitizedEmail = check_xss(emailValue);
  // check_xss 함수로 이메일 Sanitize

  // 로그인 제한 체크
  let failCnt = parseInt(getCookie('login_fail_cnt')) || 0;
  let blockTime = getCookie('login_block_time');
  if (blockTime) {
    const now = Date.now();
    const blockStart = parseInt(blockTime);
    if (now - blockStart < 60000) {
      // 1분 제한
      show_login_status();
      alert('로그인 3회 이상 실패로 1분간 로그인이 제한됩니다.');
      return false;
    } else {
      reset_login_failed();
    }
  }

  if (!sanitizedEmail) {
    // Sanitize된 이메일 사용
    login_failed();
    return false;
  }

  if (!sanitizedPassword) {
    // Sanitize된 비밀번호 사용
    login_failed();
    return false;
  }

  // const c = '아이디, 패스워드를 체크합니다';
  // alert(c);

  // if (emailValue === '') {
  //   alert('이메일을 입력하세요.');
  //   return false;
  // }

  // if (passwordValue === '') {
  //   alert('비밀번호를 입력하세요.');
  //   return false;
  // }

  if (emailValue.length > 10) {
    alert('아이디는 최대 10글자 이내로 입력해야 합니다.');
    login_failed();
    return false;
  }

  if (passwordValue.length > 15) {
    alert('비밀번호는 최대 15글자 이내로 입력해야 합니다.');
    login_failed();
    return false;
  }

  // 3글자 이상 반복 입력 제한 (예: aaa, bbb, 111 등)
  const repeatPattern = /(.)\1\1+/;
  if (repeatPattern.test(emailValue) || repeatPattern.test(passwordValue)) {
    alert('동일한 문자를 3글자 이상 반복할 수 없습니다.');
    login_failed();
    return false;
  }

  // 연속되는 숫자 2개 이상 반복 제한 (예: 1212, 3434 등)
  const consecutiveNumberPattern = /(\d{2,})\1+/;
  if (
    consecutiveNumberPattern.test(emailValue) ||
    consecutiveNumberPattern.test(passwordValue)
  ) {
    alert('연속되는 숫자 패턴이 2번 이상 반복될 수 없습니다.');
    login_failed();
    return false;
  }

  const hasSpecialChar =
    passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
  if (!hasSpecialChar) {
    alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
    login_failed();
    return false;
  }

  const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
  const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
  if (!hasUpperCase || !hasLowerCase) {
    alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
    login_failed();
    return false;
  }

  if (idsave_check.checked == true) {
    // 아이디 기억 체크 o
    alert('쿠키를 저장합니다.', emailValue);
    setCookie('id', emailValue, 1); // 1일 저장
    alert('쿠키 값 :' + emailValue);
  } else {
    // 아이디 기억 체크 x
    setCookie('id', emailValue.value, 0); //날짜를 0 - 쿠키 삭제
  }

  console.log('이메일:', emailValue);
  console.log('비밀번호:', passwordValue);

  login_count(); // 로그인 카운트
  session_set(); // 세션 생성
  localStorage.setItem('jwt_token', jwtToken); // 세션 생성 이후 토큰을 로컬에 저장

  // 로그인 성공 시
  const password = passwordInput.value.trim();
  encryptAESGCM(password, 'mySecretKey').then((encrypted) => {
    sessionStorage.setItem('Session_Storage_pass2', encrypted);
  });

  loginForm.submit();
};

// 로그아웃(카운트, 세션 삭제) 함수
function logout() {
  logout_count(); // 로그아웃 카운트
  session_del(); //세션 삭제
  removeJWT(); // jwt토큰 삭제
  location.href = '../index.html';
}

// 공통 js사용으로 오류가 생겨 해당 요소를 골라 실행하기 위해 수정
const loginBtn = document.getElementById('login_btn');
if (loginBtn) {
  loginBtn.addEventListener('click', check_input);
}

const logoutBtn = document.getElementById('logout_btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// 페이지 로드 시 상태 출력
window.addEventListener('DOMContentLoaded', () => {
  show_login_status();
  setInterval(show_login_status, 1000); // 1초마다 남은시간 갱신
});
