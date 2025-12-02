import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll
} from "firebase/storage";
import { useFirebase } from "./firebase"; // Adjust if needed

const userStorage = () => {
    const firebase = useFirebase();

    const uploadProfileImage = async (userId, file, onProgress) => {
        if (!file) {
            throw new Error("No file provided for upload.");
        }

        const storageRef = ref(firebase.storage, `mess-finder/users/${userId}/profile.png`);

        // Create a reference to the file to be uploaded
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Calculate progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    if (onProgress) {
                        onProgress(progress); // Call the progress callback
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    reject(new Error("Upload failed: " + error.message));
                },
                async () => {
                    // Handle successful uploads
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(new Error("Failed to get download URL: " + error.message));
                    }
                }
            );
        });
    };

    const deleteProfileImage = async (userId) => {
        const storageRef = ref(firebase.storage, `mess-finder/users/${userId}/profile.png`); // Adjust extension if needed

        return new Promise((resolve, reject) => {
            deleteObject(storageRef)
                .then(() => {
                    resolve("Profile image deleted successfully.");
                })
                .catch((error) => {
                    reject(new Error("Delete failed: " + error.message));
                });
        });
    };

    return {
        uploadProfileImage,
        deleteProfileImage,
    };
};

const roomStorage = () => {
    const firebase = useFirebase();

    /**
     * Upload multiple room images under a specific roomId.
     * @param {string} roomId - Unique identifier for the room.
     * @param {File[]} files - Array of image files (max 7).
     * @param {(index: number, progress: number) => void} onProgress - Optional progress callback per file.
     * @returns {Promise<string[]>} - Array of download URLs.
     */
    const uploadRoomImages = async (roomId, files, onProgress) => {
        if (!files || files.length === 0) throw new Error("No files provided.");
        if (files.length > 7) throw new Error("Maximum 7 images allowed.");

        const uploadPromises = files.map((file, index) => {
            if (!file.file) {
                // No actual file to upload, use preview URL
                if (onProgress) onProgress(index, 100); // Simulate full progress
                return Promise.resolve(file.preview);
            }

            const filePath = `mess-finder/rooms/${roomId}/image_${index}.jpg`;
            const storageRef = ref(firebase.storage, filePath);
            const uploadTask = uploadBytesResumable(storageRef, file.file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (onProgress) onProgress(index, progress);
                    },
                    (error) => reject(new Error(`Upload failed: ${error.message}`)),
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        } catch (error) {
                            reject(new Error(`Failed to get URL: ${error.message}`));
                        }
                    }
                );
            });
        });

        return Promise.all(uploadPromises);
    };


    /**
     * Delete all images for a given roomId.
     * @param {string} roomId
     * @returns {Promise<void>}
     */
    const deleteRoomImages = async (roomId) => {
        const roomFolderRef = ref(firebase.storage, `mess-finder/rooms/${roomId}`);

        try {
            const allItems = await listAll(roomFolderRef);
            const deletePromises = allItems.items.map(itemRef => deleteObject(itemRef));
            await Promise.all(deletePromises);
        } catch (error) {
            throw new Error(`Failed to delete images: ${error.message}`);
        }
    };

    return {
        uploadRoomImages,
        deleteRoomImages,
    };
};

export {
    userStorage,
    roomStorage,
};


