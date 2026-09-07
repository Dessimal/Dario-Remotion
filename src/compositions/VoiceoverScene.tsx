import { AbsoluteFill, Audio, staticFile, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';
import { ShieldAlert, Eye, Crosshair, FileWarning, Snowflake, Building2, Ban, Lock, Swords, TrendingUp, Sparkles, LucideIcon } from 'lucide-react';
import transcriptData from '../assets/transcript.json';
import { PersonCutout } from '../components/PersonCutout';
import { KineticTypography } from '../components/KineticTypography';

const ICON_MAP: Record<string, LucideIcon> = {
  'shield-alert': ShieldAlert, 'eye': Eye, 'crosshair': Crosshair, 'file-warning': FileWarning,
  'snowflake': Snowflake, 'building-2': Building2, 'ban': Ban, 'lock': Lock, 'swords': Swords,
  'trending-up': TrendingUp, 'sparkles': Sparkles,
};

// Types
interface Segment {
  id: string;
  start: number;
  end: number;
  text: string;
  visual_type: string;
  asset_theme: string;
  highlight_words: string[];
  icon?: string;
  metric?: { start_val: number; end_val: number; prefix?: string };
}

// Upgraded Theme Configuration aligned with moodboard.png
const THEME_CONFIG = {
  monopoly: { 
    bgColor: '#13002E', 
    accentColor: '#D946EF', 
    textColor: '#FFFFFF', 
    secondaryColor: '#06B6D4',
    bgGradient: 'radial-gradient(circle at 50% 50%, #3B0764 0%, #13002E 100%)'
  },
  outrage: { 
    bgColor: '#090014', 
    accentColor: '#FF0055', 
    highlightColor: '#00F0FF', 
    textColor: '#FFFFFF',
    bgGradient: 'radial-gradient(circle at 30% 70%, #4C0519 0%, #090014 100%)'
  },
  underdog: { 
    bgColor: '#020617', 
    accentColor: '#38BDF8', 
    neutralColor: '#94A3B8', 
    textColor: '#FFFFFF',
    bgGradient: 'radial-gradient(circle at 70% 30%, #0F172A 0%, #020617 100%)'
  },
  vox: { 
    bgColor: '#E2DFD8', 
    accentColor: '#111111', 
    highlightColor: '#FFE600', 
    secondaryBg: '#ECE8DF', 
    blueAccent: '#2563EB',
    bgGradient: 'none'
  },
};

// Smooth Spring Profiles
const SPRINGS = {
  pop: { mass: 0.3, stiffness: 180, damping: 14 },
  smoothGraph: { mass: 0.8, stiffness: 45, damping: 18 },
  drift: { mass: 1.5, stiffness: 15, damping: 22 },
  rostrum: { mass: 2.0, stiffness: 10, damping: 30 },
};

const IconPopIn: React.FC<{ iconName: string; accentColor?: string }> = ({ iconName, accentColor = '#D946EF' }) => {
  const frame = useCurrentFrame();
  const Icon = ICON_MAP[iconName] || Sparkles;
  const popSpring = spring({ frame, fps: 30, config: SPRINGS.pop });
  const scale = interpolate(popSpring, [0, 1], [0, 1]);
  return (
    <div style={{ transform: `scale(${scale})`, marginBottom: '20px' }}>
      <Icon size={80} color={accentColor} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 15px ${accentColor})` }} />
    </div>
  );
};

const PaperTextureOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const randomX = (step * 17) % 12 - 6;
  const randomY = (step * 23) % 12 - 6;
  const randomRotation = (step * 90) % 360;

  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      opacity: 0.1,
      zIndex: 99,
      transform: `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
  );
};

const SegmentCameraWrapper: React.FC<{
  segment: Segment;
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ segment, durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const driftSpring = spring({ frame, fps, config: SPRINGS.drift });
  const rostrumSpring = spring({ frame, fps, config: SPRINGS.rostrum });

  let zoom = 1.0;
  let translateX = 0;
  let translateY = 0;
  let perspective = 0;
  let rotateX = 0;
  let rotateY = 0;

  switch (segment.visual_type) {
    case 'paper_document':
      perspective = 1200;
      rotateX = interpolate(rostrumSpring, [0, 1], [15, 8]);
      rotateY = interpolate(rostrumSpring, [0, 1], [-12, -4]);
      zoom = interpolate(rostrumSpring, [0, 1], [1.02, 1.12]);
      translateX = interpolate(rostrumSpring, [0, 1], [-20, 15]);
      translateY = interpolate(rostrumSpring, [0, 1], [20, -10]);
      break;
    case 'map_route':
      zoom = interpolate(driftSpring, [0, 1], [1.02, 1.10]);
      translateX = interpolate(driftSpring, [0, 1], [-30, 30]);
      translateY = interpolate(driftSpring, [0, 1], [15, -15]);
      break;
    default:
      zoom = interpolate(driftSpring, [0, 1], [1.0, 1.05]);
      translateX = interpolate(driftSpring, [0, 1], [-15, 15]);
      break;
  }

  return (
    <AbsoluteFill
      style={{
        perspective: perspective ? `${perspective}px` : undefined,
        transform: perspective 
          ? `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom}) translate(${translateX}px, ${translateY}px)`
          : `scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const VoiceoverScene: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#090014', overflow: 'hidden' }}>
      <Audio src={staticFile("voiceover.wav")} />
      <PaperTextureOverlay />
      
      {segments.map((segment) => {
        const from = Math.round(segment.start * 30);
        const duration = Math.max(1, Math.round((segment.end - segment.start) * 30));
        const theme = segment.visual_type === 'paper_document' || segment.visual_type === 'map_route' 
          ? THEME_CONFIG.vox 
          : (THEME_CONFIG[segment.asset_theme as keyof typeof THEME_CONFIG] || THEME_CONFIG.monopoly);

        return (
          <Sequence key={segment.id} from={from} durationInFrames={duration}>
            <SegmentContainer durationInFrames={duration} theme={theme}>
              <SegmentCameraWrapper segment={segment} durationInFrames={duration}>
                {renderVisual(segment, theme)}
              </SegmentCameraWrapper>
              
              {/* Vignette */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
                pointerEvents: 'none'
              }} />
            </SegmentContainer>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const renderVisual = (segment: Segment, theme: any) => {
  switch (segment.visual_type) {
    case 'graph_counter': return <GraphAndNumberVisual {...segment} theme={theme} />;
    case 'kinetic_text': return <KineticTypography sentence={segment.text} startFrame={10} highlightWords={segment.highlight_words} highlightColor={theme.highlightColor || theme.accentColor} />;
    case 'paper_document': return <PaperDocumentVisual {...segment} theme={theme} />;
    case 'map_route': return <MapRouteVisual {...segment} theme={theme} />;
    case 'person_cutout': return <PersonCutout imageSrc={staticFile("cutouts/dario.png")} nameLabel="Dario Amodei" title="CEO, Anthropic" accentColor={theme.accentColor} />;
    default: return <div style={{ color: '#fff' }}>{segment.text}</div>;
  }
};

const SegmentContainer: React.FC<{ durationInFrames: number; theme: any, children: React.ReactNode }> = ({ durationInFrames, theme, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ 
      opacity, 
      backgroundColor: theme.bgColor || theme.secondaryBg, 
      background: theme.bgGradient || theme.bgColor,
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      {children}
    </AbsoluteFill>
  );
};

// Vox Editorial Document Styling
const PaperDocumentVisual: React.FC<Segment & { theme: any }> = ({ text, highlight_words }) => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        backgroundImage: 'radial-gradient(#111111 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }} />

      <div style={{
        width: '780px',
        height: '920px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 30px 80px rgba(0,0,0,0.35)',
        border: '1px solid rgba(0,0,0,0.08)',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '2px'
      }}>
        <div style={{ fontSize: '13px', fontFamily: '"JetBrains Mono", monospace', opacity: 0.5, marginBottom: '24px', letterSpacing: '2px', color: '#E11D48', fontWeight: 600 }}>
          ARTICLE ARCHIVE // EDITORIAL CALLOUT
        </div>
        <div style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '38px', 
          lineHeight: '1.35', 
          color: '#0F172A',
          fontWeight: 700 
        }}>
          {text.split(' ').map((word, i) => {
            const isHighlighted = highlight_words?.some(h => word.toLowerCase().includes(h.toLowerCase()));
            return (
              <span key={i} style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                {isHighlighted && (
                  <span style={{
                    position: 'absolute',
                    left: '-2px',
                    bottom: '2px',
                    height: '45%',
                    width: '104%',
                    backgroundColor: '#FFE600',
                    zIndex: 0,
                    transform: 'skewX(-6deg)',
                  }} />
                )}
                <span style={{ relative: 'relative', zIndex: 1 }}>{word}</span>
              </span>
            );
          })}
        </div>
        <div style={{ flex: 1, marginTop: '36px', borderTop: '2px solid #F1F5F9', paddingTop: '20px' }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ height: '10px', background: '#F8FAFC', width: `${(i % 3 === 0 ? 50 : 85)}%`, marginBottom: '14px' }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MapRouteVisual: React.FC<Segment & { theme: any }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const routeProgress = spring({ frame, fps, config: { mass: 0.8, stiffness: 60, damping: 20 } });
  const drawOffset = interpolate(routeProgress, [0, 1], [1000, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
       <div style={{
         position: 'absolute',
         inset: 0,
         backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b")',
         backgroundSize: 'cover',
         filter: 'contrast(1.15) brightness(0.85) grayscale(0.2)',
         opacity: 0.65
       }} />

       <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', zIndex: 10 }}>
         <path
           d="M 450 700 Q 900 400 1350 350"
           fill="none"
           stroke="#FFE600"
           strokeWidth="8"
           strokeDasharray="16,16"
           strokeDashoffset={drawOffset}
           strokeLinecap="round"
         />
         <circle cx="450" cy="700" r="16" fill="#111111" stroke="#FFFFFF" strokeWidth="4" />
         <circle cx="1350" cy="350" r="16" fill="#FFE600" stroke="#111111" strokeWidth="4" />
         
         {routeProgress > 0.85 && (
            <circle
              cx="1350" cy="350"
              r={interpolate(frame % 30, [0, 29], [16, 55])}
              fill="none"
              stroke="#FFE600"
              strokeWidth={interpolate(frame % 30, [0, 29], [5, 0])}
              style={{ opacity: interpolate(frame % 30, [0, 29], [1, 0]) }}
            />
         )}
       </svg>
    </AbsoluteFill>
  );
};

// Smooth Graph Animation matching moodboard.png
const GraphAndNumberVisual: React.FC<Segment & { theme: any }> = ({ metric, theme, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Graph Path Animation Progress using low-stiffness spring
  const graphProgress = spring({ frame: frame - 5, fps, config: SPRINGS.smoothGraph });
  const drawProgress = interpolate(graphProgress, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Counter Spring
  const counterSpring = spring({ frame, fps, config: SPRINGS.pop });
  const rawValue = metric ? interpolate(counterSpring, [0, 1], [metric.start_val, metric.end_val]) : 0;

  // Glassmorphic Badge Pill Entrance
  const pillSpring = spring({ frame: frame - 2, fps, config: SPRINGS.pop });
  const pillY = interpolate(pillSpring, [0, 1], [-20, 0]);
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1]);

  // Smooth Sine Curve Points
  const pathD = "M 0 280 C 200 280, 250 80, 450 80 C 650 80, 700 360, 900 360 C 1100 360, 1150 160, 1300 160";
  const pathLength = 1600;
  const strokeDashoffset = interpolate(drawProgress, [0, 1], [pathLength, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      
      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accentColor}33 0%, transparent 70%)`,
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      {/* Top Glassmorphism Pill Tag */}
      <div style={{
        transform: `translateY(${pillY}px)`,
        opacity: pillOpacity,
        marginBottom: '28px',
        padding: '10px 28px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `0 0 20px ${theme.accentColor}40`,
        backdropFilter: 'blur(12px)',
        zIndex: 10
      }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>
          Performance Growth Rate
        </span>
      </div>

      {/* Main Counter Display */}
      {metric && (
        <div style={{ 
          fontSize: '110px', 
          color: '#FFFFFF', 
          fontWeight: 900,
          fontFamily: 'Montserrat, sans-serif',
          textShadow: `0 0 40px ${theme.accentColor}80`,
          letterSpacing: '-2px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {icon && <IconPopIn iconName={icon} accentColor={theme.accentColor} />}
          <span>{metric.prefix}{Math.floor(rawValue).toLocaleString()}</span>
        </div>
      )}

      {/* Smooth Animated Graph Surface */}
      <div style={{ position: 'relative', width: '1300px', height: '420px', marginTop: '10px' }}>
        <svg width="1300" height="420" viewBox="0 0 1300 420" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#FFE600" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.accentColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={theme.accentColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Axis Line */}
          <line x1="0" y1="220" x2="1300" y2="220" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="2" strokeDasharray="8 8" />

          {/* Filled Area Under Graph */}
          <path
            d={`${pathD} L 1300 420 L 0 420 Z`}
            fill="url(#areaGradient)"
            style={{ opacity: interpolate(drawProgress, [0, 0.2], [0, 1]) }}
          />

          {/* Glowing Animated Graph Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#glowGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 12px ${theme.accentColor})` }}
          />

          {/* Leading Animated Node Dot */}
          {drawProgress > 0.02 && (
            <circle
              cx={interpolate(drawProgress, [0, 0.35, 0.7, 1], [0, 450, 900, 1300])}
              cy={interpolate(drawProgress, [0, 0.35, 0.7, 1], [280, 80, 360, 160])}
              r="12"
              fill="#FFFFFF"
              stroke={theme.accentColor}
              strokeWidth="4"
              style={{ filter: `drop-shadow(0 0 15px #FFFFFF)` }}
            />
          )}
        </svg>
      </div>
    </AbsoluteFill>
  );
};