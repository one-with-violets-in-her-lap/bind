import { cp, rm, exists } from 'fs/promises'
import path from 'path'
import vuePlugin from '@eckidevs/bun-plugin-vue'
import styleLoader from 'bun-style-loader'

const MANIFEST_VERSION = process.env.BIND_MANIFEST_VERSION

if (MANIFEST_VERSION !== 'v3' && MANIFEST_VERSION !== 'v2') {
    throw new Error(
        'MANIFEST_VERSION environment variable must be specified with value "v2" or "v3"',
    )
}

const OUT_DIRECTORY = './dist'

const STATIC_FILES_DIRECTORY = './public/'
const MANIFEST_FILES_PATHS = {
    v2: './manifest-v2.json',
    v3: './manifest-v3.json',
}

if (await exists(OUT_DIRECTORY)) {
    await rm(OUT_DIRECTORY, { recursive: true })
}

Bun.build({
    entrypoints: [
        './src/content-script/main.ts',
        './src/popup/index.html',
        './src/background/main.ts',
    ],
    outdir: OUT_DIRECTORY,
    plugins: [
        vuePlugin(),
        styleLoader(),
        {
            name: 'static-files',
            setup(bun) {
                bun.onEnd(async () => {
                    if (!bun.config.outdir) {
                        console.warn(
                            'Out dir is not specified, so the static files wont be copied anywhere',
                        )
                        return
                    }

                    await cp(STATIC_FILES_DIRECTORY, bun.config.outdir, {
                        recursive: true,
                    })

                    console.log(`Copying manifest ${MANIFEST_VERSION} to the bundle`)
                    await cp(
                        MANIFEST_FILES_PATHS[MANIFEST_VERSION],
                        path.resolve(bun.config.outdir, 'manifest.json'),
                    )
                })
            },
        },
    ],

    define: {
        'process.env.BIND_MODE': JSON.stringify(
            process.env.BIND_MODE || 'production',
        ),
    },
})
