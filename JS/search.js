const search_message = () => {
  const c = '검색을 수행합니다.';
  alert(c);
};

document
  .getElementById('search_button_msg')
  .addEventListener('click', search_message);
// function search_message() {
//   alert('검색을 수행합니다!');
// }
// function search_message() {
//   alert('검색을 수행합니다!2');
// }
// function search_message() {
//   // alert('검색을 수행합니다!3');
//   let msg = '검색을 수행합니다.';
//   alert(msg);
// }

function googleSearch() {
  const searchTerm = document.getElementById('search_input').value.trim(); // 앞뒤 공백 제거
  const badWords = ['비속어1', '비속어2', '비속어3', '비속어4', '비속어5']; // 비속어 배열

  // 공백 검사
  if (searchTerm.length === 0) {
    alert('검색어를 입력하세요.');
    return false;
  }

  // 비속어 검사
  for (let i = 0; i < badWords.length; i++) {
    if (searchTerm.includes(badWords[i])) {
      alert('부적절한 검색어가 포함되어 있습니다.');
      return false;
    }
  }
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    searchTerm
  )}`;
  // 새 창에서 구글 검색을 수행
  window.open(googleSearchUrl, '_blank'); // 새로운 창에서 열기.
  return false;
}
