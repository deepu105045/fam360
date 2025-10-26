
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Asset } from "./types";

const getAssetsCollection = (familyId: string) => {
    const env = import.meta.env.VITE_FIREBASE_ENV || 'dev';
    return collection(db, `fam360/${env}/families`, familyId, "assets");
};

export const addAsset = async (familyId: string, asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const assetsCollection = getAssetsCollection(familyId);
    const newAsset = {
        ...asset,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(assetsCollection, newAsset);
    return docRef.id;
};

export const updateAsset = async (familyId: string, assetId: string, updates: Partial<Asset>) => {
    const assetsCollection = getAssetsCollection(familyId);
    const assetDoc = doc(assetsCollection, assetId);
    const updatedAsset = {
        ...updates,
        updatedAt: serverTimestamp(),
    };
    await updateDoc(assetDoc, updatedAsset);
};

export const deleteAsset = async (familyId: string, assetId: string) => {
    const assetsCollection = getAssetsCollection(familyId);
    const assetDoc = doc(assetsCollection, assetId);
    await deleteDoc(assetDoc);
};
