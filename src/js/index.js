import '../css/styles.scss';

let socket = new WebSocket('ws://localhost:8080');
socket.onopen = function () {
  console.log('[open] Connection established');
};

let html = document.querySelector('.html');
let css = document.querySelector('.css');
let js = document.querySelector('.js');
let code = document.querySelector('.code').contentWindow.document.body;
getSavedData();
socket.onmessage = function (event) {
  let data = JSON.parse(event.data);
  html.value = data.html;
  css.value = data.css;
  js.value = data.js;
  code.innerHTML = `<style>${css.value}</style>${html.value}`;
  saveData();
};

document.addEventListener('keydown', function (event) {
  if (event.key === 's' && event.ctrlKey) {
    event.preventDefault();
    let script = document.createElement('script');
    script.textContent = js.value;
    code.appendChild(script);
  }
  code.innerHTML = `${html.value}<style>${css.value}</style>`;
  saveData();
  socket.send(JSON.stringify({ html: html.value, css: css.value, js: js.value }));
});

function saveData() {
  localStorage.setItem('html', html.value);
  localStorage.setItem('css', css.value);
  localStorage.setItem('js', js.value);
}

function getSavedData() {
  html.value = localStorage.getItem('html');
  css.value = localStorage.getItem('css');
  js.value = localStorage.getItem('js');
}
// document.addEventListener("keydown", function(e) {
//   if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
//     e.preventDefault();
//     alert('captured');
//   }
// }, false);
