import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import styled from '@emotion/styled';
import '../App.css'
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';


const Component = styled.div`
    background-color: #F5F5F5;
`

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']
];


function Editor() {

    const quillRef = useRef(null);
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id } = useParams();

    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill('#editor', {
                theme: 'snow',
                modules: {toolbar : toolbarOptions}
            });
        }
        quillRef.current.disable();
        quillRef.current.setText('Loading Contents...');
        setQuill(quillRef.current);
    }, []);

    useEffect(() => {
        const socketServer = io('http://localhost:9000');
        setSocket(socketServer);
        return () => {
            socketServer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket === null || quill === null) return;    

        const handleChange = (delta, oldDelta, source) => {
            if (source !== 'user') return;

            socket && socket.emit('send-changes', delta);
        }
        
        quill && quill.on('text-change', handleChange);

        return () => {
            quill && quill.off('text-change', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (socket === null || quill === null) return;    

        const handleChange = (delta) => {
            quill.updateContents(delta);
        }
        
        socket && socket.on('receive-changes', handleChange);

        return () => {
            socket && socket.off('receive-changes', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        socket && socket.once('load-document', document => {
            quill && quill.setContents(document);
            quill && quill.enable();
        });

        socket && socket.emit('get-document', id);
    },  [quill, socket, id]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        const interval = setInterval(() => {
            socket && socket.emit('save-document', quill.getContents());
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);

    return (
        <Component className='bigContainer'>
            <Box className="container" id="editor"></Box>
        </Component>
    );
}

export default Editor;
