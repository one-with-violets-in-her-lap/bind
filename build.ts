import { cp, rm, exists } from 'fs/promises'
import vuePlugin from '@eckidevs/bun-plugin-vue'
import styleLoader from 'bun-style-loader'

const STATIC_FILES_DIRECTORY = './public/'
const OUT_DIRECTORY = './dist'

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
