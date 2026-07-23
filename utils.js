// Защита от XSS: теперь используем replaceAll, как требуется в задании
export function escapeHtml(str) {
    if (!str) return ''
    return str
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}