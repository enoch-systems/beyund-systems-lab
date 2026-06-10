// scripts/rewrite-admin-paths.mjs
// Replaces "/admin" URL paths with "/adminportal" in source files,
// while leaving import paths and JSX tag names alone.
//
// Usage: node scripts/rewrite-admin-paths.mjs <file1> [file2] ...
import fs from "node:fs";

const files = process.argv.slice(2);
let totalChanged = 0;

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.warn(`skip (missing): ${f}`);
    continue;
  }
  const before = fs.readFileSync(f, "utf8");
  // Match "/admin" only when it's a URL path, not part of an identifier
  // or import path. The lookarounds ensure we don't touch things like
  // "/admin/foo" -> "/adminportal/foo", or "from '@/.../admin/...'".
  // Strategy: match `"/admin` not followed by `portal` and not inside
  // an import-like path. We treat strings starting with `/admin` followed
  // by `"`, `/`, `)`, `,`, or whitespace as URL paths.
  const after = before.replace(
    /(["'`])\/admin(?=portal\b)|(["'`])\/admin(["/`)\s,])/g,
    (_m, q1, q2, q3) => {
      if (q2) return `${q2}/adminportal${q3}`;
      return _m; // skip - already /adminportal
    },
  );

  if (before !== after) {
    fs.writeFileSync(f, after, "utf8");
    console.log(`updated: ${f}`);
    totalChanged++;
  } else {
    console.log(`no change: ${f}`);
  }
}

console.log(`\nDone. ${totalChanged} file(s) updated.`);
