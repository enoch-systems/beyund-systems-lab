// scripts/patch-global-search.mjs
// Patches src/components/admin/GlobalSearch.tsx to:
//   1. Add `iconBtnHover` constant matching the layout's dark-mode hover.
//   2. Make the closed-state trigger an icon-only button on mobile and a
//      full search bar on desktop.
//   3. Add min-w-0 to the wrapper so the flex-1 search can shrink.
// Run: node scripts/patch-global-search.mjs
import fs from "node:fs";

const file = "src/components/admin/GlobalSearch.tsx";
const raw = fs.readFileSync(file, "utf8");
// Normalize CRLF to LF for matching; restore CRLF on write.
const eol = raw.includes("\r\n") ? "\r\n" : "\n";
let src = raw.replace(/\r\n/g, "\n");

// 1. Inject the iconBtnHover constant after `const C = getColors(theme);`.
const C_LINE = "  const C = getColors(theme);";
const C_REPLACEMENT =
  "  const C = getColors(theme);\n  const iconBtnHover = theme === \"dark\" ? \"#171717\" : C.sidebarActive;";
if (src.includes(C_REPLACEMENT)) {
  console.log("iconBtnHover already present, skipping insertion");
} else if (!src.includes(C_LINE)) {
  console.error("Could not find `const C = getColors(theme);`");
  process.exit(1);
} else {
  src = src.replace(C_LINE, C_REPLACEMENT);
  console.log("inserted iconBtnHover constant");
}

// 2. Replace the closed-state single button with a fragment containing
//    a mobile icon button + desktop full search bar.
const OLD = `      ) : (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="flex items-center gap-1.5 sm:gap-2 w-full px-2 sm:px-3 py-2 rounded-[10px] transition-colors min-w-0"
          style={{
            background: C.card,
            border: \`1px solid \${C.border}\`,
            color: C.muted,
            fontSize: 14,
          }}
          aria-label="Open search"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate text-[11px] sm:text-[13px]">Search</span>
          <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded hidden lg:inline shrink-0" style={{
            color: C.dim,
            background: C.sidebarActive,
          }}>
            ⌘K
          </kbd>
        </button>
      )}`;

const NEW = `      ) : (
        <>
          {/* Mobile: icon-only trigger */}
          <button
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="sm:hidden flex items-center justify-center shrink-0"
            aria-label="Open search"
            style={{
              width: 32, height: 32, borderRadius: 6,
              background: "transparent", border: "none",
              color: C.muted, cursor: "pointer", padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Search className="w-4 h-4" />
          </button>
          {/* Desktop: full search bar */}
          <button
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="hidden sm:flex items-center gap-2 w-full px-3 py-2 rounded-[10px] transition-colors min-w-0"
            style={{
              background: C.card,
              border: \`1px solid \${C.border}\`,
              color: C.muted,
              fontSize: 14,
            }}
            aria-label="Open search"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[13px]">Search students, courses, payments...</span>
            <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded hidden lg:inline shrink-0" style={{
              color: C.dim,
              background: C.sidebarActive,
            }}>
              ⌘K
            </kbd>
          </button>
        </>
      )}`;

if (!src.includes(OLD)) {
  console.error("Could not find the closed-state button block to replace.");
  process.exit(1);
}
src = src.replace(OLD, NEW);
console.log("replaced closed-state button with mobile+desktop pair");

// 3. Update the wrapper div to add `min-w-0` so flex-1 children can shrink.
const WRAP_OLD = `<div ref={dropdownRef} className="relative flex-1 max-w-[480px]">`;
const WRAP_NEW = `<div ref={dropdownRef} className="relative flex-1 max-w-[480px] min-w-0">`;
if (src.includes(WRAP_OLD) && !src.includes(WRAP_NEW)) {
  src = src.replace(WRAP_OLD, WRAP_NEW);
  console.log("added min-w-0 to wrapper");
}

// Restore original line endings.
const out = eol === "\r\n" ? src.replace(/\n/g, "\r\n") : src;
fs.writeFileSync(file, out, "utf8");
console.log("done");
