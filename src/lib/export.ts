import JSZip from 'jszip';
import { Avatar } from './db';

export async function exportAvatarsToZip(avatars: Avatar[]) {
    const zip = new JSZip();
    const metadata = avatars.map(a => ({
        id: a.id,
        name: a.name,
        style: a.style,
        traits: a.traits,
        createdAt: new Date(a.createdAt).toISOString(),
    }));

    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    avatars.forEach(avatar => {
        // avatar.imageData is data:image/png;base64,...
        const base64Data = avatar.imageData.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        zip.file(`${avatar.id}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'avatars.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
