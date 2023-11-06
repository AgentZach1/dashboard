import React, { useState, useEffect } from 'react';
import '../../App.css';

export default function Services() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch the content from the server
    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/data/text?filename=notes_one.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContent(data.content);
        } catch (e) {
            setError(e.message);
            console.error("Fetching content failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to save the content to the server
    const saveContent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/data/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: 'notes_one.txt', content: content }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // You might want to handle the response from the server if needed
        } catch (e) {
            setError(e.message);
            console.error("Saving content failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle the textarea change
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // Fetch the content when the component mounts
    useEffect(() => {
        fetchContent();
    }, []);

    return (
        <>
            <div className="services">
                <h1 className='services-text'>NOTES</h1>
                <textarea
                    className='services-text-editor'
                    value={content}
                    onChange={handleContentChange}
                    disabled={isLoading}
                />
                {isLoading && <p>Loading...</p>}
                {error && <p className="services-error">{error}</p>}
                <button 
                    className='services-save-button'
                    onClick={saveContent}
                    disabled={isLoading}
                >
                    Save
                </button>
            </div>
        </>
    );
}
