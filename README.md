# verse

A React component for rendering poetry.

## Features

* Line numbering
  * Automatically recalculated if lines wrap
* Indentation of wrapped lines
* Preserves white space
* Bold & italic formatting

## Usage

```
npm install @tdjsnelling/verse
```

```typescript jsx
import React from "react";
import Verse from "@tdjsnelling/verse";
import "@tdjsnelling/verse/dist/index.css";
import poem from "./poem";

export default function App() {
  return (
    <Verse verse={poem} />
  );
}
```

## Options

| Name              | Type    | Required | Default | Note                                                                       |
|-------------------|---------|----------|---------|----------------------------------------------------------------------------|
| `verse`           | String  | yes      | none    | The verse to render. Use a template literal to preserve white space        |
| `lineHeight`      | Number  | no       | 22      | Line height in pixels                                                      |
| `width`           | String  | no       | 100%    | A valid CSS width value                                                    |
| `noLineNumbers`   | Boolean | no       | false   | Hide line numbers                                                          |
| `counterSkipChar` | String  | no       | !       | Prefix lines with this character and they won't increment the line counter |

## Formatting

Bold (`**bold**`) and italic (`*italic*`) delimiters in the supplied verse will be rendered as such.

Prefixing a line with the skip character (default `!`) will mean that line does not increment the line counter. Useful for things like intra-poem paragraph titles. Empty lines do not need the skip character.

## [Demo](https://codesandbox.io/p/sandbox/txmpn5)
