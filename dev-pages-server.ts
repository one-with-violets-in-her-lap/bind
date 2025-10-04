import mainPage from './developer-pages/index.html'

import { serve } from 'bun'

const server = serve({
    routes: {
        '/': mainPage,
    },

    development: true,
})

console.log(`Listening on ${server.url}`)
