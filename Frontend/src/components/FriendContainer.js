export default function Friend({username, status}) {
    if (status === "Online") {
        return (
            <div class="friend-container">
                <div>
                    <div class="avatar online"></div>
                    <p class="username">{username}</p>
                </div>
                <div class="status">
                    <p>{status}</p>
                </div>
                <div class="btn-functions">
                    <button class="invite">Invite to game</button>
                </div>
            </div>
        );
    }
    else {
        return (
            <div class="friend-container">
                <div>
                    <div class="avatar offline"></div>
                    <p class="username">{username}</p>
                </div>
                <div class="status">
                    <p>{status}</p>
                </div>
                <div class="btn-functions">
                    
                </div>
            </div>
        );
    }
}