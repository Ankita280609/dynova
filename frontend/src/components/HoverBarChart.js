import React from 'react';
import useIntersectionObserver from './useIntersectionObserver';

export default function HoverBarChart() {
    const [sectionRef, isVisible] = useIntersectionObserver();

    return (
        <section ref={sectionRef} className={`hover-bar-chart-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="container">
                <h2>Analyze Your Audience</h2>
                <p>See what your users love.</p>
                <div className="hover-chart-wrapper">
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-1"></div>
                    </div>
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-2"></div>
                    </div>
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-3"></div>
                    </div>
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-4"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
