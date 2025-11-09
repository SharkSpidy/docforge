// Elements
const nameEl = document.getElementById('name');
const descEl = document.getElementById('desc');
const installEl = document.getElementById('install');
const usageEl = document.getElementById('usage');
const featuresEl = document.getElementById('features');
const licenseEl = document.getElementById('license');
const authorEl = document.getElementById('author');

const generateBtn = document.getElementById('generate');
const clearBtn = document.getElementById('clear');
const copyBtn = document.getElementById('copy');
const downloadBtn = document.getElementById('download');
const outputEl = document.getElementById('output');
const previewEl = document.getElementById('preview');
const previewToggle = document.getElementById('previewToggle');

function buildReadme() {
  const name = (nameEl.value || 'Project Name').trim();
  const desc = (descEl.value || 'Short description of the project.').trim();
  const install = (installEl.value || '').trim();
  const usage = (usageEl.value || '').trim();
  const features = (featuresEl.value || '').split(',').map(f=>f.trim()).filter(Boolean);
  const license = (licenseEl.value || 'MIT').trim();
  const author = (authorEl.value || '').trim();

  const featuresMd = features.length ? features.map(f=>`- ${f}`).join('\n') : '';

  const installBlock = install ? `\`\`\`bash\n${install}\n\`\`\`` : '';

  const usageBlock = usage ? `${usage}` : '';

  const authorLine = author ? `\n\n---\n\n👨‍💻 Created by [${author}](https://github.com/${author})` : '';

  const readme =
`# ${name}

${desc}

${featuresMd ? `## Features\n\n${featuresMd}\n` : ''}${installBlock ? `\n## Installation\n\n${installBlock}\n` : ''}${usageBlock ? `\n## Usage\n\n${usageBlock}\n` : ''}

## License
${license}
${authorLine}
`;

  return readme.trim();
}

function generate() {
  const md = buildReadme();
  outputEl.value = md;
  renderPreview(md);
}

function renderPreview(md) {
  // Basic markdown -> HTML for preview (simple, not full Markdown)
  // We'll do naive replacements: headings, codeblocks, lists, links.
  let html = md
    .replace(/```bash\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/\n/g, '<br/>');

  // wrap list items into ul
  html = html.replace(/(<li>[\s\S]*?<\/li>)(<br\/>|$)/g, '<ul>$1</ul>$2');

  previewEl.innerHTML = html;
}

function copyToClipboard() {
  const text = outputEl.value;
  if (!text) return alert('Generate the README first.');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(()=> {
      alert('README copied to clipboard!');
    }, ()=> {
      fallbackCopy(text);
    });
  } else fallbackCopy(text);
}

function fallbackCopy(text) {
  outputEl.select();
  try {
    document.execCommand('copy');
    alert('README copied to clipboard!');
  } catch(e) {
    alert('Copy failed — select and copy manually.');
  }
}

function downloadReadme() {
  const text = outputEl.value;
  if (!text) return alert('Generate the README first.');
  const blob = new Blob([text], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'README.md';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function clearForm() {
  document.getElementById('readme-form').reset();
  outputEl.value = '';
  previewEl.innerHTML = '';
  previewEl.classList.add('hidden');
}

generateBtn.addEventListener('click', generate);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadReadme);
clearBtn.addEventListener('click', clearForm);

previewToggle.addEventListener('click', () => {
  previewEl.classList.toggle('hidden');
  if (!previewEl.classList.contains('hidden')) {
    renderPreview(outputEl.value || buildReadme());
  }
});

// generate a sample on load
document.addEventListener('DOMContentLoaded', () => {
  // small sample content so the UI isn't empty
  nameEl.value = 'Awesome Project';
  descEl.value = 'A one-line description of what the project solves.';
  featuresEl.value = 'Fast, Lightweight, Easy';
  authorEl.value = 'your-github-username';
  generate();
});
