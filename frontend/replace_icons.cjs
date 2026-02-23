const fs = require("fs");
const path = require("path");

const mappings = {
  LayoutDashboard: "SquaresFour",
  Wallet: "Wallet",
  Menu: "List",
  X: "X",
  LogOut: "SignOut",
  User: "User",
  ChevronLeft: "CaretLeft",
  ChevronRight: "CaretRight",
  Circle: "Circle",
  Check: "Check",
  ChevronDown: "CaretDown",
  ChevronUp: "CaretUp",
  ArrowLeft: "ArrowLeft",
  Plus: "Plus",
  Loader2: "Spinner",
  Calendar: "Calendar",
  CalendarIcon: "Calendar",
  Trophy: "Trophy",
  Zap: "Lightning",
  Edit2: "PencilSimple",
  Trash2: "Trash",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  Clock: "Clock",
  Sparkles: "Sparkle",
  TrendingUp: "TrendUp",
  TrendingDown: "TrendDown",
  ArrowUpRight: "ArrowUpRight",
  ArrowDownRight: "ArrowDownRight",
  Minus: "Minus",
};

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("lucide-react")) {
        console.log("Processing", fullPath);

        let importedIcons = [];
        content = content.replace(
          /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g,
          (match, imports) => {
            const parts = imports
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            const newImports = [];
            for (let p of parts) {
              let originalName = p;
              let aliasName = p;
              if (p.includes(" as ")) {
                [originalName, aliasName] = p
                  .split(" as ")
                  .map((s) => s.trim());
              }

              // For cases where we have something like Calendar as CalendarIcon
              importedIcons.push({ originalName, aliasName });

              if (aliasName === "CalendarIcon" && originalName === "Calendar") {
                newImports.push(`Calendar as CalendarIcon`);
              } else {
                const newName = mappings[originalName] || originalName;
                newImports.push(newName);
              }
            }
            return `import { ${newImports.join(", ")} } from "@phosphor-icons/react";`;
          },
        );

        // Now replace the usages
        for (const { originalName, aliasName } of importedIcons) {
          const newName = mappings[originalName] || originalName;
          if (aliasName !== "CalendarIcon" && newName !== aliasName) {
            // Component usage: <TrendingUp ... />
            const tagRegex = new RegExp(`<${aliasName}([\\s/>])`, "g");
            content = content.replace(tagRegex, `<${newName}$1`);

            const closeTagRegex = new RegExp(`</${aliasName}>`, "g");
            content = content.replace(closeTagRegex, `</${newName}>`);

            // Variable usage: icon={TrendingUp} or icon: TrendingUp
            const propRegex = new RegExp(
              `([^a-zA-Z0-9_])${aliasName}([^a-zA-Z0-9_])`,
              "g",
            );
            content = content.replace(propRegex, `$1${newName}$2`);
          }
        }

        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, "src"));
console.log("Done");
