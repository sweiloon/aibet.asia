import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Buttons } from "@/components/Buttons";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { RefObject, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  animate,
  useMotionTemplate,
  useMotionValue,
  ValueAnimationTransition,
} from "framer-motion";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  {
    icon: "/vroom.lottie",
    title: "Emotion-Free Strategy",
    isNew: false,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: 150,
  },
  {
    icon: "/click.lottie",
    title: "Instant Game Deployment",
    isNew: true,
    backgroundPositionX: 98,
    backgroundPositionY: 100,
    backgroundSizeX: 135,
  },
  {
    icon: "/stars.lottie",
    title: "AI-Powered Betting Logic",
    isNew: false,
    backgroundPositionX: 100,
    backgroundPositionY: 27,
    backgroundSizeX: 177,
  },
];

const FeatureTab = (tab: (typeof tabs)[number]) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const xPercentage = useMotionValue(50);
  const yPercentage = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%,black,transparent)`;

  useEffect(() => {
    if (!tabRef.current) return;
    const { height, width } = tabRef.current.getBoundingClientRect();
    const circumference = height * 2 + width * 2;
    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ];
    const options: ValueAnimationTransition = {
      times,
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    };

    animate(xPercentage, [0, 100, 100, 0, 0], options);

    animate(yPercentage, [0, 0, 100, 100, 0], options);
  });

  return (
    <div
      ref={tabRef}
      className="relative flex items-center gap-2.5 rounded-xl border border-white/15 p-2.5 lg:flex-1"
    >
      <motion.div
        style={{
          maskImage,
        }}
        className="absolute inset-0 -m-px rounded-xl border border-[#A369FF]"
      ></motion.div>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/15">
        <DotLottiePlayer src={tab.icon} className="h-5 w-5" autoplay loop />
      </div>

      <div className="font-medium">{tab.title}</div>

      {tab.isNew && (
        <div className="rounded-full bg-[#8c44ff] px-2 py-0.5 text-xs font-semibold text-black">
          New
        </div>
      )}
    </div>
  );
};

const testimonials = [
  {
    text: "“AI全自动交易让我省去盯盘时间，收益稳步增长。最喜欢它的风险控制功能，睡觉也能安心！”",
    name: "Lee Ketty",
    avatarImg: "/avatar-1.png",
    title: "From Kuala Lumpur",
  },
  {
    text: "“退休人士最佳选择！自动化程度高，风险可控，不需专业知识也能获得稳定收益。值得信赖！”",
    name: "Jamie Chen",
    avatarImg: "/avatar-2.png",
    title: "From Johor Bahru",
  },
  {
    text: "“从未想过投资可以这么轻松。AI系统24小时工作，抓住了我睡觉时的多个交易机会”",
    name: "Adam Liu",
    avatarImg: "/avatar-3.png",
    title: "From Selangor, KL",
  },
  {
    text: "“试用一周立即升级了会员, 智能全自动交易， 短短三个月让我把之前亏损的都赚回来了！”",
    name: "Alec Gan",
    avatarImg: "/avatar-4.png",
    title: "From Pahang",
  },
];

const useRelativeMouseposition = (to: RefObject<HTMLElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition = (event: MouseEvent) => {
    if (!to.current) return;
    const { top, left } = to.current.getBoundingClientRect();
    mouseX.set(event.x - left);
    mouseY.set(event.y - top);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  });

  return [mouseX, mouseY];
};

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  {
    /* Hero section */
  }
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300]
  );
  const borderedDivRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const [mouseX, mouseY] = useRelativeMouseposition(borderedDivRef);

  const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      {/* Hero section */}
      <motion.section
        ref={sectionRef}
        className="relative flex h-[492px] items-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] md:h-[800px]"
        style={{ backgroundImage: `url(/stars.png)`, backgroundPositionY }}
        animate={{
          backgroundPositionX: "100%",
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 60,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)]"></div>
        {/*Start Planet */}
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-purple-500 bg-[radial-gradient(50%_50%_at_16.8%_18.3%,white,rgb(184,148,255)_37.7%,rgb(24,0,66))] shadow-[-20px_-20px_50px_rgb(255,255,255,.5),-20px_-20px_80px_rgb(255,255,255,.1),0_0__50px_rgb(140,69,255)] md:h-96 md:w-96"></div>
        {/*End Planet */}
        {/*Start Ring 1*/}
        <motion.div
          style={{
            translateY: "-50%",
            translateX: "-50%",
          }}
          animate={{
            rotate: "1turn",
          }}
          transition={{
            repeat: Infinity,
            duration: 50,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-[344px] w-[344px] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-20 md:h-[580px] md:w-[580px]"
        >
          <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
          <div className="absolute left-full top-1/2 inline-flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </motion.div>
        {/*End Ring 1*/}
        {/*Start Ring 2*/}
        <motion.div
          style={{
            translateY: "-50%",
            translateX: "-50%",
          }}
          animate={{
            rotate: "-1turn",
          }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-[444px] w-[444px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20 md:h-[780px] md:w-[780px]"
        ></motion.div>
        {/*End Ring 2*/}
        {/*Start Ring 3*/}
        <motion.div
          style={{
            translateY: "-50%",
            translateX: "-50%",
          }}
          animate={{
            rotate: "-1turn",
          }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-[544px] w-[544px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white opacity-20 md:h-[980px] md:w-[980px]"
        >
          <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
          <div className="absolute left-full top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
        </motion.div>
        {/*End Ring 3*/}
        <div className="container relative mt-16">
          <h1 className="bg-white bg-[radial-gradient(100%_100%_at_top_left,white,white,rgb(74,32,138,.5))] bg-clip-text py-8 text-center text-6xl font-semibold tracking-tighter text-transparent md:text-[118px] md:leading-none">
            AI Baccarat
          </h1>
          <div className="mx-auto mt-5 max-w-xl text-center">
            <h1 className="text-2xl text-white/70 md:text-2xl lg:text-3xl">
              全马首个AI百家乐智能操盘手
            </h1>
            <h2 className="mt-2 text-base text-white/50 md:text-sm lg:text-base">
              Step into the future of baccarat with AI precision. Let systems do
              the thinking while you focus on the results.
            </h2>
          </div>
          <div className="mt-8 flex justify-center">
            {!user && (
              <Buttons onClick={() => navigate("/signup")}>Join Now</Buttons>
            )}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <section id="features-section" className="py-20 md:py-24">
        <div className="container">
          <h2 className="text-center text-5xl font-medium tracking-tighter md:text-6xl">
            三赢策略 Triple Win Strategy
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg tracking-tight text-white/70 md:text-xl">
            Step into the future of baccarat with AI precision. Let systems do
            the thinking while you focus on the results.
          </p>
          <div className="mt-10 flex flex-col gap-3 lg:flex-row">
            {tabs.map((tab) => (
              <FeatureTab {...tab} key={tab.title} />
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-white/20 p-2.5">
            <LazyLoadImage src="/product-image-1.png" alt="Product Image" />
          </div>
          <div className="mt-3 rounded-xl border border-white/20 p-2.5">
            <LazyLoadImage src="/product-image-2.png" alt="Product Image" />
          </div>
          <div className="mt-3 rounded-xl border border-white/20 p-2.5">
            <LazyLoadImage src="/product-image-3.png" alt="Product Image" />
          </div>
          <div className="mt-3 rounded-xl border border-white/20 p-2.5">
            <LazyLoadImage src="/product-image-4.png" alt="Product Image" />
          </div>
          <div className="mt-3 rounded-xl border border-white/20 p-2.5">
            <LazyLoadImage src="/product-image-5.png" alt="Product Image" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials-section" className="py-20 md:py-24">
        <div className="container">
          <h2 className="text-center text-5xl font-medium tracking-tighter md:text-6xl">
            Beyond Expectations
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-center text-lg tracking-tight text-white/70 md:text-xl">
            超出预期的回报
          </p>
          <div className="mt-10 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              initial={{
                translateX: "-50%",
              }}
              animate={{
                translateX: "0",
              }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 30,
              }}
              className="flex flex-none gap-5 pr-5"
            >
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={testimonial.name + "-" + idx}
                  className="max-w-xs flex-none rounded-xl border border-white/15 bg-[linear-gradient(to_bottom_left,rgb(140,69,255,.3),black)] p-6 md:max-w-md md:p-10"
                >
                  <div className="text-lg tracking-tight md:text-2xl">
                    {testimonial.text}
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="relative before:absolute before:inset-0 before:z-10 before:rounded-lg before:border before:border-white/30 before:content-[''] after:absolute after:inset-0 after:mix-blend-soft-light after:content-['']">
                      <LazyLoadImage
                        src={testimonial.avatarImg}
                        alt={`Avatar for ${testimonial.name}`}
                        className="h-11 w-11 rounded-lg border border-white/30"
                      />
                    </div>
                    <div className="">
                      <div>{testimonial.name}</div>
                      <div className="text-sm text-white/50">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call To Action  */}
      <section id="cta-section" className="py-20 md:py-24" ref={sectionRef}>
        <div className="container">
          <motion.div
            ref={borderedDivRef}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative overflow-hidden rounded-xl border border-white/25 py-24"
            style={{
              backgroundPositionY,
              backgroundImage: `url(/grid-lines.png)`,
            }}
          >
            {/* Static background overlay that disappears on hover */}
            <div
              className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay transition duration-700 [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0"
              style={{
                backgroundImage: `url(/grid-lines.png)`,
              }}
            ></div>

            {/* Mouse-following overlay that appears on hover */}
            <motion.div
              className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay transition duration-700"
              style={{
                maskImage,
                backgroundImage: `url(/grid-lines.png)`,
                opacity: isHovering ? 1 : 0,
              }}
            ></motion.div>

            <div className="relative">
              <h2 className="mx-auto max-w-lg text-center text-4xl font-medium tracking-tighter md:text-5xl">
                AiBet is not just a platform
              </h2>
              <p className="mx-auto mt-5 max-w-sm px-4 text-center text-base tracking-tight text-white/70 md:text-xl">
                Step into the future of baccarat with AI precision. Let systems
                do the thinking while you focus on the results.
              </p>
              <div className="mt-5 flex justify-center">
                <Buttons>Get Started</Buttons>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-black border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Aibet</span>
                <span className="text-xs rounded-full px-2 bg-blue-500/30 text-blue-200">
                  CRM
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">AI Baccarat</p>
            </div>

            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Aibet. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
