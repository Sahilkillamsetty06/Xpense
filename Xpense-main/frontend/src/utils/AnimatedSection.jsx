import React, { useRef, useEffect, useState } from 'react';
import 'animate.css';

const AnimatedSection = ({ children, transitionType }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false); // New state for animation

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimate(true); // Trigger animation when visible
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Reset animation after it completes
  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false); // Reset animation state
      }, 2000); // Adjust this duration to match your animation duration

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [animate]);

  return (
    <React.Fragment>
      {React.cloneElement(children, {
        ref: ref,
        className: `animate__animated ${animate ? transitionType : ''} ${children.props.className || ''}`
      })}
    </React.Fragment>
  );
};

export default AnimatedSection;
