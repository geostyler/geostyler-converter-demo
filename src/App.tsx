import Editor from "@monaco-editor/react";
import MapboxParser from "geostyler-mapbox-parser";
import QGISStyleParser from "geostyler-qgis-parser";
import SLDParser from "geostyler-sld-parser";
import { useState } from "react";

const getParser = (styleFormat) => {
    let parser = null;
    switch (styleFormat) {
        case "mapbox":
            parser = new MapboxParser({ pretty: true });
            break;
        case "sld":
            parser = new SLDParser({ builderOptions: { format: true } });
            break;
        case "qgis":
        case "qml":
            parser = new QGISStyleParser();
            break;
        default:
            break;
    }
    return parser;
};

function App() {
    const [leftStyleFormat, setLeftStyleFormat] = useState("sld");
    const [leftEditorText, setLeftEditorText] = useState("");
    const leftParser = getParser(leftStyleFormat);

    const [rightStyleFormat, setRightStyleFormat] = useState("mapbox");
    const [rightEditorText, setRightEditorText] = useState("");
    const rightParser = getParser(rightStyleFormat);

    const handleLeftEditorTextChange = (leftEditorText) => {
        leftParser
            ?.readStyle(leftEditorText)
            .then((gStyle) => {
                if ("errors" in gStyle || gStyle?.errors?.length > 0) {
                    console.error(gStyle.errors);
                } else {
                    rightParser
                        ?.writeStyle(gStyle.output)
                        .then((rStyle) => {
                            if ("errors" in rStyle || rStyle?.errors?.length > 0) {
                                console.error(rStyle.errors);
                            } else {
                                setRightEditorText(rStyle.output);
                            }
                        })
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => console.error(error));
    };

    const handleRightEditorTextChange = (rightEditorText) => {
        rightParser
            ?.readStyle(rightEditorText)
            .then((gStyle) => {
                if ("errors" in gStyle || gStyle?.errors?.length > 0) {
                    console.error(gStyle.errors);
                } else {
                    leftParser
                        ?.writeStyle(gStyle.output)
                        .then((lStyle) => {
                            if ("errors" in lStyle || lStyle?.errors?.length > 0) {
                                console.error(lStyle.errors);
                            } else {
                                setLeftEditorText(lStyle.output);
                            }
                        })
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => console.error(error));
    };

    return (
        <>
            <h1>Geostyler Converter Demo</h1>

            <div className="style-editor-container">
                <Editor
                    height="90vh"
                    defaultLanguage={leftStyleFormat === "mapbox" ? "json" : "xml"}
                    value={leftEditorText}
                    onChange={handleLeftEditorTextChange}
                />
                <Editor
                    height="90vh"
                    defaultLanguage={rightStyleFormat === "mapbox" ? "json" : "xml"}
                    value={rightEditorText}
                    onChange={handleRightEditorTextChange}
                />
            </div>
        </>
    );
}

export default App;
