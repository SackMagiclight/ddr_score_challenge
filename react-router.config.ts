import type { Config } from "@react-router/dev/config";
import { copyFileSync } from "node:fs";
import { join } from "node:path";

export default {
  ssr: false,
  basename: "/",
  buildEnd({ viteConfig }) {
    if (!viteConfig.isProduction) return;
    const buildPath = viteConfig.build.outDir;
    copyFileSync(join(buildPath, "index.html"), join(buildPath, "404.html"));
  },
} satisfies Config;
