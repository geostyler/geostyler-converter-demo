import Editor from '@monaco-editor/react';
import MapboxStyleParser from 'geostyler-mapbox-parser';
import SLDParser from 'geostyler-sld-parser';
import { useState } from 'react';
import logo from './assets/images/logo.svg';
import './assets/styles/App.scss';

const getParser = (styleFormat: string) => {
    let parser = null;
    switch (styleFormat) {
        case 'mapbox':
            parser = new MapboxStyleParser({ pretty: true });
            break;
        case 'sld':
            parser = new SLDParser({ builderOptions: { format: true } });
            break;
        // case "qgis":
        // case "qml":
        //     parser = new QGISStyleParser();
        //     break;
        default:
            break;
    }
    return parser;
};

function App() {
    const [leftStyleFormat, setLeftStyleFormat] = useState('sld');
    const [leftEditorText, setLeftEditorText] = useState('');
    const leftParser = getParser(leftStyleFormat);

    const [rightStyleFormat, setRightStyleFormat] = useState('mapbox');
    const [rightEditorText, setRightEditorText] = useState('');
    const rightParser = getParser(rightStyleFormat);

    const handleLeftEditorTextChange = (leftEditorText: string) => {
        leftParser
            ?.readStyle(leftEditorText)
            .then((gStyle) => {
                if ('errors' in gStyle || gStyle?.errors?.length > 0) {
                    console.error(gStyle.errors);
                } else {
                    rightParser
                        ?.writeStyle(gStyle.output)
                        .then((rStyle) => {
                            if ('errors' in rStyle || rStyle?.errors?.length > 0) {
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

    const handleRightEditorTextChange = (rightEditorText: string) => {
        rightParser
            ?.readStyle(rightEditorText)
            .then((gStyle) => {
                if ('errors' in gStyle || gStyle?.errors?.length > 0) {
                    console.error(gStyle.errors);
                } else {
                    leftParser
                        ?.writeStyle(gStyle.output)
                        .then((lStyle) => {
                            if ('errors' in lStyle || lStyle?.errors?.length > 0) {
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
        <div className="app">
            <header className="gs-header">
                <h1 className="app-title">
                    <img className="logo" src={logo} alt="logo" />
                    <span>Geostyler Converter Demo</span>
                </h1>
                <a href="https://geostyler.github.io/geostyler-demo" target="_blank">
                    Geostyler demo
                </a>
            </header>

            <div className="style-editor-container">
                <Editor
                    height="90vh"
                    defaultLanguage={leftStyleFormat === 'mapbox' ? 'json' : 'xml'}
                    value={leftEditorText}
                    onChange={handleLeftEditorTextChange}
                />
                <Editor
                    height="90vh"
                    defaultLanguage={rightStyleFormat === 'mapbox' ? 'json' : 'xml'}
                    value={rightEditorText}
                    onChange={handleRightEditorTextChange}
                />
            </div>
        </div>
    );
}

export default App;
