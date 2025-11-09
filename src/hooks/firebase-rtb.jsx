import { ref, push, get, remove, update, serverTimestamp, onValue, set } from "firebase/database";
import { validateUsername } from "../module/js/string";

const userRTB = (firebase) => {
    const saveData = async (id, data) => {
        try {
            if (!id || !(data.email || data.id)) {
                throw new Error("Missing required user information.");
            }

            const dbRef = ref(firebase.db, `/mess-finder/users/${id}`);
            const snapshot = await get(dbRef);
            const exists = snapshot.exists();

            const timestampData = {
                updatedAt: serverTimestamp(),
                ...(exists ? {} : { createdAt: serverTimestamp() }),
            };

            const newData = {
                ...data,
                ...timestampData,
            };

            await update(dbRef, newData); // use update to preserve existing data and apply server timestamps

            return { status: true, message: exists ? "Data updated." : "User created." };
        } catch (error) {
            throw error;
        }
    };

    const uploadPhoto = async (id, photoURL) => {
        try {
            if (!id || !photoURL) {
                throw new Error("Missing user ID or photo URL.");
            }

            const dbRef = ref(firebase.db, `/mess-finder/users/${id}`);
            const updateData = {
                photoURL: photoURL,
                updatedAt: serverTimestamp(),
            };

            await update(dbRef, updateData);
            return { status: true, message: "Profile photo updated." };
        } catch (error) {
            throw error;
        }
    };


    const deleteData = async (id) => {
        try {
            const dbRef = ref(firebase.db, `/mess-finder/users/${id}`);
            await remove(dbRef);
            return { status: true, message: "Deleted Successfully" };
        } catch (error) {
            throw error; // Throw the error to allow .catch() to handle it
        }
    };

    const getData = async (id) => {
        try {
            const dbRef = ref(firebase.db, `/mess-finder/users/${id}`);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            throw error; // Throw the error to allow .catch() to handle it
        }
    };

    const getAllUsers = async () => {
        try {
            const dbRef = ref(firebase.db, "/mess-finder/users");
            const snapshot = await get(dbRef);
            return snapshot.exists() ? snapshot.val() : null;
        } catch (error) {
            throw error;
        }
    };


    const userExists = async (username) => {
        // 1. Validate format: starts with a-z, can include numbers and underscores
        const valid = validateUsername(username);
        if (!valid.status) {
            return { valid: false, available: false, reason: valid.message };
        }

        try {
            const allUsersRef = ref(firebase.db, "/mess-finder/users");
            const snapshot = await get(allUsersRef);
            if (!snapshot.exists()) {
                return { valid: true, available: true }; // No users yet, username is available
            }

            const users = snapshot.val();
            for (const id in users) {
                if (users[id].username === username) {
                    return { valid: true, available: false, reason: "Username already taken." };
                }
            }

            return { valid: true, available: true };
        } catch (error) {
            console.error("Error checking username existence:", error);
            throw error;
        }
    };

    return { saveData, uploadPhoto, deleteData, getData, getAllUsers, userExists };
};


const roomsRTB = (firebase) => {
    const baseRef = ref(firebase.db, "/mess-finder/rooms");

    const saveRoom = async (roomData, roomId = null) => {
        try {
            const currentUser = firebase.auth.currentUser;
            if (!currentUser) throw new Error("User not authenticated.");

            const ownerId = currentUser.uid;

            const timestampData = {
                updatedAt: serverTimestamp(),
                ...(roomId ? {} : { createdAt: serverTimestamp() }),
            };

            const newData = {
                ...roomData,
                ownerId, // ✅ include the creator ID
                ...timestampData,
            };

            let roomRef;

            if (roomId) {
                roomRef = ref(firebase.db, `/mess-finder/rooms/${roomId}`);
                await update(roomRef, newData);
                return { status: true, message: "Room updated.", roomId };
            } else {
                roomRef = push(baseRef); // generate auto ID
                await set(roomRef, newData);
                return { status: true, message: "Room created.", roomId: roomRef.key };
            }
        } catch (error) {
            throw error;
        }
    };

    const deleteRoom = async (roomId, ownerId) => {
        try {
            const roomRef = ref(firebase.db, `/mess-finder/rooms/${roomId}`);
            const snapshot = await get(roomRef);

            if (!snapshot.exists()) {
                return { status: false, message: "Room not found." };
            }

            const roomData = snapshot.val();

            if (roomData.ownerId !== ownerId) {
                return { status: false, message: "Unauthorized: Only the owner can delete the room." };
            }

            await remove(roomRef);
            return { status: true, message: "Room deleted." };
        } catch (error) {
            throw error;
        }
    };


    const getRoom = async (roomId) => {
        try {
            const roomRef = ref(firebase.db, `/mess-finder/rooms/${roomId}`);
            const snapshot = await get(roomRef);
            return snapshot.exists() ? snapshot.val() : null;
        } catch (error) {
            throw error;
        }
    };

    const getAllRooms = async () => {
        try {
            const snapshot = await get(baseRef);
            return snapshot.exists() ? snapshot.val() : {};
        } catch (error) {
            throw error;
        }
    };

    return {
        saveRoom,
        deleteRoom,
        getRoom,
        getAllRooms,
    };
};

const infoRTB = (firebase) => {
    const contactUs = async (data) => {
        try {
            const { uid, name, email, message } = data;

            if (!uid || !name || !email || !message) {
                throw new Error("Missing required contact fields.");
            }

            const contactRef = ref(firebase.db, "/mess-finder/info/contactus");
            const newContactRef = push(contactRef); // auto ID

            const newContact = {
                uid,
                name,
                email,
                message,
                createdAt: serverTimestamp(),
            };

            await set(newContactRef, newContact);

            return { status: true, message: "Contact message sent successfully." };
        } catch (error) {
            console.error("Error submitting contact form:", error);
            throw error;
        }
    };

    const reportRoom = async (data) => {
        try {
            const { uid, roomId, ownerUname, ownerId, reason, description } = data;

            if (!uid || !ownerId || !ownerUname || !reason || !description) {
                throw new Error("Missing required report fields.");
            }

            const reportRef = ref(firebase.db, "/mess-finder/info/report");
            const newReportRef = push(reportRef); // auto ID

            const newReport = {
                uid,
                roomId,
                ownerUname,
                ownerId,
                reason,
                description,
                createdAt: serverTimestamp(),
            };

            await set(newReportRef, newReport);

            return { status: true, message: "Report submitted successfully." };
        } catch (error) {
            console.error("Error submitting report:", error);
            throw error;
        }
    };

    return {
        contactUs,
        reportRoom,
    };
};

const bookmarksRTB = (firebase) => {
    const baseRef = ref(firebase.db, "/mess-finder/bookmarks");

    // Save a bookmark for a specific room
    const saveBookmark = async (uid, roomId) => {
        try {
            if (!uid || !roomId) {
                throw new Error("Missing user ID or room ID.");
            }

            const bookmarkRef = ref(firebase.db, `/mess-finder/bookmarks/${uid}`);
            const newBookmarkRef = push(bookmarkRef); // Generate a unique ID for the bookmark

            const newBookmark = {
                roomId,
                createdAt: serverTimestamp(),
            };

            await set(newBookmarkRef, newBookmark);
            return { status: true, message: "Bookmark saved successfully.", bookmarkId: newBookmarkRef.key };
        } catch (error) {
            throw error;
        }
    };

    // Get all bookmarks for a specific user
    const getBookmarks = async (uid) => {
        try {
            if (!uid) {
                throw new Error("Missing user ID.");
            }

            const bookmarksRef = ref(firebase.db, `/mess-finder/bookmarks/${uid}`);
            const snapshot = await get(bookmarksRef);
            return snapshot.exists() ? snapshot.val() : {};
        } catch (error) {
            throw error;
        }
    };

    // Delete a specific bookmark for a user
    const deleteBookmark = async (uid, bookmarkId) => {
        try {
            if (!uid || !bookmarkId) {
                throw new Error("Missing user ID or bookmark ID.");
            }

            const bookmarkRef = ref(firebase.db, `/mess-finder/bookmarks/${uid}/${bookmarkId}`);
            await remove(bookmarkRef);
            return { status: true, message: "Bookmark deleted successfully." };
        } catch (error) {
            throw error;
        }
    };

    return {
        saveBookmark,
        getBookmarks,
        deleteBookmark,
    };
};

const chatRTB = (firebase) => {
    // Create new chat with first message or add message to existing chat
    const createChat = async (ownerId, userId, existingChatId = null, firstMessage = "") => {
        try {
            if (!ownerId || !userId) {
                throw new Error("Missing required chat information.");
            }

            let chatId = existingChatId;

            // ✅ Check if a chat already exists between these users
            const userChatsRef = ref(firebase.db, `/mess-finder/userChats/${ownerId}`);
            const snapshot = await get(userChatsRef);

            if (snapshot.exists()) {
                const chats = snapshot.val();
                for (const existingChatId in chats) {
                    if (chats[existingChatId].userId === userId) {
                        chatId = existingChatId; // ✅ Use the existing chat ID
                        break;
                    }
                }
            }

            // ✅ If no chat exists, create a new one
            if (!chatId) {
                const chatRef = ref(firebase.db, "/mess-finder/chats");
                const newChatRef = push(chatRef);
                chatId = newChatRef.key;

                await set(newChatRef, {
                    ownerId: ownerId,
                    userId: userId,
                });

                const userChatsRefOwner = ref(firebase.db, `/mess-finder/userChats/${ownerId}/${chatId}`);
                const userChatsRefUser = ref(firebase.db, `/mess-finder/userChats/${userId}/${chatId}`);
                await set(userChatsRefOwner, { chatId: chatId, userId: userId });
                await set(userChatsRefUser, { chatId: chatId, ownerId: ownerId });
            }

            // ✅ Send the message regardless of whether a new chat was created or not
            if (firstMessage.trim() !== "") {
                const msgRef = push(ref(firebase.db, `/mess-finder/chats/${chatId}/messages`));
                const messageData = {
                    text: firstMessage,
                    sent: true,
                    timestamp: serverTimestamp(),
                };
                await set(msgRef, messageData);
            }

            return { status: true, chatId: chatId, message: "Message sent successfully." };
        } catch (error) {
            throw error;
        }
    };





    // Add new message to existing chat
    const sendMessage = async (chatId, message, sent = true) => {
        try {
            if (!chatId || !message) {
                throw new Error("Missing chat ID or message.");
            }

            const chatMessagesRef = ref(firebase.db, `/mess-finder/chats/${chatId}/messages`);
            const newMsgRef = push(chatMessagesRef);

            const messageData = {
                text: message,
                sent,
                timestamp: serverTimestamp(),
            };

            await set(newMsgRef, messageData);

            return { status: true, message: "Message sent successfully." };
        } catch (error) {
            throw error;
        }
    };

    const deleteMessage = async (chatId, messageIndex) => {
        try {
            if (!chatId || messageIndex == null) {
                throw new Error("Missing chat ID or message index.");
            }

            const chatRef = ref(firebase.db, `/mess-finder/chats/${chatId}/messages`);
            const snapshot = await get(chatRef);
            if (!snapshot.exists()) return { status: false, message: "No messages found." };

            const messagesObj = snapshot.val();

            // Convert and sort messages by timestamp
            const messages = Object.entries(messagesObj)
                .map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => {
                    if (!a.timestamp || !b.timestamp) return 0;
                    return a.timestamp - b.timestamp;
                });

            // Get the message ID at the given index
            const targetMessage = messages[messageIndex];
            if (!targetMessage) {
                return { status: false, message: "Invalid message index." };
            }

            const messageRef = ref(firebase.db, `/mess-finder/chats/${chatId}/messages/${targetMessage.id}`);
            await remove(messageRef);

            return { status: true, message: "Message deleted successfully." };
        } catch (error) {
            throw error;
        }
    };




    // Delete a chat entirely
    const deleteChat = async (chatId) => {
        try {
            // Fetch the chat data first to get ownerId and userId
            const chatRef = ref(firebase.db, `/mess-finder/chats/${chatId}`);
            const chatSnapshot = await get(chatRef);

            if (!chatSnapshot.exists()) {
                return { status: false, message: "Chat not found." };
            }

            const chatData = chatSnapshot.val();
            const ownerId = chatData.ownerId;
            const userId = chatData.userId;

            // Delete the chat
            await remove(chatRef);

            // Remove chat references from both users' userChats
            if (ownerId) {
                const ownerChatRef = ref(firebase.db, `/mess-finder/userChats/${ownerId}/${chatId}`);
                await remove(ownerChatRef);
            }
            if (userId) {
                const userChatRef = ref(firebase.db, `/mess-finder/userChats/${userId}/${chatId}`);
                await remove(userChatRef);
            }

            return { status: true, message: "Chat deleted successfully." };
        } catch (error) {
            throw error;
        }
    };


    // Get chat data once by chatId
    const getChat = async (chatId) => {
        try {
            const chatRef = ref(firebase.db, `/mess-finder/chats/${chatId}`);
            const snapshot = await get(chatRef);
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return null;
        } catch (error) {
            throw error;
        }
    };

    // Listen for realtime updates on a chat messages
    const onChatMessages = (chatId, callback) => {
        const messagesRef = ref(firebase.db, `/mess-finder/chats/${chatId}/messages`);
        return onValue(messagesRef, (snapshot) => {
            const messagesObj = snapshot.val() || {};
            // Convert to sorted array by timestamp (if present)
            const messages = Object.entries(messagesObj)
                .map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => {
                    if (!a.timestamp || !b.timestamp) return 0;
                    return a.timestamp - b.timestamp;
                });
            callback(messages);
        });
    };

    // Get list of chat IDs associated with a user
    const getUserChats = async (userId) => {
        try {
            const userChatsRef = ref(firebase.db, `/mess-finder/userChats/${userId}`);
            const snapshot = await get(userChatsRef);
            if (!snapshot.exists()) {
                return {};
            }
            return snapshot.val();
        } catch (error) {
            throw error;
        }
    };

    return { createChat, sendMessage, deleteMessage, deleteChat, getChat, onChatMessages, getUserChats };
};





export {
    roomsRTB,
    userRTB,
    infoRTB,
    chatRTB,
    bookmarksRTB
};