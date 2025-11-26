import React, { useState, useEffect } from 'react';

export default function AllFeaturesPage({ setCurrentPage }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('text-fields');

    // --- THE DATA FROM YOUR SCREENSHOT ---
    const featureCategories = [
        {
            id: 'text-fields',
            title: 'Text & Contact Fields',
            features: [
                { title: 'Short Text', desc: 'Single-line input for names or titles.' },
                { title: 'Long Text', desc: 'Multi-line input for detailed responses.' },
                { title: 'Name', desc: 'Predefined fields for first and last names.' },
                { title: 'Email', desc: 'Built-in email validation logic.' },
                { title: 'Phone', desc: 'Numeric or masked phone number input.' },
                { title: 'Address', desc: 'Multi-line structured address fields.' },
                { title: 'Website / URL', desc: 'Link validation for web addresses.' },
            ]
        },
        {
            id: 'numbers',
            title: 'Numbers & Calculations',
            features: [
                { title: 'Number Field', desc: 'Accepts integer inputs only.' },
                { title: 'Decimal Field', desc: 'Allows fractional values.' },
                { title: 'Currency Field', desc: 'Inputs with currency symbols automatically.' },
                { title: 'Formula Field', desc: 'Auto-calculate results based on other inputs.' },
            ]
        },
        {
            id: 'choices',
            title: 'Choices & Selections',
            features: [
                { title: 'Single Select', desc: 'Radio buttons for one-choice answers.' },
                { title: 'Multi Select', desc: 'Checkboxes for multiple selections.' },
                { title: 'Dropdown Menu', desc: 'Compact single-choice list.' },
                { title: 'Image Choice', desc: 'Visual selection using images.' },
                { title: 'Emoji Rating', desc: 'Expressive rating scale with emojis.' },
                { title: 'Star Rating', desc: 'Traditional 1-5 star feedback scale.' },
                { title: 'Slider Scale', desc: 'Numeric selection via a sliding bar.' },
                { title: 'Matrix / Grid', desc: 'Structured choice tables for surveys.' },
            ]
        },
        {
            id: 'date-time',
            title: 'Date & Time',
            features: [
                { title: 'Date Picker', desc: 'Calendar interface for date selection.' },
                { title: 'Time Picker', desc: 'Clock interface for time selection.' },
                { title: 'Date & Time Combo', desc: 'Select both in a single field.' },
                { title: 'Month-Year Picker', desc: 'Ideal for credit cards or milestones.' },
            ]
        },
        {
            id: 'uploads',
            title: 'Uploads & Media',
            features: [
                { title: 'File Upload', desc: 'Allow users to attach documents.' },
                { title: 'Image Upload', desc: 'Specific field for photo uploads.' },
                { title: 'Audio / Video', desc: 'Record or upload rich media.' },
            ]
        },
        {
            id: 'instructional',
            title: 'Instructional Fields',
            features: [
                { title: 'Description', desc: 'Paragraph text for explanations or help.' },
                { title: 'Embedded Media', desc: 'Show a video or audio clip in the question.' },
            ]
        },
        {
            id: 'identifiers',
            title: 'Identifiers',
            features: [
                { title: 'Unique ID', desc: 'Sequential ID based on rules.' },
                { title: 'Random ID', desc: 'Auto-generated code for tracking.' },
            ]
        },
        {
            id: 'legal',
            title: 'Consent & Legal',
            features: [
                { title: 'Terms & Conditions', desc: 'Text block with mandatory checkbox.' },
                { title: 'Digital Signature', desc: 'Canvas field for e-signing forms.' },
                { title: 'Consent Checkbox', desc: 'Simple decision or approval box.' },
            ]
        },
        {
            id: 'advanced',
            title: 'Advanced & Gamified',
            features: [
                { title: 'Scratch-to-Reveal', desc: 'Uncover hidden text or prizes.' },
                { title: 'Timer-Based', desc: 'Countdown or time limits per question.' },
                { title: 'Drag & Drop Sort', desc: 'Order items by preference.' },
                { title: 'Match Following', desc: 'Pair items from two distinct lists.' },
            ]
        },
        {
            id: 'logic',
            title: 'Logic & Components',
            features: [
                { title: 'Subform', desc: 'Repeatable grouped fields (Nested).' },
                { title: 'Conditional Logic', desc: 'Show/Hide fields based on answers.' },
                { title: 'Integration Field', desc: 'Pull data from CRM or Payments.' },
                { title: 'Dynamic Choice', desc: 'Populated options from data sources.' },
            ]
        }
    ];

    // --- SEARCH LOGIC ---
    const filteredCategories = featureCategories.map(category => {
        const filteredFeatures = category.features.filter(feature => 
            feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feature.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...category, features: filteredFeatures };
    }).filter(category => category.features.length > 0);

    // --- SCROLL HANDLER ---
    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveCategory(id);
        }
    };

    return (
        <div className="all-features-page">
            <div className="container">
                
                {/* 1. HEADER & SEARCH */}
                <div className="features-header-section">
                    <button onClick={() => setCurrentPage('home')} className="btn btn-go-back">
                        ← Back to Home
                    </button>
                    <h1>All Features</h1>
                    <p>Explore the comprehensive toolkit that powers Dynova.</p>
                    
                    <div className="feature-search-bar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search for a feature (e.g., 'Signature', 'Logic')..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. LAYOUT: SIDEBAR + CONTENT */}
                <div className="features-layout">
                    
                    {/* SIDEBAR NAVIGATION */}
                    <aside className="features-sidebar">
                        <h3>Categories</h3>
                        <ul>
                            {featureCategories.map(cat => (
                                <li key={cat.id}>
                                    <button 
                                        className={activeCategory === cat.id ? 'active' : ''}
                                        onClick={() => handleScrollTo(cat.id)}
                                    >
                                        {cat.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* MAIN CONTENT GRID */}
                    <div className="features-content">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                                <section key={category.id} id={category.id} className="feature-category-section">
                                    <h2 className="category-title">{category.title}</h2>
                                    <div className="features-page-grid">
                                        {category.features.map((feature, index) => (
                                            <div key={index} className="feature-item">
                                                <h3>{feature.title}</h3>
                                                <p>{feature.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="no-results">
                                <h3>No features found matching "{searchTerm}"</h3>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}