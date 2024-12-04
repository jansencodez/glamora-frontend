export interface IUser {
  _id: string; // Unique identifier for the user (e.g., from MongoDB ObjectId or JWT)
  name: string;
  email: string;
  optIn: boolean;
  active: boolean;
  role: "customer" | "admin"; // Role can be either 'customer' or 'admin'
  orders: string[]; // Array of Order IDs (strings corresponding to the order references)
  createdAt?: string; // Timestamp in ISO string format (optional, can be used for display)
  updatedAt?: string; // Timestamp in ISO string format (optional, can be used for display)
}
