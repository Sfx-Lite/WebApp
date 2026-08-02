export type Address = {
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
  profileImage: string;
  kycStatus: string;
};
