
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import type { Asset } from "./types";

const getAssetsCollection = (familyId: string) => {
    const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';
    return collection(db, `fam360/${env}/families`, familyId, "assets");
};

export const addAsset = async (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const assetsCollection = getAssetsCollection(asset.familyId);
    const newAsset = {
        ...asset,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const docRef = await addDoc(assetsCollection, newAsset);
    return docRef.id;
};

export const updateAsset = async (familyId: string, assetId: string, updates: Partial<Asset>) => {
    const assetsCollection = getAssetsCollection(familyId);
    const assetDoc = doc(assetsCollection, assetId);
    const updatedAsset = {
        ...updates,
        updatedAt: new Date(),
    };
    await updateDoc(assetDoc, updatedAsset);
};

export const deleteAsset = async (familyId: string, assetId: string) => {
    const assetsCollection = getAssetsCollection(familyId);
    const assetDoc = doc(assetsCollection, assetId);
    await deleteDoc(assetDoc);
};
