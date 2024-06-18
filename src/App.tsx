import MapboxStyleParser from 'geostyler-mapbox-parser';
import SLDParser from 'geostyler-sld-parser';
import QgisStyleParser from 'geostyler-qgis-parser';

import { useState } from 'react';
import { Form, Select } from 'antd';

import { CodeEditor, GeoStylerContext, GeoStylerContextInterface, GeoStylerLocale, locale as GsLocale } from 'geostyler';

import { Style as GsStyle } from 'geostyler-style';

import logo from './assets/images/logo.svg';
import './assets/styles/App.scss';

export interface Locale extends GeoStylerLocale {
    language: string;
}

export const App: React.FC = () => {
    const [locale, setLocale] = useState<Locale>({
        language: 'Language',
        ...GsLocale.en_US,
    });

    const onLangChange = (lang: 'en' | 'de' | 'es' | 'fr' | 'ch-zn') => {
        switch (lang) {
            case 'en':
                setLocale({
                    language: 'Language',
                    ...GsLocale.en_US,
                });
                break;
            case 'de':
                setLocale({
                    language: 'Sprache',
                    ...GsLocale.de_DE,
                });
                break;
            case 'fr':
                setLocale({
                    language: 'Langue',
                    ...GsLocale.fr_FR,
                });
                break;
            case 'es':
                setLocale({
                    language: 'Idioma',
                    ...GsLocale.es_ES,
                });
                break;
            case 'ch-zn':
                setLocale({
                    language: '语言',
                    ...GsLocale.zh_CN,
                });
                break;
            default:
                break;
        }
    };

    const defaultStyle: GsStyle = {
        name: 'Demo Style',
        rules: [
            {
                name: 'Rule 1',
                symbolizers: [
                    {
                        kind: 'Line',
                        color: '#ff0000',
                        width: 5,
                    },
                ],
            },
        ],
    };

    const [style, setStyle] = useState(defaultStyle);

    const sldParser = new SLDParser({
        sldVersion: '1.1.0',
        builderOptions: {
            format: true,
        },
    });

    const mapboxStyleParser = new MapboxStyleParser({
        pretty: true,
    });

    const qgisStyleParser = new QgisStyleParser();

    const ctx: GeoStylerContextInterface = {
        locale
    };

    return (
        <GeoStylerContext.Provider value={ctx}>
            <div className="app">
                <header className="gs-header">
                    <h1 className="app-title">
                        <img className="logo" src={logo} alt="logo" />
                        <span>GeoStyler Converter Demo</span>
                    </h1>
                    <a href="https://geostyler.github.io/geostyler-demo" target="_blank">
                        Full GeoStyler Demo
                    </a>
                </header>

                <div className="gs-content">
                    <div className="code-editor-column">
                        <div className="code-editor-container">
                            <CodeEditor
                                style={style}
                                parsers={[sldParser, qgisStyleParser, mapboxStyleParser]}
                                defaultParser={sldParser}
                                showCopyButton={true}
                                showSaveButton={true}
                                onStyleChange={(style: GsStyle) => {
                                    setStyle(style);
                                }}
                            />
                        </div>
                    </div>
                    <div className="code-editor-column">
                        <div className="code-editor-container">
                            <CodeEditor
                                style={style}
                                parsers={[sldParser, qgisStyleParser, mapboxStyleParser]}
                                defaultParser={mapboxStyleParser}
                                showCopyButton={true}
                                showSaveButton={true}
                                onStyleChange={(style: GsStyle) => {
                                    setStyle(style);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <footer className="gs-footer">
                    <Form layout="inline" className="lang-form">
                        <Form.Item label={locale.language}>
                            <Select
                                defaultValue={'en'}
                                onChange={onLangChange}
                                style={{
                                    width: '140px',
                                }}
                                options={[
                                    {
                                        label: '🇨🇳 Chinese (中文)',
                                        value: 'ch-zn',
                                    },
                                    {
                                        label: '🇺🇸 English',
                                        value: 'en',
                                    },
                                    {
                                        label: '🇩🇪 German',
                                        value: 'de',
                                    },
                                    {
                                        label: '🇪🇸 Spanish',
                                        value: 'es',
                                    },
                                    {
                                        label: '🇫🇷 French',
                                        value: 'fr',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </footer>
            </div>
        </GeoStylerContext.Provider>
    );
};

export default App;
