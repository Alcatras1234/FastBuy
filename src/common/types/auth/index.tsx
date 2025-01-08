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
    setRole?: (value: (((prevState: string) => string) | string)) => void
}