const A = '/Users/maomao/blog_source2/public/'
const B = '/Users/maomao/XingMXTeam.github.io/'

const watcher = require('sync-directory')(A, B, {
    watch: true,
    exclude: ['node_modules', '\.git']
});