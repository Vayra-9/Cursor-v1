const fs = require('fs');

class MarkdownReporter {
  constructor() {
    this.lines = [];
    this.failures = [];
  }
  onBegin() {
    this.lines.push(`# VAYRA E2E Test Report\n`);
    this.lines.push(`**Date:** ${new Date().toISOString()}\n`);
  }
  onTestEnd(test, result) {
    const title = test.titlePath().join(' › ');
    const status = (result.status || 'unknown').toUpperCase();
    this.lines.push(`- ${status} — ${title}`);
    if (result.status !== 'passed') {
      this.failures.push({ title, error: result.error });
    }
  }
  async onEnd(result) {
    this.lines.unshift(`**Result:** ${(result.status || 'unknown').toUpperCase()}\n`);
    if (this.failures.length) {
      this.lines.push(`\n## ❌ Failures (${this.failures.length})\n`);
      for (const f of this.failures) {
        this.lines.push(`\n### ${f.title}`);
        if (f.error?.message) this.lines.push(`\n\`\`\`\n${f.error.message}\n\`\`\`\n`);
      }
    }
    await fs.promises.mkdir('reports', { recursive: true });
    await fs.promises.writeFile('reports/TEST_REPORT.md', this.lines.join('\n'), 'utf8');
    console.log(this.lines.join('\n'));
  }
}
module.exports = MarkdownReporter;
