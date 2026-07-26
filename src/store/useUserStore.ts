import { create } from "zustand";
import api from "@/api/axios";

type Address = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type UserProfileData = {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
  email: string;
  tier: string;
  homeCountry: string;
  address: Address;
};

export type UserState = {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: UserProfileData) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>(set => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get("/users/profile");
      const data = res.data.data;

      const profileData: UserProfileData = {
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        username: data.username || "",
        mobileNumber: data.mobileNumber || "",
        tier: data.tier || "",
        homeCountry: data.homeCountry || "",
        address: {
          street1: data.streetAddress1 || data.address?.street1 || "",
          street2: data.streetAddress2 || data.address?.street2 || "",
          city: data.city || data.address?.city || "",
          state: data.state || data.address?.state || "",
          postalCode: data.postalCode || data.address?.postalCode || "",
          country: data.country || data.address?.country || "",
        },
      };

      set({ profile: profileData, isLoading: false });
    }
    catch (err: any) {
      const message
        = err.response?.data?.message || err.message || "Failed to load user profile";
      set({ error: message, isLoading: false });
    }
  },

  setProfile: profile => set({ profile }),
  clearUser: () => set({ profile: null, error: null }),
}));
