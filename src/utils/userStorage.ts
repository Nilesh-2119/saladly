// User data storage utility using localStorage

export interface SavedUserData {
    name: string;
    phone: string;
    fullAddress: string;
    deliveryInstructions: string;
    addressType: "home" | "work";
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
}

const USER_DATA_KEY = "saladly_user_data";

// Save user data to localStorage
export function saveUserData(data: Partial<SavedUserData>): void {
    try {
        const existing = getUserData();
        const updated = { ...existing, ...data };
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Failed to save user data:", error);
    }
}

// Get user data from localStorage
export function getUserData(): SavedUserData | null {
    try {
        const data = localStorage.getItem(USER_DATA_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error("Failed to get user data:", error);
        return null;
    }
}

// Clear user data from localStorage
export function clearUserData(): void {
    try {
        localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
        console.error("Failed to clear user data:", error);
    }
}
