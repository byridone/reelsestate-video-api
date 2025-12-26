import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import { RealEstateVideo } from './RealEstateVideo';

/**
 * REMOTION ROOT
 * =============
 * Video composition tanımları
 */

const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* Ana emlak videosu - 9:16 Instagram Reels format */}
            <Composition
                id="RealEstateVideo"
                component={RealEstateVideo}
                durationInFrames={150} // 5 saniye @ 30fps
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    photos: [],
                    title: 'Lüks Emlak',
                    location: 'İstanbul',
                    price: '1.000.000',
                }}
            />

            {/* Kısa versiyon - 3 saniye */}
            <Composition
                id="RealEstateVideoShort"
                component={RealEstateVideo}
                durationInFrames={90} // 3 saniye @ 30fps
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    photos: [],
                    title: 'Lüks Emlak',
                    location: 'İstanbul',
                    price: '1.000.000',
                }}
            />

            {/* Uzun versiyon - 10 saniye */}
            <Composition
                id="RealEstateVideoLong"
                component={RealEstateVideo}
                durationInFrames={300} // 10 saniye @ 30fps
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    photos: [],
                    title: 'Lüks Emlak',
                    location: 'İstanbul',
                    price: '1.000.000',
                }}
            />

            {/* Square format - Instagram Feed */}
            <Composition
                id="RealEstateVideoSquare"
                component={RealEstateVideo}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1080}
                defaultProps={{
                    photos: [],
                    title: 'Lüks Emlak',
                    location: 'İstanbul',
                    price: '1.000.000',
                }}
            />

            {/* Landscape - YouTube format */}
            <Composition
                id="RealEstateVideoLandscape"
                component={RealEstateVideo}
                durationInFrames={150}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    photos: [],
                    title: 'Lüks Emlak',
                    location: 'İstanbul',
                    price: '1.000.000',
                }}
            />
        </>
    );
};

registerRoot(RemotionRoot);

