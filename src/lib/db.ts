import { openDB, DBSchema } from 'idb';

export interface Avatar {
    id: string;
    name: string;
    style: string;
    createdAt: number;
    imageData: string; // base64 or blob url
    traits: string[];
}

interface MyDB extends DBSchema {
    avatars: {
        key: string;
        value: Avatar;
        indexes: { 'by-date': number };
    };
    presets: {
        key: string;
        value: { id: string; name: string; settings: any };
    };
}

const DB_NAME = 'basestyle-db';

export const initDB = async () => {
    return openDB<MyDB>(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('avatars')) {
                const store = db.createObjectStore('avatars', { keyPath: 'id' });
                store.createIndex('by-date', 'createdAt');
            }
            if (!db.objectStoreNames.contains('presets')) {
                db.createObjectStore('presets', { keyPath: 'id' });
            }
        },
    });
};

export async function saveAvatar(avatar: Avatar) {
    const db = await initDB();
    return db.put('avatars', avatar);
}

export async function getAvatars() {
    const db = await initDB();
    return db.getAllFromIndex('avatars', 'by-date');
}

export async function deleteAvatar(id: string) {
    const db = await initDB();
    return db.delete('avatars', id);
}
