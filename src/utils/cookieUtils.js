export function getCookie() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith('csrftoken=')) {
          cookieValue = trimmed.substring('csrftoken='.length);
          break;
        }
      }
    }
    return cookieValue;
}