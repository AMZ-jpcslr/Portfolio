// GitHub repository creation timestamps are compared and displayed in UTC.
export const chronologicalProjects = projects => [...projects].sort((a, b) =>
  Date.parse(a.repositoryCreatedAt) - Date.parse(b.repositoryCreatedAt));

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderTimeline(projects) {
  return chronologicalProjects(projects).map(p => {
    const month = p.repositoryCreatedAt.slice(0, 7);
    return `<li class="timeline-item"><time datetime="${escape(month)}">${month.replace('-', '.')}</time><a href="#project=${encodeURIComponent(p.id)}"><span class="timeline-category">${escape(p.category)}</span><h3>${escape(p.title)}</h3><p>${escape(p.tagline)}</p><span class="timeline-arrow" aria-hidden="true">↗</span></a></li>`;
  }).join('');
}
