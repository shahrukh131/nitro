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
      <h1
        id="hero-title"
        className="text-gradient-headline absolute inset-x-0 top-[40%] -translate-y-1/2 text-center font-display text-[clamp(4.5rem,min(31.5vw,56svh),38rem)] leading-[0.8] font-black tracking-[-0.03em] uppercase sm:top-[44.4%]"
      >
        Nitro
      </h1>

      <CanSlot step="hero" className="top-[40%] z-10 sm:top-[44.4%]">
        <Can label={featuredProduct.label} labelShift={LABEL_SHIFT.hero} />
      </CanSlot>

      <div className="absolute inset-x-gutter bottom-[max(1.5rem,6svh)] z-20 grid items-center gap-5 sm:grid-cols-2 sm:gap-y-8 lg:bottom-[14svh] lg:grid-cols-[1fr_auto_1fr] short:bottom-4">
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
