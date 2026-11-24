export const contactEmail = 'yomasan55@gmail.com';
export const githubUrl = 'https://github.com/AMZ-jpcslr';

const lead = '選考や制作についてのご連絡は、メールでお気軽にどうぞ。';

function renderContactLinks() {
  return `<ul class="contact-links">
      <li><a class="contact-mail" href="mailto:${contactEmail}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect x="3" y="5.5" width="18" height="13" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.8 7l8.2 6.2L20.2 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span class="contact-kind">メール</span><span class="contact-value">${contactEmail}</span></a></li>
      <li><a class="contact-github" href="${githubUrl}"><img src="/notebook/icons/github.svg" alt="" width="18" height="18"><span class="contact-kind">GitHub</span><span class="contact-value">AMZ-jpcslr <span aria-hidden="true">↗</span></span></a></li>
    </ul>`;
}

// Home: a closing section after About Me.
export function renderHomeContact(gearRule) {
  return `<section id="contact" class="contact paper-width" aria-labelledby="contact-title" tabindex="-1">
    <div class="contact-heading"><h2 id="contact-title" class="english-heading" lang="en">Contact</h2>${gearRule}</div>
    <div class="contact-body">
      <p>${lead}</p>
      ${renderContactLinks()}
    </div>
  </section>`;
}

// About: a section in the same notebook flow as 資格 and ツール使用歴.
export function renderAboutContact() {
  return `<section class="bio-section bio-contact" aria-labelledby="contact">
      <h2 id="contact">連絡先</h2>
      <p>${lead}</p>
      ${renderContactLinks()}
    </section>`;
}
