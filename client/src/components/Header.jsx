import React from 'react';
import '../App.css';
import { colors } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
    const [copied, setCopied] = useState(false);

    return (
        <div className='header'>
            <div className='gradientOverlay'>
                <h1 className='title'><span className='quick'>Quick</span>Doc</h1>
                <div className='nav'>
                <a href="/about" onClick={(e) => {e.preventDefault(); window.open('/', '_blank', 'noopener,noreferrer');}}><p className="navEle">New Doc</p></a>
                    <div
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                            setCopied(false);
                            }, 2000);
                        }}
                    >
                        <p className="navEle">{
                            copied ? 'Link Copied!' : 'Share'
                        }</p>
                    </div>
                </div>        
            </div>
        </div>
    );
}

export default Header;
