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
    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet, turpis vel bibendum dictum, purus enim ultrices mauris, nec sodales ante sem sit amet nunc. Vivamus nibh elit, faucibus at eros id, tincidunt laoreet augue. Mauris sagittis, turpis at dictum luctus, nibh nisl.";

    return (
        <section id="why-us" className="timeline-section">
            <div className="container">
                <h2 className="timeline-main-title">TIMELINE</h2>
                <div className="timeline-container">
                    <div className="timeline-central-line"></div>
                    <TimelineItem number="1" tagColor="#f5a623" tagText="Foundation" title="Our Project Kick-off" align="left" text={loremText} />
                    <TimelineItem number="2" tagColor="#d0021b" tagText="Development" title="Core Feature Build" align="right" text={loremText} />
                    <TimelineItem number="3" tagColor="#4a90e2" tagText="Launch" title="Initial Public Release" align="left" text={loremText} />
                    <TimelineItem number="4" tagColor="#7ed321" tagText="Expansion" title="Scaling and Growth" align="right" text={loremText} />
                    <TimelineItem number="5" tagColor="#A067E4" tagText="Future" title="Vision 2025" align="left" text={loremText} />
                </div>
            </div>
        </section>
    );
}
