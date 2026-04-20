// Shared Framer Motion mock — prevents "unknown prop" React warnings in jsdom
// by stripping out motion-specific props before forwarding to DOM elements.
import React from 'react';

const stripMotionProps = <T extends object>(props: T) => {
    const { whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, ...rest } =
        props as Record<string, unknown>;
    void whileHover; void whileTap; void whileInView; void initial;
    void animate; void exit; void transition; void variants;
    return rest;
};

export const motion = {
    div: React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => (
        <div ref={ref} {...stripMotionProps(props)}>{children}</div>
    )),
    span: React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & Record<string, unknown>, ref: React.Ref<HTMLSpanElement>) => (
        <span ref={ref} {...stripMotionProps(props)}>{children}</span>
    )),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
