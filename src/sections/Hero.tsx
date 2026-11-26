import { Can } from '../components/can/Can';
import { LABEL_SHIFT } from '../data/can';
import { CanSlot } from '../components/can/CanSlot';
import { Button } from '../components/ui/Button';
import { SocialLinks } from '../components/ui/SocialLinks';
import { featuredProduct } from '../data/products';
import { heroCopy } from '../data/site';

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate h-svh min-h-[34rem] overflow-hidden short:min-h-0"
    >
      {/* Zero-height centre line shared by the headline and the can, so the can always
          crosses the middle of the word whatever the viewport height. */}
      <div className="absolute inset-x-0 top-[40%] h-0 sm:top-[44.4%]">
        {/* mt = optical centre of the caps (line box centre sits above the ink).
            The inner span is what GSAP animates — the h1 only positions. */}
        <h1
          id="hero-title"
          className="absolute inset-x-0 top-0 mt-[0.09em] -translate-y-1/2 text-center font-display text-[clamp(4.5rem,min(29.6vw,52svh),36rem)] leading-[0.8] tracking-[-0.03em]"
        >
          {/* pr offsets the trailing negative letter-spacing so the ink is centred. */}
          <span data-anim="hero-title" className="text-gradient-headline block pr-[0.03em]">
            Nitro
          </span>
        </h1>

        <CanSlot step="hero" className="top-0 z-10">
          <Can label={featuredProduct.label} labelShift={LABEL_SHIFT.hero} />
        </CanSlot>
      </div>

      <div
        data-anim="hero-bottom"
        className="absolute inset-x-gutter bottom-[max(1.5rem,6svh)] z-20 grid items-center gap-5 sm:grid-cols-2 sm:gap-y-8 lg:bottom-[14svh] lg:grid-cols-[1fr_auto_1fr] short:bottom-4"
      >
        <p className="max-w-[29rem] text-sm leading-normal uppercase sm:text-base short:hidden">
          {heroCopy}
        </p>

        <div className="flex flex-col gap-3 sm:col-span-2 sm:row-start-2 sm:flex-row sm:justify-center sm:gap-8 lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <Button href="#products" variant="light">
            Buy Now
          </Button>
          <Button href="#story" variant="outline">
            More info
          </Button>
        </div>

        <SocialLinks className="hidden justify-self-end sm:col-start-2 sm:row-start-1 sm:flex lg:col-start-3 short:hidden" />
      </div>
    </section>
  );
}
