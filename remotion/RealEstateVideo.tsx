import React from 'react';
import {
    AbsoluteFill,
    Img,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Sequence,
    Audio,
    staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

/**
 * REELSESTATE - PRODUCTION VIDEO TEMPLATE
 * =======================================
 * 31 Günlük Stil Sistemi Destekli
 * 
 * Features:
 * - Ken Burns efekti
 * - Blur background (mirror blur)
 * - Vignette
 * - Spring text animasyonları
 * - Google Fonts entegrasyonu
 * - Müzik desteği
 * - 31 farklı günlük stil
 */

// Font yükleme
const { fontFamily: playfair } = loadFont();
const { fontFamily: inter } = loadInter();

interface RealEstateVideoProps {
    photos?: string[];
    title?: string;
    location?: string;
    price?: string;
    musicUrl?: string;
    dayOfMonth?: number; // 1-31, stil için
    // Stil override'ları
    primaryColor?: string;
    secondaryColor?: string;
    transitionType?: 'fade' | 'zoom' | 'slide' | 'glitch' | 'ken-burns';
}


// Her fotoğraf için slide component
const PhotoSlide: React.FC<{
    photo: string;
    startFrame: number;
    durationInFrames: number;
}> = ({ photo, startFrame, durationInFrames }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const relativeFrame = frame - startFrame;

    // Ken Burns - yavaş zoom in
    const scale = interpolate(
        relativeFrame,
        [0, durationInFrames],
        [1, 1.1],
        { extrapolateRight: 'clamp' }
    );

    // Fade in/out
    const opacity = interpolate(
        relativeFrame,
        [0, 10, durationInFrames - 10, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{ opacity }}>
            {/* Blur background */}
            <AbsoluteFill
                style={{
                    filter: 'blur(50px) brightness(0.4) saturate(1.2)',
                    transform: 'scale(1.5)',
                }}
            >
                <Img
                    src={photo}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </AbsoluteFill>

            {/* Main image with Ken Burns */}
            <AbsoluteFill>
                <Img
                    src={photo}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${scale})`,
                    }}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const RealEstateVideo: React.FC<RealEstateVideoProps> = ({
    photos = [],
    title = 'Emlak İlanı',
    location,
    price,
    musicUrl,
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Her foto için süre
    const photoDuration = photos.length > 0
        ? Math.floor(durationInFrames / photos.length)
        : durationInFrames;

    // Text animasyonları
    const titleSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 200, stiffness: 80 },
    });

    const infoSpring = spring({
        frame: frame - 20,
        fps,
        config: { damping: 200, stiffness: 80 },
    });

    const hasPhotos = photos && photos.length > 0;

    // Photo URL'lerini staticFile ile sarmala (eğer relative path ise)
    const getPhotoSrc = (photo: string) => {
        if (photo.startsWith('http://') || photo.startsWith('https://')) {
            return photo;
        }
        return staticFile(photo);
    };

    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
            {/* Photo slides */}
            {hasPhotos && photos.map((photo, index) => (
                <Sequence
                    key={index}
                    from={index * photoDuration}
                    durationInFrames={photoDuration}
                >
                    <PhotoSlide
                        photo={getPhotoSrc(photo)}
                        startFrame={0}
                        durationInFrames={photoDuration}
                    />
                </Sequence>
            ))}

            {/* Placeholder when no photos */}
            {!hasPhotos && (
                <AbsoluteFill
                    style={{
                        background: 'linear-gradient(180deg, #2d3436 0%, #1a1a1a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontFamily: playfair,
                        fontSize: 36,
                    }}>
                        Fotoğraf Yükleniyor...
                    </div>
                </AbsoluteFill>
            )}

            {/* Vignette overlay */}
            <AbsoluteFill
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Bottom gradient for text readability */}
            <AbsoluteFill
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 25%, transparent 50%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Top subtle glow */}
            <AbsoluteFill
                style={{
                    background: 'linear-gradient(to bottom, rgba(201, 169, 98, 0.1) 0%, transparent 30%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Content layer */}
            <AbsoluteFill
                style={{
                    justifyContent: 'flex-end',
                    padding: 60,
                    paddingBottom: 120,
                }}
            >
                {/* Title */}
                <div
                    style={{
                        fontFamily: playfair,
                        fontSize: 52,
                        fontWeight: 500,
                        color: '#fdfbf7',
                        textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                        lineHeight: 1.3,
                        marginBottom: 20,
                        transform: `translateY(${interpolate(titleSpring, [0, 1], [60, 0])}px)`,
                        opacity: titleSpring,
                        letterSpacing: '0.02em',
                    }}
                >
                    {title}
                </div>

                {/* Location & Price */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 28,
                        fontFamily: inter,
                        transform: `translateY(${interpolate(infoSpring, [0, 1], [40, 0])}px)`,
                        opacity: infoSpring,
                    }}
                >
                    {location && (
                        <span
                            style={{
                                fontSize: 26,
                                color: 'rgba(253, 251, 247, 0.85)',
                                fontWeight: 300,
                                letterSpacing: '0.01em',
                            }}
                        >
                            📍 {location}
                        </span>
                    )}
                    {price && (
                        <span
                            style={{
                                fontSize: 26,
                                color: '#fdfbf7',
                                fontWeight: 500,
                            }}
                        >
                            ₺{price}
                        </span>
                    )}
                </div>
            </AbsoluteFill>

            {/* Branding - Subtle bottom corner */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 50,
                    opacity: 0.4,
                }}
            >
                <span
                    style={{
                        fontFamily: inter,
                        fontSize: 14,
                        color: '#fdfbf7',
                        letterSpacing: '0.15em',
                        fontWeight: 500,
                    }}
                >
                    REELSESTATE
                </span>
            </div>

            {/* Background music (if provided) */}
            {musicUrl && (
                <Audio
                    src={musicUrl}
                    volume={0.3}
                />
            )}
        </AbsoluteFill>
    );
};

