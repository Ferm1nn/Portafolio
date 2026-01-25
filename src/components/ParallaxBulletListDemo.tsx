import { ParallaxBulletList } from './ParallaxBulletList';
import { Section } from './Section';

export function ParallaxBulletListDemo() {
    const exampleItems = [
        "Optimized with hardware acceleration (translate3d)",
        "Respects prefers-reduced-motion settings",
        "Reverses animation when scrolling out of view",
        "Uses efficient single-timeline GSAP implementation",
        "Accessible and performant by default"
    ];

    return (
        <Section
            id="parallax-demo"
            eyebrow="Component Demo"
            title="Parallax Bullet List"
            description="Scroll down to see the reveal effect. Scroll past to see it reverse."
        >
            <div style={{ padding: '2rem 0' }}>
                <ParallaxBulletList items={exampleItems} />
            </div>
        </Section>
    );
}
