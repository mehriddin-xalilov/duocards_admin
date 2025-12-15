class AuthBroadcastService {
    broadcastLogin(_token: string, _user: any) {}
    broadcastLogout() {}
}

export const authBroadcast = new AuthBroadcastService();
