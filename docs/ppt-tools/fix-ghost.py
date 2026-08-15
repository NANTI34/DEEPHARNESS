# Fix pptxgenjs ghost slideMaster Override bug: usage: fix.py <src.pptx> <dst.pptx>
import zipfile, re, sys

src, dst = sys.argv[1], sys.argv[2]
pattern = re.compile(r'<Override PartName="/ppt/slideMasters/slideMaster(?:[2-9]|1[0-9])\.xml"[^>]*/>')
zin = zipfile.ZipFile(src)
zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
removed = 0
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == '[Content_Types].xml':
        text = data.decode('utf-8')
        text2, n = pattern.subn('', text)
        removed += n
        data = text2.encode('utf-8')
    zout.writestr(item, data)
zout.close()
zin.close()
print('removed ghost overrides:', removed)
