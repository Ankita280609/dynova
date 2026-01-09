import React from 'react';
import useIntersectionObserver from './useIntersectionObserver';

function TimelineItem({ number, tagColor, tagText, title, text, align }) {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
    const animationClass = align === 'left' ? 'timeline-slide-in-left' : 'timeline-slide-in-right';

    return (
        <div
            ref={ref}
            className={`timeline-item ${align === 'left' ? 'align-left' : 'align-right'} ${isVisible ? 'is-visible' : ''}`}
        >
            <div className="timeline-number-wrapper">
                <div className="timeline-number">{number}</div>
            </div>
            <div className={`timeline-item-content ${animationClass}`}>
                <span className="timeline-tag" style={{ backgroundColor: tagColor }}>{tagText}</span>
                <h3 className="timeline-title">{title}</h3>
                <p className="timeline-text">
                    <strong>{text}</strong>
                </p>
            </div>
        </div>
    );
}

export default function Timeline() {
    return (
        <section id="why-us" className="timeline-section">
            <div className="container">
                <h2 className="timeline-main-title">WHY US?</h2>
                <div className="timeline-container">
                    <div className="timeline-central-line"></div>

                    <TimelineItem
                        number="1"
                        tagColor="#B292F2"
                        tagText="Real-Time"
                        title="Real-Time Analytics, Not Just Responses"
                        align="left"
                        text="Watch your data come alive. Every submission instantly updates graphs, charts, and insights—so you never wait to understand what’s happening."
                    />

                    <TimelineItem
                        number="2"
                        tagColor="#FF7E67"
                        tagText="Advanced"
                        title="Advanced Question Types"
                        align="right"
                        text="From drag-and-drop sorting to scratch-to-reveal, digital signatures, code editors, and image annotations. Features you won't find anywhere else."
                    />

                    <TimelineItem
                        number="3"
                        tagColor="#6AAA64"
                        tagText="Adaptive"
                        title="Smart, Adaptive Forms Powered by Logic"
                        align="left"
                        text="Show or hide questions automatically based on user inputs. Deliver personalized, dynamic forms that feel intelligent and intuitive."
                    />

                    <TimelineItem
                        number="4"
                        tagColor="#8A4FFF"
                        tagText="AI-Powered"
                        title="AI-Powered Insights & Summaries"
                        align="right"
                        text="No more manually analyzing long responses. Our AI highlights trends, patterns, sentiments, and gives you instant summaries for quick decision-making."
                    />

                    <TimelineItem
                        number="5"
                        tagColor="#FFBB28"
                        tagText="Versatile"
                        title="Built for Creators, Teams & Businesses"
                        align="left"
                        text="Simple to use, yet powerful enough for complex workflows. Create forms in minutes, share anywhere, collaborate effortlessly, and export analytics seamlessly."
                    />
                </div>
            </div>
        </section>
    );
}
