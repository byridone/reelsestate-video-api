/**
 * REELSESTATE VIDEO RENDER API
 * ============================
 * Railway'de çalışan video render servisi
 * 
 * Endpoints:
 * - POST /render - Video oluştur
 * - GET /health - Sağlık kontrolü
 */

const express = require('express');
const cors = require('cors');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Aktif render sayısı
let activeRenders = 0;
const MAX_CONCURRENT_RENDERS = 2;

// ==================== ENDPOINTS ====================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        activeRenders,
        maxConcurrent: MAX_CONCURRENT_RENDERS,
        timestamp: new Date().toISOString(),
    });
});

// Video render endpoint
app.post('/render', async (req, res) => {
    const startTime = Date.now();

    // Rate limiting
    if (activeRenders >= MAX_CONCURRENT_RENDERS) {
        return res.status(429).json({
            error: 'Too many concurrent renders',
            message: 'Lütfen biraz bekleyin, sunucu meşgul.',
            activeRenders,
        });
    }

    activeRenders++;

    try {
        const {
            photos,
            title = 'Emlak İlanı',
            location,
            price,
            dayOfMonth = new Date().getDate(),
            compositionId = 'RealEstateVideo',
        } = req.body;

        if (!photos || photos.length === 0) {
            activeRenders--;
            return res.status(400).json({ error: 'Fotoğraf gerekli' });
        }

        console.log(`[Render] Başlıyor: ${title}, ${photos.length} fotoğraf`);

        // Geçici dosya yolu
        const outputId = uuidv4();
        const outputPath = path.join('/tmp', `${outputId}.mp4`);

        // Remotion bundling
        console.log('[Render] Bundling...');
        const bundleLocation = await bundle({
            entryPoint: path.resolve('./remotion/index.tsx'),
            webpackOverride: (config) => config,
        });

        // Composition seç
        console.log('[Render] Composition seçiliyor...');
        const inputProps = { photos, title, location, price, dayOfMonth };
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: compositionId,
            inputProps,
        });

        // Render
        console.log('[Render] Rendering...');
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps,
            onProgress: ({ progress }) => {
                console.log(`[Render] Progress: ${Math.round(progress * 100)}%`);
            },
        });

        // Cloudinary'a yükle
        console.log('[Render] Cloudinary\'a yükleniyor...');
        const uploadResult = await cloudinary.uploader.upload(outputPath, {
            resource_type: 'video',
            folder: 'reelsestate/videos',
            public_id: `video_${outputId}`,
        });

        // Geçici dosyayı sil
        fs.unlinkSync(outputPath);

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[Render] Tamamlandı: ${duration}s`);

        activeRenders--;

        res.json({
            success: true,
            videoUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            duration: `${duration}s`,
            format: '1080x1920',
        });

    } catch (error) {
        activeRenders--;
        console.error('[Render] Hata:', error);
        res.status(500).json({
            error: 'Video oluşturma hatası',
            message: error.message,
        });
    }
});

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        name: 'ReelsEstate Video Render API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            render: 'POST /render',
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎬 ReelsEstate Video Render API`);
    console.log(`   Port: ${PORT}`);
    console.log(`   Max concurrent renders: ${MAX_CONCURRENT_RENDERS}`);
});
