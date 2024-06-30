import { useCallback, useEffect, useRef, useState } from "react";
import jsBeautify from "js-beautify";
import { graphqlQueryToCode } from "@saneksa/gql-query-transformer";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { monokai } from "@uiw/codemirror-theme-monokai";
import copyToClipboard from "copy-to-clipboard";

const config = {
  indent_size: 2,
  indent_char: " ",
  max_preserve_newlines: 0,
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: true,
  brace_style: "collapse",
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: 0,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
} satisfies jsBeautify.JSBeautifyOptions;

function App() {
  const [graphqlCode, setGraphqlCode] = useState<string | undefined>(undefined);
  const [code, setCode] = useState<string | undefined>(undefined);
  const codeRef = useRef(code);
  codeRef.current = code;

  const handleChange = useCallback((value: string) => {
    try {
      setGraphqlCode(value);
      setCode(graphqlQueryToCode(value));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleBeautify = useCallback(() => {
    try {
      setGraphqlCode((c = "") => jsBeautify(c, config));

      setCode(
        graphqlCode ? jsBeautify(graphqlQueryToCode(graphqlCode), config) : ""
      );
    } catch (error) {
      console.error(error);
    }
  }, [graphqlCode]);

  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "s") || e.key === "ы") {
        codeRef.current && copyToClipboard(codeRef.current);

        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleSave);

    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, []);

  return (
    <div>
      <button
        style={{
          width: "100%",
          height: "48px",
          cursor: "pointer",
          marginBottom: "24px",
        }}
        onClick={handleBeautify}
      >
        Сделать красиво
      </button>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          maxWidth: "100%",
        }}
      >
        <div
          key={1}
          style={{
            flex: "1 0 50%",
            maxWidth: "50%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Graphql query</div>
          <CodeMirror
            value={graphqlCode}
            height="100%"
            theme={monokai}
            extensions={[javascript()]}
            onChange={handleChange}
            title="asddasd"
          />
        </div>

        <div
          key={2}
          style={{
            flex: "1 0 50%",
            maxWidth: "50%",
          }}
        >
          <CodeMirror
            value={code}
            readOnly={true}
            editable={false}
            height="100%"
            theme={monokai}
            extensions={[javascript()]}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
