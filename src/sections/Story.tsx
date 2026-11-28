import storyPhoto from '../assets/images/story-photo.png?format=webp';
import { Can } from '../components/can/Can';
import { LABEL_SHIFT } from '../data/can';
import { CanSlot } from '../components/can/CanSlot';
import { featuredProduct } from '../data/products';

/** Visual line breaks of the headline (mirrors the design's broken word). */
const headlineLines = ['Since', '2002', 'prod', 'ucing'];

export function Story() {
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="relative flex h-svh min-h-[36rem] flex-col gap-6 px-gutter pt-[calc(var(--spacing-nav)+4.5rem)] pb-8 sm:flex-row-reverse sm:items-center sm:gap-[4vw] sm:pt-[calc(var(--spacing-nav)+2.75rem)] sm:pb-6 lg:block lg:px-0 short:min-h-0"
    >
      {/* h2 positions; the visual span is what GSAP animates (keep transforms apart). */}
      <h2
        id="story-title"
        className="relative z-20 font-display text-[clamp(3.5rem,16vw,6rem)] leading-[0.93] tracking-[-0.03em] text-accent sm:shrink-0 sm:text-[clamp(2.5rem,min(10vw,15svh),6.5rem)] lg:absolute lg:top-1/2 lg:left-[65.5%] lg:-translate-y-[calc(50%-0.14em)] lg:text-[9.64vw]"
      >
        <span className="sr-only">Since 2002 producing</span>
        <span aria-hidden data-anim="story-title" className="block">
          {headlineLines.map((line) => (
            <span key={line} data-anim="story-line" className="block">
              {line}
            </span>
          ))}
        </span>
      </h2>

      {/* `relative` below lg so the slot centres on the photo; on desktop the slot
          is positioned against the whole section instead. On phones the photo fills
          what the headline leaves, so the story step is one composed screen. */}
      <div className="relative min-h-0 flex-1 sm:flex-none lg:static">
        {/* Outer box positions (incl. a Tailwind translate); the inner one is what GSAP moves. */}
        <div className="h-full w-full sm:aspect-[884/920] sm:h-auto sm:w-[min(46vw,calc(78svh*0.961))] lg:absolute lg:top-[53%] lg:left-[3.3vw] lg:w-[min(46vw,calc(83.8svh*0.961))] lg:-translate-y-1/2">
          <div data-anim="story-photo" className="size-full overflow-hidden rounded-card">
            {/* Eager: in the pinned scene it sits in the viewport, only hidden. */}
            <img src={storyPhoto} alt="" decoding="async" className="size-full object-cover" />
          </div>
        </div>

        <CanSlot step="story" className="top-1/2 z-10 lg:top-[52%] lg:left-[49.8%]">
          <Can label={featuredProduct.label} labelShift={LABEL_SHIFT.story} />
        </CanSlot>
      </div>
    </section>
  );
}
