import { useCallback, useEffect, useRef, useState } from "react";
import "rc-message/assets/index.css";
import jsBeautify from "js-beautify";
import { graphqlQueryToCode } from "@saneksa/gql-query-transformer";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { monokai } from "@uiw/codemirror-theme-monokai";
import copyToClipboard from "copy-to-clipboard";
import Message from "rc-message";
import { Flex } from "@saneksa/react-flex";

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
      if (e.ctrlKey && ["c", "с", "s", "ы"].includes(e.key)) {
        if (codeRef.current) {
          copyToClipboard(codeRef.current) &&
            Message.success({
              theme: "dark",
              content: "Код был скопирован в буфер обмена",
            });
        }

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
    <Flex gap={12} direction="vertical">
      <button
        style={{
          width: "100%",
          height: "48px",
          cursor: "pointer",
          fontSize: "24px",
        }}
        onClick={handleBeautify}
      >
        Сделать красиво
      </button>
      <Flex gap={0} justify="center" width="100%">
        <Flex
          gap={12}
          direction="vertical"
          key={1}
          justify="center"
          align="center"
          width="50%"
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
        </Flex>

        <Flex
          key={2}
          gap={12}
          direction="vertical"
          justify="center"
          align="center"
          width="50%"
        >
          <div>Code</div>
          <CodeMirror
            value={code}
            readOnly={true}
            editable={false}
            height="100%"
            theme={monokai}
            extensions={[javascript()]}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
