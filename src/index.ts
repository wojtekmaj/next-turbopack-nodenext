import fs from 'node:fs';
import path from 'node:path';

import fg from 'fast-glob';

import type { NextConfig } from 'next';

export default function withNodeNext(config: NextConfig): NextConfig {
  const resolveAlias = fg
    .globSync('src/**/*.{ts,tsx}')
    .reduce<Record<string, string>>((acc, file) => {
      // For each file, read contents and look for import statements ending with "".js"
      const contents = fs.readFileSync(file, 'utf8');
      const imports = contents.match(/import\s+.*\s+from\s+['"].*\.js['"]/g);

      if (!imports) {
        return acc;
      }

      // For each import statement, add an alias for the .js file to the .ts or .tsx file
      for (const imp of imports) {
        const match = imp.match(/import\s+.*\s+from\s+['"](.*\.js)['"]/);

        if (!match) {
          continue;
        }

        const [, matchedPath] = match;

        if (!matchedPath) {
          continue;
        }

        for (const ext of ['tsx', 'ts']) {
          const extPath = matchedPath.replace(/\.js$/, `.${ext}`);
          const extPathRelativeToFile = path.resolve(path.dirname(file), extPath);
          const extExists = fs.existsSync(extPathRelativeToFile);
          if (extExists) {
            acc[matchedPath] = extPathRelativeToFile.replace(process.cwd(), '.');
            break;
          }
        }
      }

      return acc;
    }, {});

  return {
    ...config,
    experimental: {
      ...(config.experimental || {}),
      turbo: {
        ...(config.experimental?.turbo || {}),
        resolveAlias: {
          ...(config.experimental?.turbo?.resolveAlias || {}),
          ...resolveAlias,
        },
      },
    },
  };
}
