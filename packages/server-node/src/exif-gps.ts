// The GPS block of EXIF, and nothing else: latitude, longitude and altitude in decimal degrees from the head of a JPEG
// or TIFF. Read only when a source opted into location (01 CON-05); the probe buffer is 64 KB, so a tag past it is
// simply not found. Dependency-free, bounds-checked, never throws.
export interface GpsLocation { lat: number; lng: number; alt?: number }

export function readExifGps(buf: Buffer): GpsLocation | null {
  try {
    let tiff = -1;
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) { // JPEG: find the APP1 Exif segment
      let i = 2;
      while (i + 4 <= buf.length && buf[i] === 0xff) {
        const marker = buf[i + 1]!, len = buf.readUInt16BE(i + 2);
        if (marker === 0xe1 && buf.toString('latin1', i + 4, i + 10) === 'Exif\0\0') { tiff = i + 10; break; }
        if (marker === 0xda) break; // start of scan: no more metadata
        i += 2 + len;
      }
    } else if (buf.length > 8 && ((buf[0] === 0x49 && buf[1] === 0x49) || (buf[0] === 0x4d && buf[1] === 0x4d))) tiff = 0; // TIFF
    if (tiff < 0 || tiff + 8 > buf.length) return null;
    const le = buf[tiff] === 0x49;
    const u16 = (o: number) => (o + 2 <= buf.length ? (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o)) : -1);
    const u32 = (o: number) => (o + 4 <= buf.length ? (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o)) : -1);
    const rational = (o: number) => { const n = u32(o), d = u32(o + 4); return n < 0 || d <= 0 ? NaN : n / d; };
    if (u16(tiff + 2) !== 42) return null;
    const ifd0 = tiff + u32(tiff + 4);
    const entries = (ifd: number): Map<number, { type: number; count: number; valueOffset: number }> => {
      const out = new Map<number, { type: number; count: number; valueOffset: number }>();
      const n = u16(ifd); if (n < 0 || n > 512) return out;
      for (let k = 0; k < n; k++) {
        const e = ifd + 2 + k * 12; if (e + 12 > buf.length) break;
        out.set(u16(e), { type: u16(e + 2), count: u32(e + 4), valueOffset: e + 8 });
      }
      return out;
    };
    const gpsPointer = entries(ifd0).get(0x8825);
    if (!gpsPointer) return null;
    const gps = entries(tiff + u32(gpsPointer.valueOffset));
    const ascii = (tag: number) => { const e = gps.get(tag); return e ? String.fromCharCode(buf[e.valueOffset] ?? 0) : ''; };
    const dms = (tag: number) => { const e = gps.get(tag); if (!e || e.type !== 5 || e.count < 3) return NaN; const o = tiff + u32(e.valueOffset); const d = rational(o), m = rational(o + 8), s = rational(o + 16); return d + m / 60 + s / 3600; };
    let lat = dms(0x0002), lng = dms(0x0004);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (ascii(0x0001).toUpperCase() === 'S') lat = -lat;
    if (ascii(0x0003).toUpperCase() === 'W') lng = -lng;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) return null;
    const out: GpsLocation = { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 };
    const altE = gps.get(0x0006);
    if (altE && altE.type === 5) { const alt = rational(tiff + u32(altE.valueOffset)); if (Number.isFinite(alt)) { const below = (buf[gps.get(0x0005)?.valueOffset ?? -1] ?? 0) === 1; out.alt = Math.round((below ? -alt : alt) * 10) / 10; } }
    return out;
  } catch { return null; }
}
