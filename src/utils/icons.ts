export function buildSvgIcon(icon: string, size: string, color: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">${icon}</svg>`
}

export function svgToDataUrl(svg: string) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
}
