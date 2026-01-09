import React, { useState, useEffect } from 'react';
import {
    ContactIcon, NumbersIcon, ChoicesIcon, TimeIcon, UploadIcon,
    InstructionIcon, IdentityIcon, LegalIcon, AdvancedIcon, LogicIcon,
    SearchIcon, ArrowLeftIcon
} from './Icons';

export default function AllFeaturesPage({ setCurrentPage }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('text-fields');

    const featureCategories = [
        {
            id: 'text-fields',
            title: 'Text & Contact Fields',
            icon: <ContactIcon />,
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
            icon: <NumbersIcon />,
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
            icon: <ChoicesIcon />,
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
            icon: <TimeIcon />,
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
            icon: <UploadIcon />,
            features: [
                { title: 'File Upload', desc: 'Allow users to attach documents.' },
                { title: 'Image Upload', desc: 'Specific field for photo uploads.' },
                { title: 'Audio / Video', desc: 'Record or upload rich media.' },
            ]
        },
        {
            id: 'instructional',
            title: 'Instructional Fields',
            icon: <InstructionIcon />,
            features: [
                { title: 'Description', desc: 'Paragraph text for explanations or help.' },
                { title: 'Embedded Media', desc: 'Show a video or audio clip in the question.' },
            ]
        },
        {
            id: 'identifiers',
            title: 'Identifiers',
            icon: <IdentityIcon />,
            features: [
                { title: 'Unique ID', desc: 'Sequential ID based on rules.' },
                { title: 'Random ID', desc: 'Auto-generated code for tracking.' },
            ]
        },
        {
            id: 'legal',
            title: 'Consent & Legal',
            icon: <LegalIcon />,
            features: [
                { title: 'Terms & Conditions', desc: 'Text block with mandatory checkbox.' },
                { title: 'Digital Signature', desc: 'Canvas field for e-signing forms.' },
                { title: 'Consent Checkbox', desc: 'Simple decision or approval box.' },
            ]
        },
        {
            id: 'advanced',
            title: 'Advanced & Gamified',
            icon: <AdvancedIcon />,
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
            icon: <LogicIcon />,
            features: [
                { title: 'Subform', desc: 'Repeatable grouped fields (Nested).' },
                { title: 'Conditional Logic', desc: 'Show/Hide fields based on answers.' },
                { title: 'Integration Field', desc: 'Pull data from CRM or Payments.' },
                { title: 'Dynamic Choice', desc: 'Populated options from data sources.' },
            ]
        }
    ];

    const filteredCategories = featureCategories.map(category => {
        const filteredFeatures = category.features.filter(feature =>
            feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feature.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...category, features: filteredFeatures };
    }).filter(category => category.features.length > 0);

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveCategory(id);
        }
    };

    return (
        <div className="all-features-page page-fade-in">
            <div className="features-hero">
                <div className="container">
                    <button onClick={() => setCurrentPage('home')} className="btn-back-minimal">
                        <ArrowLeftIcon /> Back to Home
                    </button>
                    <h1>Feature Toolkit</h1>
                    <p>Discover everything Dynova has to offer to build powerful, interactive forms.</p>

                    <div className="feature-search-wrapper">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Find a field or functionality..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="features-layout">
                    <aside className="features-nav-sidebar">
                        <div className="sticky-nav-content">
                            <h3>Categories</h3>
                            <nav>
                                <ul>
                                    {featureCategories.map(cat => (
                                        <li key={cat.id}>
                                            <button
                                                className={activeCategory === cat.id ? 'active' : ''}
                                                onClick={() => handleScrollTo(cat.id)}
                                            >
                                                <span className="nav-icon">{cat.icon}</span>
                                                <span className="nav-text">{cat.title}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>

                    <main className="features-sections-wrapper">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, catIdx) => (
                                <section key={category.id} id={category.id} className="feature-group-section">
                                    <div className="section-header">
                                        <div className="section-icon">{category.icon}</div>
                                        <h2>{category.title}</h2>
                                    </div>
                                    <div className="features-premium-grid">
                                        {category.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="feature-card-premium"
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            >
                                                <div className="card-dot"></div>
                                                <h3>{feature.title}</h3>
                                                <p>{feature.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="features-empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No features found</h3>
                                <p>We couldn't find anything matching "<strong>{searchTerm}</strong>".</p>
                                <button className="btn-clear-search" onClick={() => setSearchTerm('')}>Clear Search</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}