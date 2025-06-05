// 세션 저장
function session_set() {
  let session_id = document.querySelector('#typeEmailX'); // 돔 트리에서 id검색
  let session_pass = document.querySelector('#typePasswordX'); // 돔 트리에서 pass검색
  if (sessionStorage) {
    let en_text = encrypt_text(session_pass.value);
    // sessionStorage.setItem('Session_Storage_test', session_id.value);
    sessionStorage.setItem('Session_Storage_id', session_id.value);
    sessionStorage.setItem('Session_Storage_pass', en_text);
  } else {
    alert('로컬 스토리지 지원 x');
  }
}

// 세션 읽기
function session_get() {
  if (sessionStorage) {
    return sessionStorage.getItem('Session_Storage_pass');
  } else {
    alert('세션 스토리지 지원 x');
  }
}

// 세션 검사
function session_check() {
  if (sessionStorage.getItem('Session_Storage_pass')) {
    alert('이미 로그인 되었습니다.');
    location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
  }
}

// 세션 삭제
function session_del() {
  if (sessionStorage) {
    sessionStorage.removeItem('Session_Storage_pass');
    alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
  } else {
    alert('세션 스토리지 지원 x');
  }
}
