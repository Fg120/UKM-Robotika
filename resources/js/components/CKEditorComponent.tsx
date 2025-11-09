import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Heading,
    Link,
    List,
    BlockQuote,
    Image,
    ImageToolbar,
    ImageUpload,
    ImageCaption,
    ImageStyle,
    ImageResize,
    Underline,
    Strikethrough,
    Code,
    CodeBlock,
    Table,
    TableToolbar,
    MediaEmbed,
    HorizontalLine,
    Alignment,
    FontSize,
    FontFamily,
    FontColor,
    FontBackgroundColor,
    Highlight,
    RemoveFormat,
    Indent,
    IndentBlock
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import axios from 'axios';

interface CKEditorComponentProps {
    data: string;
    onChange: (data: string) => void;
}

// Custom Upload Adapter untuk CKEditor menggunakan Axios
class MyUploadAdapter {
    loader: any;
    controller: AbortController;

    constructor(loader: any) {
        this.loader = loader;
        this.controller = new AbortController();
    }

    upload() {
        return this.loader.file.then((file: File) => {
            const formData = new FormData();
            formData.append('upload', file);

            return axios.post('/admin/artikel/upload-image', formData, {
                signal: this.controller.signal,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        this.loader.uploadTotal = progressEvent.total;
                        this.loader.uploaded = progressEvent.loaded;
                    }
                }
            })
                .then(response => {
                    if (response.data && response.data.url) {
                        return {
                            default: response.data.url
                        };
                    }
                    return Promise.reject('Upload failed');
                })
                .catch(error => {
                    const message = error.response?.data?.error?.message || error.message || 'Upload failed';
                    return Promise.reject(message);
                });
        });
    }

    abort() {
        this.controller.abort();
    }
}

function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new MyUploadAdapter(loader);
    };
}

export default function CKEditorComponent({ data, onChange }: CKEditorComponentProps) {
    return (
        <div className="ckeditor-wrapper border rounded-md">
            <style>{`
                /* Nonaktifkan preview font size di dropdown */
                .ck.ck-dropdown .ck-button__label {
                    font-size: 13px !important;
                }
                .ck.ck-list__item {
                    font-size: 13px !important;
                }
            `}</style>
            <CKEditor
                editor={ClassicEditor}
                config={{
                    toolbar: {
                        items: [
                            'undo', 'redo', '|',
                            'heading', '|',
                            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'code', 'removeFormat', '|',
                            'alignment', '|',
                            'link', 'uploadImage', 'mediaEmbed', 'insertTable', 'blockQuote', 'codeBlock', 'horizontalLine', '|',
                            'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                            'highlight'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    plugins: [
                        Bold,
                        Essentials,
                        Italic,
                        Underline,
                        Strikethrough,
                        Code,
                        CodeBlock,
                        Mention,
                        Paragraph,
                        Undo,
                        Heading,
                        Link,
                        List,
                        BlockQuote,
                        Image,
                        ImageToolbar,
                        ImageCaption,
                        ImageStyle,
                        ImageResize,
                        ImageUpload,
                        Table,
                        TableToolbar,
                        MediaEmbed,
                        HorizontalLine,
                        Alignment,
                        FontSize,
                        FontFamily,
                        FontColor,
                        FontBackgroundColor,
                        Highlight,
                        RemoveFormat,
                        Indent,
                        IndentBlock
                    ],
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            {
                                model: 'heading1',
                                view: { name: 'h1', styles: { 'font-size': '2em', 'font-weight': 'bold' } },
                                title: 'Heading 1',
                                class: 'ck-heading_heading1'
                            },
                            {
                                model: 'heading2',
                                view: { name: 'h2', styles: { 'font-size': '1.5em', 'font-weight': 'bold' } },
                                title: 'Heading 2',
                                class: 'ck-heading_heading2'
                            },
                            {
                                model: 'heading3',
                                view: { name: 'h3', styles: { 'font-size': '1.25em', 'font-weight': 'bold' } },
                                title: 'Heading 3',
                                class: 'ck-heading_heading3'
                            },
                            {
                                model: 'heading4',
                                view: { name: 'h4', styles: { 'font-size': '1.1em', 'font-weight': 'bold' } },
                                title: 'Heading 4',
                                class: 'ck-heading_heading4'
                            }
                        ]
                    },
                    fontSize: {
                        options: [
                            8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72
                        ],
                        supportAllValues: true
                    },
                    fontFamily: {
                        options: [
                            'default',
                            'Arial, sans-serif',
                            'Courier New, monospace',
                            'Georgia, serif',
                            'Lucida Sans Unicode, sans-serif',
                            'Tahoma, sans-serif',
                            'Times New Roman, serif',
                            'Trebuchet MS, sans-serif',
                            'Verdana, sans-serif',
                            'Comic Sans MS, cursive',
                            'Impact, sans-serif'
                        ],
                        supportAllValues: true
                    },
                    fontColor: {
                        columns: 5,
                        documentColors: 10
                    },
                    fontBackgroundColor: {
                        columns: 5,
                        documentColors: 10
                    },
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            '|',
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                            '|',
                            'imageStyle:alignLeft',
                            'imageStyle:alignCenter',
                            'imageStyle:alignRight'
                        ],
                        styles: [
                            'full',
                            'side',
                            'alignLeft',
                            'alignCenter',
                            'alignRight'
                        ]
                    },
                    table: {
                        contentToolbar: [
                            'tableColumn',
                            'tableRow',
                            'mergeTableCells'
                        ]
                    },
                    link: {
                        decorators: {
                            openInNewTab: {
                                mode: 'manual',
                                label: 'Open in a new tab',
                                attributes: {
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                                }
                            }
                        }
                    },
                    placeholder: 'Tulis konten artikel di sini...',
                    licenseKey: 'GPL',
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                }}
                data={data}
                onChange={(_event, editor) => {
                    const content = editor.getData();
                    onChange(content);
                }}
            />
        </div>
    );
}