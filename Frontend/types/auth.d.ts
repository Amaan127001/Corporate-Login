declare type AuthContextValue = {
  currentUser: {
    token: string;
    profileCompleted: boolean;
    hasSelectedProfileType: boolean;
    profileDetails?: any;
    // Add other properties you use from currentUser
  } | null;
  loading: boolean;
  login: (accessToken: string) => Promise<{
    profileCompleted: boolean;
    hasSelectedProfileType: boolean;
  }>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<any>;
};