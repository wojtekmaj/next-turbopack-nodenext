[![npm](https://img.shields.io/npm/v/next-turbopack-nodenext.svg)](https://www.npmjs.com/package/next-turbopack-nodenext) ![downloads](https://img.shields.io/npm/dt/next-turbopack-nodenext.svg) [![CI](https://github.com/wojtekmaj/next-turbopack-nodenext/actions/workflows/ci.yml/badge.svg)](https://github.com/wojtekmaj/next-turbopack-nodenext/actions)

# next-turbopack-nodenext

Adds module: NodeNext support to Turbopack in Next.js.

## tl;dr

- Install by executing `npm install next-turbopack-nodenext` or `yarn add next-turbopack-nodenext --dev`.
- Import by adding `import withNodeNext from 'next-turbopack-nodenext'`.
- Use it by wrapping your config `export default withNodeNext(nextConfig)`.

## What's this all about?

Suppose you have two TypeScript files:

```ts
// index.ts
import { foo } from './foo.js';
```

```ts
// foo.ts
export const foo = 'foo';
```

Note how despite the fact that `foo.ts` is a TypeScript file, it is imported, somewhat counterintuitively, as a JavaScript file. That's because after it is compiled, it _will be_ a JavaScript file.

This way of importing files is the only way to ensure your code is interoperable with both Node.js and the browser. It also works with Vite, esbuild, and many other tools. However, it does not work out-of-the-box with Next.js:

```
 ⨯ ./app/(dashboard)/layout.tsx:6:1
Module not found: Can't resolve './Header.js'
```

You can use [`experimental.extensionAlias`](https://webpack.js.org/configuration/resolve/#resolveextensionalias) option to tell the bundler to also look for `.ts` and `.tsx` files when importing `.js` files.

However, [this option is not available in Turbopack yet](https://github.com/vercel/turbo/issues/4807). `next-turbopack-nodenext` patches this missing feature in Turbopack by resolving `.js` imports for it and passing the resolved paths to the bundler using another option, `experimental.turbo.resolveAlias`.

If you previously provided `experimental.extensionAlias` in your Next.js config, `next-turbopack-nodenext` will respect it and use it to resolve `.js` imports. If not, it will provide its own default configuration (resolving imports to `.ts`, `.tsx`, `.js`, and `.jsx` files, in that order).

## License

The MIT License.

## Author

<table>
  <tr>
    <td >
      <img src="https://avatars.githubusercontent.com/u/5426427?v=4&s=128" width="64" height="64" alt="Wojciech Maj">
    </td>
    <td>
      <a href="https://github.com/wojtekmaj">Wojciech Maj</a>
    </td>
  </tr>
</table>
