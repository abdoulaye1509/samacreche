import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdbService {
    private dbName = 'samacreche.angular';
    private storeName = 'db';
    private local_storage_prefixe = 'jt_';
  
    constructor() {
      this.initDB();
    }
  
    // Initialiser IndexedDB
    private initDB(): void {
      const request = indexedDB.open(this.dbName, 1);
  
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
  
        // Crée une object store s'il n'existe pas déjà
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
  
      request.onerror = (event) => {
        console.error('Erreur lors de l’ouverture d’IndexedDB :', event);
      };
  
      request.onsuccess = (event) => {
        console.log('IndexedDB initialisé avec succès');
      };
    }
  
    // Récupérer une valeur par clé
    async get_from_indexedDB(key: string): Promise<any> {
      return new Promise((resolve, reject) => {
        const prefixedKey = this.local_storage_prefixe + key;
        const request = indexedDB.open(this.dbName);
  
        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);
  
          const getRequest = store.get(prefixedKey);
          getRequest.onsuccess = () => {
            resolve(getRequest.result ? getRequest.result.value : null);
          };
          getRequest.onerror = () => {
            console.error('Erreur de récupération depuis IndexedDB');
            reject(getRequest.error);
          };
        };
  
        request.onerror = () => {
          console.error('Erreur d’accès à IndexedDB');
          reject(request.error);
        };
      });
    }
  
    // Sauvegarder une valeur
    async save_on_indexedDB(key: string, value: any): Promise<void> {
      return new Promise((resolve, reject) => {
        const prefixedKey = this.local_storage_prefixe + key;
        const request = indexedDB.open(this.dbName);
  
        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
  
          const putRequest = store.put({ key: prefixedKey, value });
          putRequest.onsuccess = () => {
            resolve();
          };
          putRequest.onerror = () => {
            console.error('Erreur lors de la sauvegarde dans IndexedDB');
            reject(putRequest.error);
          };
        };
  
        request.onerror = () => {
          console.error('Erreur d’accès à IndexedDB');
          reject(request.error);
        };
      });
    }
  
    // Supprimer une valeur par clé
    async delete_from_indexedDB(key: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const prefixedKey = this.local_storage_prefixe + key;
        const request = indexedDB.open(this.dbName);
  
        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
  
          const deleteRequest = store.delete(prefixedKey);
          deleteRequest.onsuccess = () => {
            resolve();
          };
          deleteRequest.onerror = () => {
            console.error('Erreur lors de la suppression dans IndexedDB');
            reject(deleteRequest.error);
          };
        };
  
        request.onerror = () => {
          console.error('Erreur d’accès à IndexedDB');
          reject(request.error);
        };
      });
    }
  }