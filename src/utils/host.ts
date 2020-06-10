
// https://github.com/vuejs/vue-hackernews-2.0/blob/4dff0740b182f34c4c5fe1e2017576e3ffcea521/src/util/filters.js


export function host (url?:string) {
    if(!url) return ''
    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const parts = host.split('.').slice(-3)
    if (parts[0] === 'www') parts.shift()
    return parts.join('.')
  }
  