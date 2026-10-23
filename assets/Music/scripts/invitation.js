import { digestInvitation, invitationRoutes } from './invitation-hash.mjs';

const avatar = document.querySelector('.avatar');
const showFallback = () => { avatar.hidden = true; };
avatar.addEventListener('error', showFallback);
if (avatar.complete && avatar.naturalWidth === 0) showFallback();

const form = document.querySelector('.invitation');
const input = document.querySelector('#invitation-code');
const status = document.querySelector('#invitation-status');
let revision = 0;
let timer;
let navigating = false;

function showStatus(message, error = false) {
  status.textContent = message;
  status.dataset.error = String(error);
  input.setAttribute('aria-invalid', String(error));
}

async function verify(explicit = false) {
  const currentRevision = ++revision;
  const value = input.value;
  if (!value) {
    if (explicit) showStatus('请先输入邀请码', true);
    return;
  }
  try {
    const digest = await digestInvitation(value);
    if (revision !== currentRevision || navigating) return;
    const route = invitationRoutes.find((entry) => entry.digest === digest);
    if (route) {
      navigating = true;
      showStatus('验证成功，正在进入…');
      window.location.assign(new URL(route.path, import.meta.url).href);
    } else if (explicit) {
      showStatus('邀请码不正确，请检查大小写后重试', true);
    }
  } catch {
    if (revision === currentRevision) showStatus('验证暂不可用，请使用 HTTPS 或 localhost 打开页面', true);
  }
}

input.addEventListener('input', () => {
  revision++;
  clearTimeout(timer);
  showStatus('输入邀请码，开启新的发现');
  timer = setTimeout(() => verify(), 350);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimeout(timer);
  verify(true);
});

window.addEventListener('pageshow', () => { navigating = false; });
