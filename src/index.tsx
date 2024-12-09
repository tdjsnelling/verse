import { useState, useEffect } from "react";
import styles from "./Verse.module.css";

const LINE_HEIGHT = 22;
const COUNTER_SKIP_CHAR = "!";

const boldRegExp = /\*\*([^*]+)\*\*/g;
const italicRegExp = /\*([^*\s][^*]+[^*\s])\*/g;

const formatLine = (line: string): JSX.Element | string => {
  if (line.startsWith(COUNTER_SKIP_CHAR))
    line = line.replace(COUNTER_SKIP_CHAR, "");

  const boldMatches = line.matchAll(boldRegExp);
  for (const match of boldMatches) {
    line = line.replaceAll(match[0], `<strong>${match[1]}</strong>`);
  }

  const italicMatches = line.matchAll(italicRegExp);
  for (const match of italicMatches) {
    line = line.replaceAll(match[0], `<em>${match[1]}</em>`);
  }

  return <span dangerouslySetInnerHTML={{ __html: line }} />;
};

export default function Verse({
  verse,
  width = "100%",
  noLineNumbers = false,
}: {
  verse: string;
  width?: string;
  noLineNumbers?: boolean;
}) {
  const [parsedVerse, setParsedVerse] = useState<{
    lines: string[];
    numbers: Array<number | null>;
  } | null>(null);
  const [lineNumbersReady, setLineNumbersReady] = useState<boolean>(false);

  useEffect(() => {
    const parse = () => {
      let blanks = 0;

      const lines = verse.split("\n");

      if (lines[0] === "") lines.shift();
      if (lines[lines.length - 1] === "") lines.pop();

      const domLines: NodeListOf<HTMLPreElement> = document.querySelectorAll(
        `.${styles.Line}`,
      );

      const numbers = lines.reduce(
        (acc: Array<number | null>, line: string, i) => {
          const domLine = domLines[i];
          if (
            line.length &&
            line.trim() !== "" &&
            !line.startsWith(COUNTER_SKIP_CHAR)
          ) {
            acc.push(i + 1 - blanks);
            if (domLine) {
              const wrappedLines =
                Math.ceil(domLine.offsetHeight / LINE_HEIGHT) - 1;
              for (let i = 0; i < wrappedLines; i++) acc.push(null);
            }
          } else {
            blanks++;
            acc.push(null);
          }
          return acc;
        },
        [],
      );

      setParsedVerse((cur) => {
        if (!cur) parse();
        setLineNumbersReady(true);
        return { lines, numbers };
      });
    };

    setTimeout(parse, 25);
    setTimeout(parse, 250);

    window.addEventListener("resize", parse);

    return () => {
      window.removeEventListener("resize", parse);
    };
  }, [verse]);

  const linesGap =
    !noLineNumbers && parsedVerse
      ? parsedVerse.numbers.filter((n) => typeof n === "number").length < 10
        ? 1
        : 5
      : undefined;

  return (
    parsedVerse && (
      <div className={styles.Verse}>
        {lineNumbersReady ? (
          <>
            {typeof linesGap === "number" && (
              <div className={styles.LineNumbers}>
                {parsedVerse.numbers.map((num, i) => (
                  <p
                    key={`verse-line-number-${i}-${num}`}
                    style={{ lineHeight: `${LINE_HEIGHT}px` }}
                  >
                    {typeof num === "number" && num % linesGap === 0 ? (
                      num
                    ) : (
                      <>&nbsp;</>
                    )}
                  </p>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={`${styles.LineNumbers} empty`} />
        )}
        <div style={{ maxWidth: `${width}px` }}>
          {parsedVerse.lines.map((line, i) => (
            <pre
              key={`verse-line-${i}`}
              className={styles.Line}
              style={{ lineHeight: `${LINE_HEIGHT}px` }}
            >
              {line.length ? formatLine(line) : <>&nbsp;</>}
            </pre>
          ))}
        </div>
      </div>
    )
  );
}
