export interface IPropsLogin {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

export interface IPropsRegister {
    setFullName(fullName: string): void,
    setEmail: (email: string) => void,
    setPassword: (password: string) => void,
    setConfirmPassword: (email: string) => void,
    setSelectedRole: (role: string) => void,
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