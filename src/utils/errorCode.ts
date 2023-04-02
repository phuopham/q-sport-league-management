export enum Err {
    INSUFFICIENT_CONTENT = 'Insufficient content!',
    INSUFFICIENT_PRIVILEGE = "Insufficient Privilege",
    INSUFFICIENT_TOKEN = 'Insufficient token',
    INVALID_PATH = 'Invalid path !',
    INVALID_USER = 'Email or password is incorrect !',
    NOTFOUND_TOKEN = 'Token not found !',
    NOTFOUND_USER = 'Email and Password is required !',
    NOT_UNIQUE_EMAIL = 'Email address is already in use. Please set different one !',
    NOT_UNIQUE_USER = 'User address is already in use. Please set different one !',
    NOT_UNIQUE_EMAIL_OR_USERNAME = 'username or email is already in use. Please set different one!',
    PERMISSION_DENIED = 'Permission denied !',
    SERVER_ERROR = 'Internal server error !',
    CANNOT_DELETE_TEAM = 'Cannot delete the team ! Match/es was played.',
    INVALID_PLAYERSTATUS = 'Invalid player status !',
    CANNOT_DELETE_PLAYER = 'Cannot delete player right now! Try again after leagues players join has been archived.'
}