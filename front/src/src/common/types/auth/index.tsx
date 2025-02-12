export interface IPropsUsersLogin {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

export interface IPropsOrganizerRegisterBaseInfo {
    setEmail: (email: string) => void,
    setPassword: (password: string) => void,
    setConfirmPassword: (email: string) => void,
}
export interface IPropsOrganizerRegisterCorpInfo {
    setPhoneNumber: (phoneNumber: string) => void,
    setCorpName: (corpName: string) => void,
}
export interface IPropsAdminLogin {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}
export interface IPropsVerificationCode {
    setVerificationCode: (code: string) => void;
}

export interface IPropsUserRegister {
    setEmail: (email: string) => void,
    setPassword: (email: string) => void
    setConfirmPassword: (email: string) => void,
}

export interface IAuthState {
    user:IPublicUser,
    isLogged: boolean,

}

export interface IPublicUser {
    id: number | null,
    fullName: string,
    email: string,
}