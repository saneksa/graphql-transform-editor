import { useCallback, useEffect, useRef, useState } from "react";
import "rc-message/assets/index.css";
import { graphqlQueryToCode } from "@saneksa/gql-query-transformer";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { monokai } from "@uiw/codemirror-theme-monokai";
import copyToClipboard from "copy-to-clipboard";
import Message from "rc-message";
import { Flex } from "@saneksa/react-flex";
import prettier from "prettier/standalone";
import prettierGraphql from "prettier/plugins/graphql";
import prettierEstree from "prettier/plugins/estree";
import prettierBabel from "prettier/plugins/babel";

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

  const handleBeautify = useCallback(async () => {
    try {
      graphqlCode &&
        setGraphqlCode(
          await prettier.format(graphqlCode, {
            parser: "graphql",
            plugins: [prettierGraphql],
          })
        );

      graphqlCode &&
        setCode(
          await prettier.format(graphqlQueryToCode(graphqlCode), {
            parser: "babel",
            plugins: [prettierEstree, prettierBabel],
          })
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
