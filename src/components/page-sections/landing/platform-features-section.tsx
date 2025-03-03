"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

/* ~ ======= Dynamic import of Globe component ======= ~ */
const World = dynamic(() => import("../../ui/globe").then((m) => m.World), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

/* ~ ======= Loading and Error components ======= ~ */
function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white"></div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-red-600">Globe visualization unavailable</p>
      </div>
    </div>
  );
}

/* ~ =================================== ~ */
/* -- Platform features section component -- */
/* ~ =================================== ~ */
export default function PlatformFeaturesSection() {
  const [hasError, setHasError] = React.useState(false);
  const { resolvedTheme } = useTheme();

  /* ~ ======= Theme-aware colors and arcs ======= ~ */
  const colors = React.useMemo(
    () => [
      resolvedTheme === "dark" ? "#E65D0F" : "#010156",
      resolvedTheme === "dark" ? "#010156" : "#E65D0F",
      "#E09D68",
    ],
    [resolvedTheme],
  );

  const sampleArcs = React.useMemo(
    () => [
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 1,
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -1.303396,
        endLng: 36.852443,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 2,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 2,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 2,
        startLat: -15.785493,
        startLng: -47.909029,
        endLat: 36.162809,
        endLng: -115.119411,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 3,
        startLat: -33.8688,
        startLng: 151.2093,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 3,
        startLat: 21.3099,
        startLng: -157.8581,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 3,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 4,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 4,
        startLat: -34.6037,
        startLng: -58.3816,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.7,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 4,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 5,
        startLat: 14.5995,
        startLng: 120.9842,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 5,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 5,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 6,
        startLat: -15.432563,
        startLng: 28.315853,
        endLat: 1.094136,
        endLng: -63.34546,
        arcAlt: 0.7,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 6,
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 6,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 7,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 7,
        startLat: 48.8566,
        startLng: -2.3522,
        endLat: 52.52,
        endLng: 13.405,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 7,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 8,
        startLat: -8.833221,
        startLng: 13.264837,
        endLat: -33.936138,
        endLng: 18.436529,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 8,
        startLat: 49.2827,
        startLng: -123.1207,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 8,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 9,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 9,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.7,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 9,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 10,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: 28.6139,
        endLng: 77.209,
        arcAlt: 0.7,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 10,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 10,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 11,
        startLat: 41.9028,
        startLng: 12.4964,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 11,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 11,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 1.3521,
        endLng: 103.8198,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 12,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 37.7749,
        endLng: -122.4194,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 12,
        startLat: 35.6762,
        startLng: 139.6503,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 12,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 13,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 13,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 13,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
      {
        order: 14,
        startLat: -33.936138,
        startLng: 18.436529,
        endLat: 21.395643,
        endLng: 39.883798,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * (colors.length - 1))],
      },
    ],
    [colors],
  );

  /* ~ ======= Theme-aware globe configuration ======= ~ */
  const wireframeGlobeConfig = React.useMemo(
    () => ({
      pointSize: 2,
      globeColor: resolvedTheme === "dark" ? "#E65D0F" : "#010156",
      showAtmosphere: true,
      atmosphereColor: "#FFFFFF",
      atmosphereAltitude: 0.1,
      emissive: resolvedTheme === "dark" ? "#E65D0F" : "#010156",
      emissiveIntensity: 0.1,
      shininess: 1,
      polygonColor: "rgba(255,255,255,0.8)",
      ambientLight: "#38bdf8",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 0, lng: 0 },
      autoRotate: true,
      autoRotateSpeed: 0.15,
      enableZoom: false,
      enablePanning: false,
      enableRotate: false,
      wireframe: true,
      hexPolygonsData: [],
      hexPolygonResolution: 3,
      hexPolygonMargin: 0.7,
      hexPolygonColor: () => "rgba(255,255,255,0.7)",
    }),
    [resolvedTheme],
  );

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -bottom-80 -right-52 z-0 h-[50rem] w-[50rem] select-none opacity-30"
        style={{
          pointerEvents: "none",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <ErrorBoundary onError={() => setHasError(true)}>
          <World
            key={resolvedTheme}
            data={sampleArcs}
            globeConfig={wireframeGlobeConfig}
          />
        </ErrorBoundary>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5"
        >
          {/* ~ ======= Left column content with background globe ======= ~ */}
          <motion.div variants={itemVariants} className="relative col-span-2">
            {/* ~ ======= Background Globe ======= ~ */}

            {/* ~ ======= Content ======= ~ */}
            <div className="relative z-10">
              <motion.p
                variants={itemVariants}
                className="text-xs font-medium uppercase tracking-wide text-secondary dark:text-accent"
              >
                Everything you need to
              </motion.p>
              <motion.h2
                variants={itemVariants}
                className="mt-2 text-4xl font-bold tracking-normal text-foreground sm:text-5xl"
              >
                Get{" "}
                <span className="text-primary dark:text-secondary">
                  Connected
                </span>
                <br />
                Feel&nbsp;
                <span className="text-primary dark:text-secondary">
                  Connected
                </span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-6 text-base text-muted-foreground"
              >
                Our comprehensive VoIP solution combines advanced features with
                user-friendly design, providing everything you need for seamless
                business communication.
              </motion.p>
            </div>
          </motion.div>

          {/* ~ ======= Features grid ======= ~ */}
          <motion.dl
            variants={containerVariants}
            className="col-span-3 grid grid-cols-1 gap-x-8 gap-y-10 text-base sm:grid-cols-2 lg:gap-y-16"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                variants={itemVariants}
                className="relative pl-9"
              >
                <dt className="font-semibold text-foreground">
                  <Check
                    className="absolute left-0 top-1 h-5 w-5 text-primary dark:text-secondary"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-2 text-muted-foreground">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}

/* ~ ======= Error Boundary Component ======= ~ */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

/* ~ =================================== ~ */
/* -- Features data for VoIP platform -- */
/* ~ =================================== ~ */
const features = [
  {
    name: "Advanced Call Management",
    description:
      "Comprehensive call routing, queuing, and handling features for enterprise needs.",
  },
  {
    name: "HD Voice Quality",
    description:
      "Crystal clear audio with advanced codecs and quality of service optimization.",
  },
  {
    name: "Multi-Device Support",
    description:
      "Seamlessly switch between desk phones, softphones, and mobile devices.",
  },
  {
    name: "Real-time Analytics",
    description:
      "Detailed call metrics, usage patterns, and performance analytics.",
  },
  {
    name: "Security & Encryption",
    description:
      "Enterprise-grade security with TLS/SRTP encryption for all communications.",
  },
  {
    name: "Auto-Provisioning",
    description:
      "Zero-touch device provisioning and automatic configuration updates.",
  },
  {
    name: "CRM Integration",
    description:
      "Native integration with popular CRM platforms for enhanced workflow.",
  },
  {
    name: "Scalable Architecture",
    description:
      "Easily scale your VoIP system as your business grows and evolves.",
  },
];

/* ~ =================================== ~ */
/* -- Animation variants -- */
/* ~ =================================== ~ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
